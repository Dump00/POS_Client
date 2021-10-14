export class Order {
    constructor(orderId, orderDate, customerId, customerName, orderTotal, orderDetails) {
        this.orderId = orderId;
        this.orderDate = orderDate;
        this.customerId = customerId;
        this.customerName = customerName;
        this.orderTotal = orderTotal;
        this.orderDetails = orderDetails;
    }
}
