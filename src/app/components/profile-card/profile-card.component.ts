import { Component, Input } from '@angular/core';
import { ConfirmationService, PrimeNGConfig } from 'primeng/api';
import { User, defaultUser } from '../../models/user.model';
import { UserDataService } from '../../services/user-data.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.css',
})
export class ProfileCardComponent {
  @Input() user: User;
  originalUser: User;
  editMode: boolean = false;

  constructor(
    // private confirmationService: ConfirmationService,
    private userDataService: UserDataService,
    private authService: AuthService,
    private primengConfig: PrimeNGConfig
  ) {
    this.user = {
      ...defaultUser,
      id: '',
      email: 'user@example.com',
      name: 'User Name',
      photoURL:
        'https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg',
      age: 22,
      gender: 'F',
      joinedAt: new Date().toLocaleString(),
      thresholds: {
        temperature_thres: 0.0,
        humidity_thres: 0.0,
        pm25_thres: 0.0,
        pm10_thres: 0.0,
        co_thres: 0.0,
        pressure_mb_thres: 0.0,
        visibility_km_thres: 0.0,
        wind_kph_thres: 0.0,
        uv_thres: 0,
      },
    };
    this.originalUser = this.user;
  }

  ngOnInit(): void {
    this.authService.user$.subscribe((currentUser) => {
      if (currentUser) {
        this.user = currentUser;
      }
    });
  }

  toggleEditMode() {
    if (!this.editMode) {
      // We're entering edit mode, so store the original user data
      // this.originalUser = {
      //   ...this.user,
      //   thresholds: { ...this.user.thresholds },
      // };
      this.originalUser = JSON.parse(JSON.stringify(this.user)); // Deep clone user object
    }
    this.editMode = !this.editMode;
  }
  saveChanges() {
    //// update the user data

    if (this.user.id) {
      this.userDataService.updateUser(this.user).subscribe(
        (result) => {
          console.log('User updated successfully');
          this.toggleEditMode();
        },
        (error) => {
          console.log('Error updating User: ', error);
        }
      );
    }
    this.toggleEditMode();
  }
  cancelEdit() {
    this.user = this.originalUser;
    this.toggleEditMode();
  }
}
