import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Product } from '../classes/product';
import { ColorFilter } from '../classes/colorFilter';
import { Query } from '../classes/query';
import { GlobalService } from '../global.service';
import { CartProduct } from '../classes/cartProduct';
import { User } from '../classes/user';
import { Cart } from '../classes/cart';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  public allProducts: Product[] | undefined;

  //filters
  public products: Product[] | undefined;
  public brands: String[] | undefined;
  public colorFilters: ColorFilter[] | undefined;
  public query: Query = new Query('', '', '');

  public showToast: boolean = false;
  public showAlertColor: boolean = false;
  public showWarningWallet: boolean = false;
  public user: User |undefined;
  public cart: Cart | undefined;

  constructor(
    private service: DataService,
    private globalService: GlobalService
  ) {

    this.globalService.user$.subscribe((user) => {
      this.user = user!;
    });

    this.globalService.cart$.subscribe((cart) => {
      this.cart = cart;
    });

    this.globalService.cartProduct = new CartProduct(0,0,'','',0,0,0);

  }

  ngOnInit(): void {

    this.globalService.products$.subscribe((products) => {
      this.products = products;
      this.allProducts = products;
    });

    this.service.getColors().subscribe((res) => {
      this.colorFilters = res;
    });

    this.service.getBrands().subscribe((res) => {
      this.brands = res;
    });

    this.globalService.cartProduct= new CartProduct(0,0,'','',0,0,0);
  }

  setColorFilter(colodId: number) {
    this.query.colorId = String(colodId);
    this.filterProducts();
  }

  filterProducts() {
    this.service.getFilteredProducts(this.query).subscribe((res) => {
      this.products = res;
    });
  }

  resetFilters() {
    this.query = new Query('', '', '');
    this.products = this.allProducts;
  }

  setColor(product: Product, id: number) {
    this.globalService.cartProduct = new CartProduct(
      product.id,
      product.articleNumber,
      product.name,
      product.imgUrl,
      product.price,
      id,
      1
     );
  }

  addProductInCart(product: Product) {
    if (this.globalService.cartProduct.colorId === 0 || this.globalService.cartProduct.colorId === undefined) {
      this.showAlertColor = true;
    }
    else {
      if (this.globalService.checkCartCreditLimit()) {
        this.showToast = true;
        this.globalService.addProductInCart();
      } else {
        this.showWarningWallet = true;
      }
    }
  }

  isColorDisabled(product: Product, colorId: number): boolean {
    const selectedColor = product.colors.find(item => item.colorId === colorId);
    return selectedColor ? selectedColor.quantity === 0 : true;
  }
}
