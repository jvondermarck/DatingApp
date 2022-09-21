import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  // @Input() usersFromHomeComponent: any; // get this data from our parent which is home component
  @Output() cancelRegister = new EventEmitter(); // emeting events - send data from child to parent

  model: any = {};

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
  }

  register() {
    this.accountService.register(this.model).subscribe({
      next: (response:any) => {console.log(response); this.cancel(); },
      error: (error:any) => {console.log(error)}
    })
  }

  cancel() {
    this.cancelRegister.emit(false);
  }

}
