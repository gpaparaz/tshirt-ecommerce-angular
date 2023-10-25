import { Injectable } from '@angular/core';
import { CartProduct } from './classes/cartProduct';
import { Cart } from './classes/cart';
import { BehaviorSubject } from 'rxjs';
import { User } from './classes/user';
import { Product } from './classes/product';
import { shippingFees } from './classes/constants';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  private productsSubject = new BehaviorSubject<Product[]>([]);

  products$ = this.productsSubject.asObservable();

  updateProducts(newProducts: Product[]) {
    this.productsSubject.next(newProducts);
  }

  private userSubject = new BehaviorSubject<User | null>(null);

  user$ = this.userSubject.asObservable();

  setUser(user: User | null) {
    this.userSubject.next(user);
  }

  cartProduct: CartProduct = new CartProduct(0, 0, '', '', 0, 0, 0);

  private cartSubject = new BehaviorSubject<Cart>(
    new Cart(Math.floor(10000 + Math.random() * 90000), [], 0, shippingFees)
  );

  get cart$() {
    return this.cartSubject.asObservable();
  }

  updateCart(cart: Cart) {
    this.cartSubject.next(cart);
  }

  resetCart() {
    this.cartSubject.next(new Cart(Math.floor(10000 + Math.random() * 90000), [], 0, shippingFees));
  }

  getCartProduct(): CartProduct {
    return this.cartProduct;
  }

  setCartProduct(cartProduct: CartProduct) {
    this.cartProduct = cartProduct;
  }

  getCartTotalPrice(): number {
    return this.cartSubject.value.totalPrice;
  }

  checkCartCreditLimit(): boolean {
    const totalPrice =
      this.cartSubject.value.totalPrice +
      this.cartProduct.price * this.cartProduct.quantity;
    return totalPrice <= this.userSubject.value!.credit;
  }

  addProductInCart() {
    const existingProduct = this.cartSubject.value.products.find(
      (p) =>
        p.articleNumber === this.cartProduct.articleNumber &&
        p.colorId === this.cartProduct.colorId
    );
    if (existingProduct) {
      // If the product already exists, add the quantity
      existingProduct.quantity += this.cartProduct.quantity;
    } else {
      this.cartSubject.value.products.push(this.cartProduct);
      this.cartSubject.value.totalPrice =
        this.cartSubject.value.totalPrice +
        this.cartProduct.price * this.cartProduct.quantity;
    }
  }

  updateCartWhenChangingQuantity(
    updatedProduct: CartProduct,
    newQuantity: number
  ) {
    const index = this.cartSubject.value.products.findIndex(
      (product) => product.id === updatedProduct.id
    );

    if (index !== -1) {
      // Clone the existing cart
      const updatedCart = { ...this.cartSubject.value };
      // Clone the product to update
      const updatedProductCopy = { ...updatedProduct };

      updatedProductCopy.quantity = newQuantity;

      // Replace the product in the cart array with the updated product
      updatedCart.products[index] = updatedProductCopy;

      // Recalculate the total price of the cart
      updatedCart.totalPrice = updatedCart.products.reduce(
        (total, product) => total + product.price * product.quantity,
        0
      );

      // Return the updated cart
      this.cartSubject.next(updatedCart);
    } else {
      // Return the cart unchanged if the product was not found
      return;
    }
  }

  removeProductFromCart(cartProduct: CartProduct) {
    const currentCart = this.cartSubject.value;
    const updatedProducts = currentCart.products.filter(
      (product) =>
        !(
          product.articleNumber === cartProduct.articleNumber &&
          product.colorId === cartProduct.colorId
        )
    );
    const newTotal =
      currentCart.totalPrice - cartProduct.price * cartProduct.quantity;

    // Adjust the total based on the remaining products
    const updatedCart = new Cart(
      currentCart.orderCode,
      updatedProducts,
      currentCart.userId,
      newTotal
    );

    this.updateCart(updatedCart);
  }
}
