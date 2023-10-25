import { Component, OnInit } from '@angular/core';
import { User } from './classes/user';
import { DataService } from './data.service';
import { GlobalService } from './global.service';
import { Product } from './classes/product';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'tshirt-ecommerce';

  public user: User | undefined;
  public products: Product[] | undefined;

  constructor(private service: DataService, private globalService : GlobalService) {}

  ngOnInit(): void {
    this.service.getUser().subscribe((user) => {
      this.user = user;
      this.globalService.setUser(this.user);
    });

    this.service.getProducts().subscribe((products) => {
      this.products = products;
      this.globalService.updateProducts(products);
    })

  }
}
