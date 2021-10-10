const BASE_API = 'http://localhost:8080/pos';
const CUSTOMER_SERVICE_API = `${BASE_API}/customers`;
const PAGE_SIZE = 6;
let customers = [];
let totalCustomers = 0;
let selectedPage = 1;
loadAllCustomers();
/* load all customers */
function loadAllCustomers() {
    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
        if (http.readyState === http.DONE) {
            if (http.status !== 200) {
                alert('Failed to fetch customers, try again..!');
                return;
            }
            totalCustomers = +(http.getResponseHeader('X-Total-Count'));
            customers = JSON.parse(http.responseText);
            $('#tblCustomers tbody tr').remove();
            customers.forEach((c) => {
                const rowHtml = `<tr>
                                    <td>${c.id}</td>
                                    <td>${c.name}</td>
                                    <td>${c.address}</td>
                                    <td><i class="fas fa-trash"></i></td>
                                </tr>`;
                $('#tblCustomers tbody').append(rowHtml);
            });
            initPagination();
        }
    };
    http.open('GET', CUSTOMER_SERVICE_API + `?page=${selectedPage}&size=${PAGE_SIZE}`, true);
    http.send();
}
/* pagination */
function initPagination() {
    const PAGE_COUNT = Math.ceil(totalCustomers / PAGE_SIZE);
    let html = `<li class="page-item"><a class="page-link" href="#">Previous</a></li>`;
    for (let i = 0; i < PAGE_COUNT; i++) {
        html += `<li class="page-item"><a class="page-link" href="#">${i + 1}</a></li>`;
    }
    html += `<li class="page-item"><a class="page-link" href="#">Next</a></li>`;
    $('.pagination').html(html);
}
export {};
