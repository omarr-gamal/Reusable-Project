import { Component, Input } from '@angular/core';
import { ConfirmationService, PrimeNGConfig } from 'primeng/api';
import { User, defaultUser } from '../../models/user.model';

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
    // private userService: UserService,
    // private confirmationService: ConfirmationService,
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
    };
    this.originalUser = this.user;
  }

  toggleEditMode() {
    if (!this.editMode) {
      // We're entering edit mode, so store the original user data
      this.originalUser = { ...this.user };
    }
    this.editMode = !this.editMode;
  }
  saveChanges() {
    //// update the user data

    // if (this.monthlyIncome.id) {
    //   this.incomesService
    //     .updateMonthlyIncome(this.monthlyIncome.id, this.monthlyIncome)
    //     .subscribe(
    //       (result) => {
    //         console.log('Income updated successfully');
    //         this.toggleEditMode();
    //       },
    //       (error) => {
    //         console.log('Error updating income: ', error);
    //       }
    //     );
    // }
    this.toggleEditMode();
  }
  cancelEdit() {
    this.user = this.originalUser;
    this.toggleEditMode();
  }
  // deleteUser() {
  //   if (this.user.uid) {
  //     //// delete the user

  //     // this.incomesService.deleteMonthlyIncome(this.monthlyIncome.id).subscribe(
  //     //   (result) => {
  //     //     console.log('Income deleted successfully');
  //     //   },
  //     //   (error) => {
  //     //     console.log('Error deleting income: ', error);
  //     //   }
  //     // );
  //   }
  // }
}
