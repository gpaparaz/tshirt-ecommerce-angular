import { ProductDetail } from "./productDetail";

export interface Product {
  id:number;
  articleNumber: number;
  name: string;
  price: number;
  description: string;
  imgUrl: string;
  brand:string ;
  colors:ProductDetail[];

}
