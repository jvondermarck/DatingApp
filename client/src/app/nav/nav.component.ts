import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {} // [(ngModel)]="model.username & .password" in the html form 

  constructor(public accountService: AccountService) { } // public to use it in our html nav

  ngOnInit(): void {}

  // it returns an obersable so we have to subscribe to it to get the date. 
  login() { // method called when click on submit button on the html form
    this.accountService.login(this.model).subscribe({ // we call the account service class
      next: (response:any) => {
        console.log(response);
      },
      error: (error:any) => {console.log(error)}
    })
  }

  logout() {
    this.accountService.logout();
  }

  // getCurrentUser() {
  //   this.accountService.currentUser$.subscribe({
  //     next: user => this.loggedIn = !!user, // !! : turn object to bolean : means if user is null then it's false
  //     error: error => console.log(error)
  //   })
  // }
}
