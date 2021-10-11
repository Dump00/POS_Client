"use strict";
const BASE_API = 'http://localhost:8080/pos';
const CUSTOMER_SERVICE_API = `${BASE_API}/customers`;
let totalCustomers = 0;
loadDetails();
function loadDetails() {
    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
        if (http.readyState === http.DONE) {
            if (http.status !== 200)
                return;
            totalCustomers = +(http.getResponseHeader('X-Total-Count'));
            ($('#customer-count').html(totalCustomers + ''));
        }
    };
    http.open('GET', CUSTOMER_SERVICE_API + `?page=${1}&size=${6}`, true);
    http.send();
}
