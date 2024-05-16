import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { HttpClient } from '@angular/common/http';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';

import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { switchMap, take, filter, map, catchError } from 'rxjs/operators';
import { User, defaultUser } from '../models/user.model';
import { getAuth, signInWithPopup, GoogleAuthProvider, getAdditionalUserInfo } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
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
    this.userSubject = new BehaviorSubject<User | null | undefined>(this.loadUserFromLocalStorage());
    this.user$ = this.userSubject.asObservable();
  }

  login(email: string, password: string): Observable<User | null> {
    const requestBody = { email, password };
    return this.http.post<any>(`${AuthService.backendUrl}/api/login`, requestBody).pipe(
      map(response => {
        this.saveUserToLocalStorage(response.User);
        this.userSubject.next(response.User);
        return response.User
      }),
      catchError((err) => {
        console.log(err)
        return of(null);
      })
    );
  }

  signup(email: string, password: string, name: string, age: number, gender: string): Observable<User | null> {
    const requestBody = { 
      email,
      password,
      name,
      age,
      gender
    };
    return this.http.post<any>(`${AuthService.backendUrl}/api/register`, requestBody).pipe(
      map(response => {
        this.saveUserToLocalStorage(response.User);
        this.userSubject.next(response.User);
        return response.User
      })
    )
  }

  logout(): void {
    this.deleteUserFromLocalStorage();
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  refreshUserState() {
    this.user$.subscribe((user: any) => {
      if (user) {
        this.login(user.email!, user.password!).subscribe();
      }
    });
  }

  async googleSignin(newUser: Boolean) {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then((result) => {
      var user;
      if (newUser) {
        user = {
          ...defaultUser,
          uid: result.user.uid,
          name: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL,
        }
        return this.updateUserData(user as User);
      } else {
        return of(true);
      }
    }).catch((error) => {
        console.log(error)
    });
  }

  emailSignIn(email: string, password: string): Observable<Boolean> {
    return from(this.afAuth.signInWithEmailAndPassword(email, password)).pipe(
      map((credential) => {
        if (credential && credential.user) {
          return true
        } else {
          return false;
        }
      }),
    )
  }

  emailSignUp(email: string, password: string, displayName: string, age: number, gender: string): Observable<any> {
    return from(this.afAuth.createUserWithEmailAndPassword(email, password)).pipe(
      switchMap((credential) => {
        if (credential && credential.user) {
          const user = {
            ...defaultUser,
            uid: credential.user.uid,
            displayName: displayName,
            email: email,
          }
          
          return from(this.updateUserData(user as User));
        } else {
          return of(null);
        }
      }),
    )
  }
  
  private updateUserData(user: User): Observable<Boolean> {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.id}`);

    return from(userRef.set(user, { merge: true })).pipe(
      map(() => true), // If the promise resolves, emit true
      catchError(() => of(false)) // If there's an error, emit false
    );
  }

  async signOut() {
    await this.afAuth.signOut();
    return this.router.navigate(['/']);
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
