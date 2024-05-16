import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

import { User } from '../models/user.model';
import { Observable, catchError, map, of, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor(
    private http: HttpClient, 
    private auth: AuthService
  ) { }

  updateUser(data: any): Observable<boolean> {
    return this.auth.user$.pipe(
      switchMap(user => {
        if (user) {
          const updatedUser = { ...user, ...data };
          const userId = user.id;
          return this.http.put<any>(`${AuthService.backendUrl}/api/edituser/${userId}`, data).pipe(
            map(() => {
              this.auth.refreshUserState(updatedUser);
              return true;
            }),
            catchError(err => {
              console.log(err);
              return of(false);
            })
          );
        } else {
          return of(false);
        }
      })
    );
  }

}
