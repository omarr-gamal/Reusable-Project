import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';

import { Observable, from, of } from 'rxjs';
import { switchMap, take, filter, map, catchError } from 'rxjs/operators';
import { User, defaultUser } from '../models/user.model';
import { getAuth, signInWithPopup, GoogleAuthProvider, getAdditionalUserInfo } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User | null | undefined>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) { 
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
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
          displayName: result.user.displayName,
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

  emailSignUp(email: string, password: string, displayName: string): Observable<any> {
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
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    return from(userRef.set(user, { merge: true })).pipe(
      map(() => true), // If the promise resolves, emit true
      catchError(() => of(false)) // If there's an error, emit false
    );
  }

  async signOut() {
    await this.afAuth.signOut();
    return this.router.navigate(['/']);
  }
}
