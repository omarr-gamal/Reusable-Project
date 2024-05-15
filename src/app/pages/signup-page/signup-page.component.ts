import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Firestore } from '@angular/fire/firestore';
import { FormBuilder, Validators } from '@angular/forms';

import { Router } from '@angular/router';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrl: './signup-page.component.css'
})
export class SignupPageComponent {
  signupError: boolean = false;
  signupErrorMessage: string = '';

  signupForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    displayName: ['', [Validators.required]]
  })

  constructor(
    public auth: AuthService, 
    public firestore: Firestore,
    private fb: FormBuilder,
    private router: Router
  ) { }

  signup() {
    const { email, password, displayName } = this.signupForm.value;

    this.auth.emailSignUp(email!, password!, displayName!).subscribe({
      next: (loggedIn: Boolean) => {
        if (loggedIn) {
          this.router.navigate(['/']); 
        } else {
          this.signupError = true;
          this.signupErrorMessage = "Something went wrong. Please try again.";
        }
      },
      error: (error) => {
        console.log(error);
        this.signupError = true;
        this.signupErrorMessage = "Something went wrong. Please try again.";
      }
    })
  }

  googleSignup() {
    this.auth.googleSignin(true)
    this.auth.user$.subscribe((user) => {
      if (user) {
        this.router.navigate(['/']);
      }
    })
  }

  isInvalid(field: string): boolean {
    const control = this.signupForm.get(field);
    if (control) {
      return control.invalid && (control.touched || control.dirty);
    }
    return false;
  }

  getErrorMessage(field: string): string {
    const control = this.signupForm.get(field);
    if (!control) return '';

    const errors = control.errors;
    if (!errors) return '';

    if (errors['required']) return 'You must enter a value';
    if (errors['email']) return 'Not a valid email';
    if (errors['minlength']) return 'Password must be at least 6 characters long';
    
    return '';
  }
}
