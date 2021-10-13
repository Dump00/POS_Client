import { Item } from "./dto/item.js";
const BASE_API = 'http://localhost:8080/pos';
const ITEM_SERVICE_API = `${BASE_API}/items`;
const PAGE_SIZE = 6;
let items = [];
let totalItems = 0;
let selectedPage = 1;
let pageCount = 1;
loadAllItems();
function loadAllItems() {
    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
        if (http.readyState === http.DONE) {
            if (http.status !== 200)
                return;
            totalItems = +(http.getResponseHeader('X-Total-Count'));
            $('#tblItems tbody tr').remove();
            items = JSON.parse(http.responseText);
            items.forEach((c) => {
                const rowHtml = `<tr>
                                    <td>${c.code}</td>
                                    <td>${c.description}</td>
                                    <td>${c.qtyOnHand}</td>
                                    <td>${c.unitPrice}</td>
                                    <td><i class="fas fa-trash"></i></td>
                                </tr>`;
                $('#tblItems tbody').append(rowHtml);
            });
            initPagination();
        }
    };
    http.open('GET', ITEM_SERVICE_API + `?page=${selectedPage}&size=${PAGE_SIZE}`, true);
    http.send();
}
/* pagination */
function initPagination() {
    pageCount = Math.ceil(totalItems / PAGE_SIZE);
    showOrHidePagination();
    if (pageCount == 1)
        return;
    let html = `<li class="page-item"><a class="page-link" href="javascript:void(0);">Previous</a></li>`;
    for (let i = 0; i < pageCount; i++) {
        html += `<li class="page-item ${selectedPage === (i + 1) ? 'active' : ''}"><a class="page-link" href="javascript:void(0);">${i + 1}</a></li>`;
    }
    html += `<li class="page-item"><a class="page-link" href="javascript:void(0);">Next</a></li>`;
    $('.pagination').html(html);
    $('.page-item .page-link').on('click', (eventData) => eventData.preventDefault());
    if (selectedPage === 1) {
        $('.page-item:first-child').addClass('disabled');
    }
    else if (selectedPage === pageCount) {
        $('.page-item:last-child').addClass('disabled');
    }
    $('.page-item:first-child').on('click', () => navigateToPage(selectedPage - 1));
    $('.page-item:last-child').on('click', () => navigateToPage(selectedPage + 1));
    $('.page-item:not(.page-item:first-child, .page-item:last-child)').on('click', function () {
        navigateToPage(+$(this).text());
    });
}
/* pagination navigation */
function navigateToPage(page) {
    if (page < 1 || page > pageCount)
        throw 'Invalid Page Number';
    selectedPage = page;
    loadAllItems();
}
/* hide tha pagination whenever needed */
function showOrHidePagination() {
    pageCount > 1 ? $('.pagination').show() : $('.pagination').hide();
}
/* save button click */
$('#btn-save').on('click', (eventData) => {
    eventData.preventDefault();
    const txtCode = $('#txtCode');
    const txtDescription = $('#txtDescription');
    const txtQtyOnHand = $('#txtQtyOnHand');
    const txtUnitPrice = $('#txtUnitPrice');
    let code = txtCode.val().trim();
    let description = txtDescription.val().trim();
    let qtyOnHand = txtQtyOnHand.val().trim();
    let unitPrice = txtUnitPrice.val().trim();
    if (!/^I\d{3}$/.test(code)) {
        alert('Invalid Item Code');
        txtCode.trigger('focus');
        return;
    }
    if (!/^[A-Za-z ]+$/.test(description)) {
        alert('Invalid Item Description');
        txtCode.trigger('focus');
        return;
    }
    if (+qtyOnHand < 0 || !/\d+/.test(qtyOnHand)) {
        alert('Invalid Quantity on Hand');
        txtCode.trigger('focus');
        return;
    }
    if (+unitPrice < 0 || !/\d+./.test(unitPrice)) {
        alert('Invalid Unit Price');
        txtCode.trigger('focus');
        return;
    }
    ($('#btn-save').html() === 'Save') ? saveItem(new Item(code, description, +qtyOnHand, +unitPrice)) : updateItem(new Item(code, description, +qtyOnHand, +unitPrice));
});
/* save item */
function saveItem(item) {
    console.log(item);
    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
        if (http.readyState === http.DONE) {
            if (http.status !== 201) {
                alert('Failed to save the Item, try again...!');
                return;
            }
            alert('Item has been saved successfully');
            navigateToPage(pageCount);
            $('#txtCode, #txtDescription, #txtQtyOnHand, #txtUnitPrice').val('');
            $('#txtCode').trigger('focus');
        }
    };
    http.open('POST', ITEM_SERVICE_API, true);
    http.setRequestHeader('Content-Type', 'application/json');
    http.send(JSON.stringify(item));
}
/* trash button click */
$('#tblItems tbody').on('click', 'tr td i', function (eventData) {
    const code = $(this).parent().parent().find('td:first-child').html();
    deleteItem(code);
});
/**
 *
 * @todo: small bug;
 * whenever deleted the last data on the table table should move backwords on previus paginated page
 */
/* delete the item */
function deleteItem(code) {
    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
        if (http.readyState === http.DONE) {
            if (http.status !== 204) {
                alert('Failed to delete the item!');
                return;
            }
            alert('Item has been deleted successfully.');
            navigateToPage(pageCount);
        }
    };
    http.open('DELETE', ITEM_SERVICE_API + `?code=${code}`, true);
    http.send();
}
/* table row click */
$('#tblItems tbody').on('click', 'tr', function (eventData) {
    const code = $(this).find('td:first-child').html();
    const description = $(this).find('td:nth-child(2)').html();
    const qtyOnHand = $(this).find('td:nth-child(3)').html();
    const unitPrice = $(this).find('td:nth-child(4)').html();
    $('#txtCode').val(code);
    $('#txtDescription').val(description);
    $('#txtQtyOnHand').val(qtyOnHand);
    $('#txtUnitPrice').val(unitPrice);
    $('#btn-save').html('Update');
});
/**
 *
 * @todo: when code changes for a already in item then that item is going to update insted the selected one
 */
/* update item */
function updateItem(item) {
    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
        if (http.readyState === http.DONE) {
            if (http.status !== 204) {
                alert('Failed to updae the item!');
                return;
            }
            alert('Item has been updated successfully.');
            $('#txtCode').val('');
            $('#txtDescription').val('');
            $('#txtQtyOnHand').val('');
            $('#txtUnitPrice').val('');
            $('#btn-save').html('Save');
            navigateToPage(pageCount);
        }
    };
    http.open('PUT', ITEM_SERVICE_API + `?id=${item.code}`, true);
    http.setRequestHeader('Content-Type', 'application/json');
    http.send(JSON.stringify(item));
}
/* clear button event */
$('#btn-clear').on('click', () => {
    $('#txtCode').val('');
    $('#txtDescription').val('');
    $('#txtQtyOnHand').val('');
    $('#txtUnitPrice').val('');
    $('#btn-save').html('Save');
});
