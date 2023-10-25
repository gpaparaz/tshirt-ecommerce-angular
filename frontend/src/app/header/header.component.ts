import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';
import { User } from '../classes/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  public user: User | undefined;

  constructor(private globalService : GlobalService) {
    this.globalService.user$.subscribe((user) => {
      this.user = user!;
    });
  }

  navbarCollapsed = true;

    toggleNavbarCollapsing() {
        this.navbarCollapsed = !this.navbarCollapsed;
    }

}
