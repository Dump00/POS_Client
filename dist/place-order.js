const BASE_API = 'http://localhost:8080/pos';
const ORDER_SERVICE_API = `${BASE_API}/orders`;
const PAGE_SIZE = 6;
let orders = [];
let totalOrders = 0;
let selectedPage = 1;
let pageCount = 1;
loadAllOrders();
function loadAllOrders() {
    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
        if (http.readyState === http.DONE) {
            if (http.status !== 200)
                return;
        }
    };
    http.open('GET', ORDER_SERVICE_API + `?page=${selectedPage}&size=${PAGE_SIZE}`, true);
    http.send();
}
export {};
