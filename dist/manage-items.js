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
                                    <td>${c.unitPrice}</td>
                                    <td>${c.qtyOnHand}</td>
                                    <td><i class="fas fa-trash"></i></td>
                                </tr>`;
                $('#tblItems tbody').append(rowHtml);
            });
        }
    };
    http.open('GET', ITEM_SERVICE_API + `?page=${selectedPage}&size=${PAGE_SIZE}`, true);
    http.send();
}
export {};
