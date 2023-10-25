const {
  productsArray,
  colorsArray,
  brandsArray,
  currentUser,
} = require("../utilities/readData");
const {
  convertProductEntityToModel,
  filterProductsAccordingQuery,
  checkProductAvailability,
  receiveCartAndUpdateBaseData,
} = require("../utilities/utilityFunctions");

const { ReadQuery } = require("../classes/models");
const { CartProducts, Cart } = require("../classes/entities");

const express = require("express");
const router = express.Router();


router.get("/products", (req, res) => {
  // Extract the parameters from the query string
  // convert the query into a class that will help filtering
  const query = ReadQuery.from(req.query);

  // pass query to the function that will act as a filter
  if (query.colorId !== undefined || query.availability !== undefined) {
    var filteredProducts = filterProductsAccordingQuery(productsArray, query);

    // converts filtered values to template
    var convertedFilteredProducts =
      convertProductEntityToModel(filteredProducts);

    //then send the reply
    res.send(convertedFilteredProducts);
  } 
  else{
    const productsModels = convertProductEntityToModel(productsArray);
    res.send(productsModels);
  }
});

router.get("/colors", (req, res) => {
  res.json(colorsArray);
});

router.get("/brands", (req, res) => {
  res.send(brandsArray);
});

router.get("/products/:id", (req, res) => {
  var id = req.params.id;

  const productsModels = convertProductEntityToModel(productsArray);

  var productId = productsModels.find((element) => element.id == id);

  res.send(productId);
});

router.get("/user", (req, res) => {
  res.send(currentUser);
});

router.post("/check-availability", (req, res) => {
  const products = req.body;

  // Check product availability and send an appropriate response
  const areAvailable = checkProductAvailability(products, productsArray);

  res.send(areAvailable);
});

router.post("/update-credit", (req, res) => {
  const updatedCart = req.body;

  const cartProducts = updatedCart.products.map((productJSON) => {
    return new CartProducts(
      productJSON.id,
      productJSON.articleNumber,
      productJSON.colorId,
      productJSON.quantity
    );
  });

  const cart = new Cart(
    updatedCart.orderCode,
    updatedCart.userId,
    updatedCart.totalPrice,
    cartProducts
  );

  // Run the logic to update the user's credit based on the cart
  receiveCartAndUpdateBaseData(cart, productsArray);

  // After updating the credit, return the user with the updated credit
  const response = {
    user: currentUser, // new user credit
    products: convertProductEntityToModel(productsArray), // updated products
  };
  res.send(response);
});

module.exports = router;
