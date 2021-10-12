import { Item } from "./dto/item";

const BASE_API = 'http://localhost:8080/pos';
const ITEM_SERVICE_API = `${BASE_API}/items`;
const PAGE_SIZE = 6;

let items: Array<Item> = [];
let totalItems = 0;
let selectedPage = 1;
let pageCount = 1;

loadAllItems();

function loadAllItems(): void {
    const http = new XMLHttpRequest();

    http.onreadystatechange = () => {
        if(http.readyState === http.DONE){
            if(http.status !== 200) return;
            totalItems = +(http.getResponseHeader('X-Total-Count'))!;
            $('#tblItems tbody tr').remove();
            items = JSON.parse(http.responseText); 
            items.forEach((c) => {
                const rowHtml = `<tr>
                                    <td>${c.code}</td>
                                    <td>${c.description}</td>
                                    <td>${c.unitPrice}</td>
                                    <td>${c.qtyOnHand}</td>
                                    <td><i class="fas fa-trash"></i></td>
                                </tr>`
                $('#tblItems tbody').append(rowHtml)
            });

            initPagination();
        }
    }

    http.open('GET', ITEM_SERVICE_API + `?page=${selectedPage}&size=${PAGE_SIZE}`, true);

    http.send();
}


/* pagination */

function initPagination(): void {

    console.log(totalItems);
    

    pageCount = Math.ceil(totalItems/PAGE_SIZE);

    showOrHidePagination();
    if(pageCount == 1) return;

    let html = `<li class="page-item"><a class="page-link" href="javascript:void(0);">Previous</a></li>`;

    for(let i = 0; i < pageCount; i++){
        html += `<li class="page-item ${selectedPage ===(i +1)? 'active' : ''}"><a class="page-link" href="javascript:void(0);">${i + 1}</a></li>`;
    }
                
    html += `<li class="page-item"><a class="page-link" href="javascript:void(0);">Next</a></li>` 

    $('.pagination').html(html);

    $('.page-item .page-link').on('click', (eventData) => eventData.preventDefault());

    if(selectedPage === 1){
        $('.page-item:first-child').addClass('disabled');
    }else if(selectedPage === pageCount){
        $('.page-item:last-child').addClass('disabled');
    }

    $('.page-item:first-child').on('click', () => navigateToPage(selectedPage - 1));
    $('.page-item:last-child').on('click', () => navigateToPage(selectedPage + 1));
    $('.page-item:not(.page-item:first-child, .page-item:last-child)').on('click', function() {
        navigateToPage(+$(this).text());
    });
}

/* pagination navigation */

function navigateToPage(page: number): void {
    if(page < 1 || page > pageCount) throw 'Invalid Page Number';
    selectedPage = page;

    loadAllItems();
}

/* hide tha pagination whenever needed */

function showOrHidePagination(): void {
    pageCount > 1 ? $('.pagination').show() : $('.pagination').hide();
}