import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { UserDataService } from '../../services/user-data.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  logOutItems: MenuItem[] = [];
  items: MenuItem[] = [];
  user: any;

  constructor(
    public auth: AuthService,
    public userData: UserDataService,
    private router: Router
  ) { }

  ngOnInit() {
    this.auth.user$.subscribe((user) => {
      this.user = user;
      console.log(user);
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
        label: 'Statistics',
        icon: 'pi pi-chart-line',
        routerLink: ['/statistics'],
      },
    ];

    if (this.user) {
      this.logOutItems = [
        {
          label: this.user.name,
          items: [
            {
              label: 'Logout',
              icon: 'pi pi-sign-out',
              command: () => {
                this.auth.logout();
                this.redirectToLoginPage();
              },
            },
            {
              label: 'Profile',
              icon: 'pi pi-user',
              command: () => {
                this.router.navigate(['/profile']);
              },
            },
          ],
        },
      ];
    }
  }

  redirectToLoginPage(): void {
    this.router.navigate(['/login']);
  }
}
