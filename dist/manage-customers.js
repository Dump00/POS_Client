import { Customer } from "./dto/customer.js";
const BASE_API = 'http://localhost:8080/pos';
const CUSTOMER_SERVICE_API = `${BASE_API}/customers`;
const PAGE_SIZE = 6;
let customers = [];
let totalCustomers = 0;
let selectedPage = 1;
let pageCount = 1;
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
    pageCount = Math.ceil(totalCustomers / PAGE_SIZE);
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
    loadAllCustomers();
}
/* hide tha pagination whenever needed */
function showOrHidePagination() {
    pageCount > 1 ? $('.pagination').show() : $('.pagination').hide();
}
/* save button click */
$('#btn-save').on('click', (eventData) => {
    eventData.preventDefault();
    const txtId = $('#txtId');
    const txtName = $('#txtName');
    const txtAddress = $('#txtAddress');
    let id = txtId.val().trim();
    let name = txtName.val().trim();
    let address = txtAddress.val().trim();
    if (!/^C\d{3}$/.test(id)) {
        alert('Invalid Customer ID');
        txtId.trigger('select');
        return;
    }
    if (!/^[A-Za-z ]+$/.test(name)) {
        alert('Invalid Customer Name');
        txtName.trigger('select');
        return;
    }
    if (address.length < 3) {
        alert('Invalid Customer Address');
        txtAddress.trigger('select');
        return;
    }
    saveCustomer(new Customer(id, name, address));
});
/* save customer */
function saveCustomer(customer) {
    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
        if (http.readyState === http.DONE) {
            if (http.status !== 201) {
                alert('Failed to save the customer, try again..!');
                return;
            }
            alert('Customer has been saved successfully.');
            navigateToPage(pageCount);
            $('#txtId, #txtName, #txtAddress').val('');
            $('#txtId').trigger('focus');
        }
    };
    http.open('POST', CUSTOMER_SERVICE_API, true);
    http.setRequestHeader('Content-Type', 'application/json');
    http.send(JSON.stringify(customer));
}
/* trash button click */
$('#tblCustomers tbody').on('click', 'tr td i', function (eventData) {
    const id = $(this).parent().parent().find('td:first-child').html();
    deleteCustomer(id);
});
/**
 *
 * @todo: small bug;
 * whenever deleted the last data on the table table should move backwords on previus paginated page
 */
/* delete the customer */
function deleteCustomer(id) {
    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
        if (http.readyState === http.DONE) {
            if (http.status !== 204) {
                alert('Failed to delete the customer!');
                return;
            }
            alert('Customer has been deleted successfully.');
            navigateToPage(pageCount);
        }
    };
    http.open('DELETE', CUSTOMER_SERVICE_API + `?id=${id}`, true);
    http.send();
}
/* table row click */
$('#tblCustomers tbody').on('click', 'tr', function (eventData) {
    const id = $(this).find('td:first-child').html();
    const name = $(this).find('td:nth-child(2)').html();
    const address = $(this).find('td:nth-child(3)').html();
    $('#txtId').val(id);
    $('#txtName').val(name);
    $('#txtAddress').val(address);
    $('#btn-save').html('Update');
    /* update button click */
});
/* update customer */
function updateCustomer(customer) {
    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
        if (http.readyState === http.DONE) {
            if (http.status !== 201) {
                alert('Failed to updae the customer!');
                return;
            }
            alert('Customer has been updated successfully.');
            navigateToPage(pageCount);
        }
    };
    http.open('PUT', CUSTOMER_SERVICE_API + `?id=${customer.id}`, true);
    http.setRequestHeader('Content-Type', 'application/json');
    http.send(JSON.stringify(customer));
}
