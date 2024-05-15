import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  logOutItems: MenuItem[] = [];
  items: MenuItem[] = [];
  user: any;

  constructor(public auth: AuthService, private router: Router) { }

  ngOnInit() {
    this.auth.user$.subscribe((user) => {
      this.user = user;
      this.updateMenuItems();
    });
  }
  activeMenu(event: any) {
    let node;
    if (event.target.tagName === 'A') {
      node = event.target;
    } else {
      node = event.target.parentNode;
    }
    let menuitem = document.getElementsByClassName('ui-menuitem-link');
    for (let i = 0; i < menuitem.length; i++) {
      menuitem[i].classList.remove('active');
    }
    node.classList.add('active');
  }

  updateMenuItems() {
    this.items = [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: ['/dashboard'],
      },
      {
        label: 'Transactions',
        icon: 'pi pi-money-bill',
        routerLink: ['/transactions'],
      },
      {
        label: 'Income',
        icon: 'pi pi-building-columns',
        routerLink: ['/incomes'],
      },
      {
        label: 'Budgets',
        icon: 'pi pi-briefcase',
        routerLink: ['/budgets'],
      },
      {
        label: 'Saving goals',
        icon: 'fa-solid fa-piggy-bank',
        routerLink: ['/saving-goals'],
      },
    ];

    if (this.user) {
      this.logOutItems = [{
        label: this.user.displayName,
        items: [
          {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            command: () => {
              this.auth.signOut();
              this.redirectToLoginPage();
            },
          },
        ],
      }];
    }
  }

  redirectToLoginPage(): void {
    this.router.navigate(['/login']);
  }
}
