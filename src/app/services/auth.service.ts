import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { HttpClient } from '@angular/common/http';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';

import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { switchMap, take, filter, map, catchError, first } from 'rxjs/operators';
import { User, defaultUser } from '../models/user.model';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  getAdditionalUserInfo,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public static backendUrl: string = 'https://localhost:44339';
  private userSubject: BehaviorSubject<User | null | undefined>;

  user$: Observable<User | null | undefined>;

  constructor(
    private http: HttpClient,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.userSubject = new BehaviorSubject<User | null | undefined>(
      this.loadUserFromLocalStorage()
    );
    this.user$ = this.userSubject.asObservable();
  }

  login(email: string, password: string): Observable<User | null> {
    console.log("login called");
    const requestBody = { email, password };
    return this.http
      .post<any>(`${AuthService.backendUrl}/api/login`, requestBody)
      .pipe(
        map((response) => {
          console.log("aa")
          console.log(response);
          this.saveUserToLocalStorage(response.User);
          this.userSubject.next(response.User);
          return response.User;
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  signup(
    email: string,
    password: string,
    name: string,
    age: number,
    gender: string
  ): Observable<User | null> {
    const requestBody = {
      email,
      password,
      name,
      age,
      gender,
    };
    return this.http
      .post<any>(`${AuthService.backendUrl}/api/register`, requestBody)
      .pipe(
        map((response) => {
          this.saveUserToLocalStorage(response.User);
          this.userSubject.next(response.User);
          return response.User;
        })
      );
  }

  logout(): void {
    this.signOut();
    this.deleteUserFromLocalStorage();
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  refreshUserState(user: User) {
    console.log("refreshUserState called");
    console.log(user);
    this.userSubject.next(user);
    this.saveUserToLocalStorage(user);
  }

  async googleSignin(newUser: Boolean) {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        var user;
        if (newUser) {
          user = {
            ...defaultUser,
            name: result.user.displayName,
            email: result.user.email,
            photoURL: result.user.photoURL,
          };

          this.signup(
            user.email!,
            'password1234',
            user.name!,
            user.age!,
            user.gender!
          )
            .pipe(take(1))
            .subscribe();
          return true;
        } else {
          this.login(result.user.email!, 'password1234')
            .pipe(take(1))
            .subscribe();
          return of(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async signOut() {
    await this.afAuth.signOut();
  }

  private saveUserToLocalStorage(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  private loadUserFromLocalStorage(): User | null {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
  }

  private deleteUserFromLocalStorage(): void {
    localStorage.removeItem('currentUser');
  }
}
