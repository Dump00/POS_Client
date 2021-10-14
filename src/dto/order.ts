import { OrderDetail } from "./order-detail.js";

export class Order {
    constructor(
        public orderId: string,
        public orderDate: Date,
        public customerId: string,
        public customerName: string,
        public orderTotal: number,
        public orderDetails: OrderDetail[]
    ){}
}