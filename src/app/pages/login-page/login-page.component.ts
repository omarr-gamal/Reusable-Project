import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Firestore } from '@angular/fire/firestore';
import { FormBuilder, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  loginError: boolean = false;
  loginErrorMessage: string = '';

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  })

  constructor(
    public auth: AuthService, 
    public firestore: Firestore,
    private fb: FormBuilder,
    private router: Router
  ) { }

  login() {
    const { email, password } = this.loginForm.value;

    this.auth.emailSignIn(email!, password!).subscribe({
      next: (loggedIn: Boolean) => {
        if (loggedIn) {
          this.router.navigate(['/']); 
        } else {
          this.loginError = true;
          this.loginErrorMessage = "Invalid email or password. Please try again.";
        }
      },
      error: (error) => {
        this.loginError = true;
        this.loginErrorMessage = "Invalid email or password. Please try again.";
      }
    })
  }

  googleSignin() {
    this.auth.googleSignin(false)
    this.auth.user$.subscribe((user) => {
      if (user) {
        this.router.navigate(['/']);
      }
    })
  }

  isInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    if (control) {
      return control.invalid && (control.touched || control.dirty);
    }
    return false;
  }

  getErrorMessage(field: string): string {
    const control = this.loginForm.get(field);
    if (!control) return '';

    const errors = control.errors;
    if (!errors) return '';

    if (errors['required']) return 'You must enter a value';
    if (errors['email']) return 'Not a valid email';
    if (errors['minlength']) return 'Password must be at least 6 characters long';
    
    return '';
  }
}
