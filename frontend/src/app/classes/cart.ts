import { CartProduct } from "./cartProduct";

export class Cart {
  orderCode: number;
  products:CartProduct[];
  userId:number;
  totalPrice:number;

  constructor(orderCode: number, products:CartProduct[], userId:number, totalPrice:number){
    this.orderCode = orderCode;
    this.products = products;
    this.userId = userId;
    this.totalPrice = totalPrice;
  }
}
