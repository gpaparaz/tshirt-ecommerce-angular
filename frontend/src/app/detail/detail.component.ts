import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../classes/product';
import { CartProduct } from '../classes/cartProduct';
import { GlobalService } from '../global.service';
import { Cart } from '../classes/cart';
import { User } from '../classes/user';
import { shippingFees } from '../classes/constants';
import { Review } from '../classes/review';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit {
  public productDetail: Product | undefined;
  public cart: Cart | undefined;
  public user: User | undefined;
  public copyOfCartProduct : CartProduct | undefined;

  quantity: number = 1;
  public isInWishlist = false;
  public showToast: boolean = false;
  public showAlertColor: boolean = false;
  public showWarningWallet: boolean = false;
  public shippingFees : number = shippingFees;
  public stars = [1, 2, 3, 4];
  public availableProduct : boolean = true;
  reviews: Review[] = [];


  //activated route represents the route that has been activated, so allows access to params, paramMap etc
  constructor(
    private service: DataService,
    private route: ActivatedRoute,
    private globalService: GlobalService
  ) {
    this.reviews = [
      new Review('Steven T.', 'Ben studiata', 4, 'Acquistata per un regalo, taglia perfetta! Il disegno è spettacolare e la qualità è il massimo!'),
      new Review('Vanessa L.', 'Ottimo', 3, 'Essenziali e prodotti difficili da trovare per chi cerca abbigliamento da particolare. Ne poco ne troppo appariscente.'),
      new Review('Linda G.', 'Originale', 5, 'L\'ho presa per il mio ragazzo, veste benissimo ed è perfetta. La stampa è stupenda')
    ]
  }

  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      if (id) {
        this.service.getProductDetail(id).subscribe((productDetail) => {
          this.productDetail = productDetail;
        });
      }
    });

    this.globalService.user$.subscribe((user) => {
      this.user = user!;
    });

    this.globalService.cart$.subscribe((cart) => {
      this.cart = cart;
    });
    this.quantity = 1;
    this.globalService.cartProduct = new CartProduct(0, 0, '', '', 0, 0, 0);

    this.copyOfCartProduct = this.globalService.cartProduct;
  }


  setColorOfProduct(id: number) {
    this.globalService.cartProduct = new CartProduct(
      this.productDetail!.id,
      this.productDetail!.articleNumber,
      this.productDetail!.name,
      this.productDetail!.imgUrl,
      this.productDetail!.price,
      id,
      this.quantity
    );

    this.copyOfCartProduct!.colorId = id;
  }

  addProductToCart() {
    if (
      this.globalService.cartProduct.colorId === 0 ||
      this.globalService.cartProduct.colorId === undefined
    ) {
      this.showAlertColor = true;
    } else {
      if (this.globalService.checkCartCreditLimit()) {
        this.showToast = true;
        this.globalService.addProductInCart();
      } else {
        this.showWarningWallet = true;
      }
    }
  }

  incrementQuantity() {
    this.quantity++;
    this.globalService.cartProduct.quantity = this.quantity;
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
      this.globalService.cartProduct.quantity = this.quantity;
    }
  }

  isColorDisabled(colorId: number): boolean {
    const selectedColor = this.productDetail?.colors.find(item => item.colorId === colorId);
    if(selectedColor?.quantity === 0)
      this.availableProduct = false;
    else
      this.availableProduct = true;
    return selectedColor ? selectedColor.quantity === 0 : true;
  }

  translateBrand(brand: string): string {
    switch (brand) {
      case 'Nike':
        return 'assets/nike.jpg';
      case 'Dolce e Gabbana':
        return 'assets/d&g.png';
      case 'LiuJo':
        return 'assets/liujo.png';
      case 'Armani':
        return 'assets/armani.png';
      default:
        return '';
    }
  }

  toggleWishlist() {
    this.isInWishlist = !this.isInWishlist;
  }
}
