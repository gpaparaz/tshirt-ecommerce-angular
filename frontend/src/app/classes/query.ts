export class Query {
  colorId:string;
  brand:string;
  availability:string;
  constructor(colorId:string, brand:string,availability:string){
    this.colorId = colorId;
    this.brand = brand;
    this.availability = availability;
  }
}
