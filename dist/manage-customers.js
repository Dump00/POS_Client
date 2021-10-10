const BASE_API = 'http://localhost:8080/pos';
const CUSTOMER_SERVICE_API = `${BASE_API}/customers`;
let customers = [];
let totalCustomers = 0;
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
        }
    };
    http.open('GET', CUSTOMER_SERVICE_API + '?page=1&size=6', true);
    http.send();
}
export {};
