class ColorModel {
    constructor(colorId, colorName, quantity){
        this.colorId = colorId;
        this.colorName = colorName;
        this.quantity = quantity;
    }
}

class ProductModel {
    constructor(id,name, articleNumber,price,description,brand,imgUrl,colors ){
        this.id = id;
        this.name = name;
        this.articleNumber = articleNumber;
        this.price = price;
        this.description = description;
        this.brand = brand;
        this.imgUrl = imgUrl;
        this.colors = colors;
    }
}

class ReadQuery {
    colorId;
    brand;
    availability;
    constructor(colorId, brand, availability){
        this.colorId = colorId; 
        this.brand = brand;
        this.availability = availability;
    }

    static from(json){
        return Object.assign(new ReadQuery(), json);
      }
}


module.exports = {
    ProductModel, ColorModel, ReadQuery
  };