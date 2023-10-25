import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { GlobalService } from '../global.service';
import { Cart } from '../classes/cart';
import { Color, shippingFees } from '../classes/constants';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CartProduct } from '../classes/cartProduct';
import { User } from '../classes/user';
import { ProductAvailability } from '../classes/productAvailability';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  public cart: Cart = new Cart(Math.floor(10000 + Math.random() * 90000), [], 0, shippingFees)
  public user: User | undefined;
  public isPreOrderVisible: boolean = true;
  public isUserFormVisible: boolean = false;
  public isSummaryOrderVisible: boolean = false;
  public showWarningWallet: boolean = false;
  public showProductUnavailableWarning = false;
  public unavailableProducts: CartProduct[] = [];
  public shippingFees: number = shippingFees;
  public userForm: FormGroup;
  public currentDate: Date = new Date();
  public formattedDate: string = '';
  public copyOfCart : Cart = new Cart(Math.floor(10000 + Math.random() * 90000), [], 0, shippingFees)

  constructor(
    private service: DataService,
    private globalService: GlobalService,
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) {
    this.globalService.user$.subscribe((user) => {
      this.user = user!;
    });

    this.globalService.cart$.subscribe((cart) => {
      this.cart = cart;
    });

    this.userForm = this.fb.group({
      name: [this.user!.name, Validators.required],
      email: [this.user!.email, [Validators.required, Validators.email]],
      address: [this.user!.address, Validators.required],
      province: [this.user!.province, [Validators.required, Validators.max(2)]],
      zipCode: [this.user!.zipCode, Validators.pattern(/^\d{5}$/)],
      municipality: [this.user!.municipality, Validators.required],
      state: [this.user!.state, Validators.required],
      prefix: [this.user!.prefix, Validators.required],
      telephone: [this.user!.telephone, Validators.required],
    });

    this.formattedDate = this.sumDaysToCurrentDate(this.datePipe);
  }

  ngOnInit() {
    this.isPreOrderVisible = true;
    this.isUserFormVisible = false;
    this.isSummaryOrderVisible = false;
    this.unavailableProducts = [];
    this.copyOfCart = new Cart(Math.floor(10000 + Math.random() * 90000), [], 0, shippingFees);
  }

  sumDaysToCurrentDate(datePipe: DatePipe): string {
    const intialDate = new Date();
    const newDate = new Date(intialDate);
    newDate.setDate(intialDate.getDate() + 7);
    return datePipe.transform(newDate, 'dd/MM/yyyy')!;
  }

  translateColor(colorId: number): string {
    switch (colorId) {
      case Color.Red:
        return 'Red';
      case Color.Green:
        return 'Green';
      case Color.Blue:
        return 'Blue';

      default:
        return 'Sconosciuto';
    }
  }

  proceedWithThePurchase() {
    if (this.globalService.getCartTotalPrice() < this.user!.credit) {
      this.isPreOrderVisible = false;
      this.isUserFormVisible = true;
    } else {
      this.showWarningWallet = true;
    }
  }

  sumNumberArticles(): number {
    var quantity = 0;
    this.cart?.products.forEach((element) => {
      quantity += element.quantity;
    });
    return quantity;
  }

  completePurchase() {
    //product availability check
    var request: any = [];
    this.cart?.products.forEach((element) => {
      request.push({
        articleNumber: element.articleNumber,
        colorId: element.colorId,
        quantity: element.quantity,
      });
    });

    this.service
      .verifyIfCartProductsAreAvailable(request)
      .subscribe((response) => {
        const responseFromBackend: any[] = response;

        // Map response into objects of type ProductAvailability
        const productAvailabilities: ProductAvailability[] =
          responseFromBackend.map((item: any) => {
            return {
              articleNumber: item.articleNumber,
              colorId: item.colorId,
              availability: item.availability,
            };
          });

        if (productAvailabilities.some((item) => item.availability === false)) {
          // Extracts products with "false" availability
          const unavailableProductIds = productAvailabilities.filter(
            (item) => item.availability === false
          );

          unavailableProductIds.forEach((element) => {
            const elementToPush = this.cart?.products.find(
              (product) =>
                String(product.articleNumber) ===
                  String(element.articleNumber) &&
                String(product.colorId) === String(element.colorId)
            );
            this.unavailableProducts!.push(elementToPush!);
          });

          this.showProductUnavailableWarning = true;
        } else {
          // proceed with purchase
          this.service.updateCreditAndProducts(this.cart!).subscribe(
            (updatedResponse) => {
              this.isSummaryOrderVisible = false;
              this.globalService.setUser(updatedResponse.user);

              this.globalService.updateProducts(updatedResponse.products);

              this.copyOfCart = {...this.cart};
              this.globalService.resetCart();
              this.isUserFormVisible = false;
              this.isSummaryOrderVisible = true;
            },
            (error) => {
              console.error(
                'Errore durante l aggiornamento del credito:',
                error
              );
            }
          );
        }
      });
  }

  incrementQuantity(product: CartProduct) {
    product.quantity++;
    this.globalService.updateCartWhenChangingQuantity(
      product,
      product.quantity
    );
  }

  decrementQuantity(product: CartProduct) {
    if (product.quantity > 1) {
      product.quantity--;
      this.globalService.updateCartWhenChangingQuantity(
        product,
        product.quantity
      );
    }
  }

  removeProductFromCart(product: CartProduct) {
    this.globalService.removeProductFromCart(product);

    //clean any dirty data in case I deleted a product because it was not available
    this.unavailableProducts = [];
    this.showProductUnavailableWarning = false;
  }

  backToPreOrder() {
    this.isPreOrderVisible = true;
    this.isUserFormVisible = false;
    this.isSummaryOrderVisible = false;
  }
}
