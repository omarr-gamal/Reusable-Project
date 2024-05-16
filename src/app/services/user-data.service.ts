import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor(
    auth: AuthService
  ) { }
}
