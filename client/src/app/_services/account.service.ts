import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import {map} from 'rxjs/operators'
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl; // take the localhost URL definied in environment file
  private currentUserSource = new ReplaySubject<User>(1); // a buffer object, store ONE value = ONE user, either it's null or it it the current user
  currentUser$ = this.currentUserSource.asObservable(); // dollar sign bc it's convention of observable
  userName: string;

  constructor(private http: HttpClient) { }

  login(model: any){
    return this.http.post(this.baseUrl + 'account/login', model).pipe(
      // we are gonna add our user in the Local Storage (inspect element) when we refresh the page, the current user will stay
      map((response: User) => { // response from type "User" from the _models/User.ts interface
        const user = response;
        if(user) {
          localStorage.setItem('user', JSON.stringify(user)) // take the object and string it to JSON + with a key value of 'user'
          this.currentUserSource.next(user);
          this.userName = JSON.parse(localStorage.getItem('user')).username;
        }
      })
    )
  }

  register(model: any) {
    return this.http.post(this.baseUrl + 'account/register', model).pipe(
      map((user: User) => {
        if(user) {
          localStorage.setItem('user', JSON.stringify(user))
          this.currentUserSource.next(user);
        }
      })
    )
  }

  setCurrentUser(user: User) {
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null); // either it's null or contains the user connected so logout = null value
  }
}
