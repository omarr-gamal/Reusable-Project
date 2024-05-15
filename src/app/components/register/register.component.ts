import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  formData: { email: string, password: string, name?: string } = { email: '', password: '', name: '' };
  mode: 'signin' | 'signup' = 'signin';

  submitForm(form: NgForm) {
    if (this.mode === 'signin') {
      // Handle sign in logic here
      console.log('Signing in with:', this.formData.email, this.formData.password);
    } else {
      // Handle sign up logic here
      console.log('Registering with:', this.formData.email, this.formData.password, this.formData.name);
    }
  }

  toggleMode() {
    this.mode = this.mode === 'signin' ? 'signup' : 'signin';
  }

}
