import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
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

  constructor(private accountService: AccountService, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  register() {
    this.accountService.register(this.model).subscribe({
      next: (response:any) => {console.log(response); this.cancel(); },
      error: (error:any) => {console.log(error); this.toastr.error(error.error)}
    })
  }

  cancel() {
    this.cancelRegister.emit(false);
  }

}
