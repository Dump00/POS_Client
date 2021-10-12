const BASE_API = 'http://localhost:8080/pos';
const CUSTOMER_SERVICE_API = `${BASE_API}/customers`;
const ITEM_SERVICE_API = `${BASE_API}/items`;


let totalCustomers = 0;
let totalItems = 0;


loadNewCustomerCount();
loadNewItemsCount();


/* get the customer count */

function loadNewCustomerCount(): void {

    const http = new XMLHttpRequest();

    http.onreadystatechange = () => {
        if(http.readyState === http.DONE){
            if(http.status !== 200) return;
            totalCustomers = +(http.getResponseHeader('X-Total-Count'))!;
            ($('#customer-count').html(totalCustomers+''));
            
        }
    }

    http.open('GET', CUSTOMER_SERVICE_API + `?page=${1}&size=${6}`, true);

    http.send();
};

/* get the item count */

function loadNewItemsCount(): void {

    console.log('working');
    

    const http = new XMLHttpRequest();

    http.onreadystatechange = () => {
        if(http.readyState === http.DONE){
            if(http.status !== 200) return;
            totalItems = +(http.getResponseHeader('X-Total-Count'))!;
            $('#item-count').html(totalItems+'');
        }
    }

    http.open('GET', ITEM_SERVICE_API + `?page=${1}&size=${6}`, true);

    http.send();
};






