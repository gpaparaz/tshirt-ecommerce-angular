const { ProductModel, ColorModel } = require("../classes/models");
const { currentUser } = require("./readData");


function convertProductEntityToModel(productsArray) {
  const groupedProducts = new Map();

  productsArray.forEach((entity) => {
    const articleNumber = entity.articleNumber;
    if (!groupedProducts.has(articleNumber)) {
      groupedProducts.set(articleNumber, []);
    }
    groupedProducts.get(articleNumber).push(entity);
  });

  const productModels = Array.from(groupedProducts.values()).map((group) => {
    const firstItem = group[0];
    const colors = group.map(
      (item) => new ColorModel(item.colorId, item.colorName, item.quantity)
    );
    return new ProductModel(
      firstItem.id,
      firstItem.name,
      firstItem.articleNumber,
      firstItem.price,
      firstItem.description,
      firstItem.brand,
      firstItem.imgUrl,
      colors
    );
  });

  return productModels;
}

function filterProductsAccordingQuery(productsArray, query) {
    let filteredProducts = productsArray;

    if (query.colorId !== undefined && query.colorId !== '') {
        // Filter by colorId if specified
        filteredProducts = filteredProducts.filter(product => parseInt(product.colorId, 10) === parseInt(query.colorId, 10));
    }

    if(query.brand !== undefined && query.brand !== ''){
      filteredProducts = filteredProducts.filter(product =>product.brand === query.brand);
    }

    if (query.availability !== undefined && query.availability !== '') {
        // Filter by availability
        if (query.availability === 'true') {
            filteredProducts = filteredProducts.filter(product => parseInt(product.quantity,10) > 0);
        } else if (query.availability === 'false') {
            // Filter by false availability
            filteredProducts = filteredProducts.filter(product => parseInt(product.quantity,10) === 0);
        }
        // If query.availability is not specified, no availability filter is applied
    }
    return filteredProducts;
}

function checkProductAvailability(products, availableProducts) {
  // Create an object to track product availability
  const availability = [];

  // Scroll through the array of required products
  for (const product of products) {
    const productArticleNumber = product.articleNumber;
    const quantityRequested = product.quantity;
    const colorId = product.colorId;

    // Check if the product is available
    const availableProduct = availableProducts.find((p) => p.articleNumber === productArticleNumber && p.colorId == colorId);

    if (availableProduct) {
      // The product has been found, check the available quantity
      if (availableProduct.quantity >= quantityRequested) {
        // The product is available in sufficient quantity
        availability.push({ articleNumber: productArticleNumber, colorId, availability: true });
      } else {
        // The product is not available in sufficient quantity
        availability.push({ articleNumber: productArticleNumber, colorId, availability: false });
      }
    } else {
      // Il prodotto richiesto non è stato trovato
      availability.push({ articleNumber: productArticleNumber, colorId, availability: false });
    }
  }

  return availability;
}

function receiveCartAndUpdateBaseData(cart, allProducts){

  currentUser.credit = currentUser.credit - cart.totalPrice;

  // updates the quantity of products available in DB
  cart.products.forEach( product => {
    allProducts.forEach(item => {
      if(item.articleNumber === product.articleNumber && item.colorId === product.colorId){
        item.quantity = item.quantity - product.quantity;
      } 
    })
  })
}

module.exports = {
  convertProductEntityToModel,
  filterProductsAccordingQuery,
  checkProductAvailability,
  receiveCartAndUpdateBaseData
};
