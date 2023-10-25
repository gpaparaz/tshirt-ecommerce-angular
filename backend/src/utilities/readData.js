"use strict";

const fs = require("fs");
const { ProductEntity, ColorEntity, UserEntity } = require("../classes/entities");

const path = require("path");

// Generate the full path to the data.json file
const dataFilePath = path.join(__dirname, "./data.json");
let rawdata = fs.readFileSync(dataFilePath);
let allData = JSON.parse(rawdata);

// json specialized
var user = allData.user;
var products = allData.products;
var colors = allData.colors;
var brands = allData.brand;

// map the json products into objects
const productsArray = [];
products.forEach((obj) => {
  const product = new ProductEntity(
    obj.id,
    obj.name,
    obj.articleNumber,
    obj.price,
    obj.description,
    obj.brand,
    obj.imgUrl,
    obj.colorName,
    obj.colorId,
    obj.quantity
  );

  productsArray.push(product);
});


const colorsArray = [];
colors.forEach((obj) => {
  const color = new ColorEntity(
    obj.colorId,
    obj.colorName,    
  );

  colorsArray.push(color);
});

const brandsArray = [];
brands.forEach((obj) => {
  brandsArray.push(obj)
})

const currentUser = Object.assign(new UserEntity(), user);

module.exports = {
    productsArray, colorsArray, brandsArray, currentUser
  };
