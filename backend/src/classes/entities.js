class ProductEntity {
  constructor(
    id,
    name,
    articleNumber,
    price,
    description,
    brand,
    imgUrl,
    colorName,
    colorId,
    quantity
  ) {
    this.id = id;
    this.name = name;
    this.articleNumber = articleNumber;
    this.price = price;
    this.description = description;
    this.brand = brand;
    this.imgUrl = imgUrl;
    this.colorName = colorName;
    this.colorId = colorId;
    this.quantity = quantity;
  }
}

class ColorEntity {
  constructor(colorId, colorName) {
    this.colorId = colorId;
    this.colorName = colorName;
  }
}

class UserEntity {
  constructor(
    id,
    name,
    email,
    credit,
    address,
    zipCode,
    province,
    municipality,
    state,
    prefix,
    telephone
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.credit = credit;
    this.address = address;
    this.zipCode = zipCode;
    this.province = province;
    this.municipality = municipality;
    this.state = state;
    this.prefix = prefix;
    this.telephone = telephone;
  }
}

class Cart {
  constructor(
    orderCode,
    userId,
    totalPrice,
    products
  ) {
    this.orderCode = orderCode;
    this.userId = userId;
    this.totalPrice =totalPrice;
    this.products = products;
  }
}

class CartProducts {
  constructor(
    id,
    articleNumber,
    colorId,
    quantity
  ) {
    this.id = id;
    this.articleNumber = articleNumber;
    this.colorId = colorId;
    this.quantity = quantity;
  }
}

module.exports = {
  ProductEntity,
  UserEntity,
  ColorEntity,
  Cart,
  CartProducts
};
