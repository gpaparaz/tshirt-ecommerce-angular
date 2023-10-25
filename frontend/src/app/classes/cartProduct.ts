export class CartProduct {
  id: number;
  articleNumber: number;
  name: string;
  imgUrl:string;
  price: number;
  colorId: number;
  quantity: number;
  constructor(
    id: number,
    articleNumber: number,
    name:string,
    imgUrl:string,
    price: number,
    colorId: number,
    quantity: number
  ) {
    this.id = id;
    this.articleNumber = articleNumber;
    this.name = name;
    this.imgUrl = imgUrl;
    this.price = price;
    this.colorId = colorId;
    this.quantity = quantity;
  }
}
