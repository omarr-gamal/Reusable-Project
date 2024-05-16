import { Component, inject } from '@angular/core';

import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import { faPen, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'

import { Firestore } from '@angular/fire/firestore';
import { AuthService } from './services/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Wimdy';

  // Icons
  faTrashAlt = faTrashAlt
  faPen = faPen
  faCheck = faCheck
  faXmark = faXmark

  constructor(
    public auth: AuthService
  ) { }

}
