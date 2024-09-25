
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, Validators, FormControl } from '@angular/forms';

import { UserService } from 'src/service/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginform: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router) {

  }

  ngOnInit() {
    // this.createRegistrationForm()
    this.loginform = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }
  get f() { return this.loginform.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginform.invalid) {
      return;
    }

    
    this.userService.login(this.loginform.value).subscribe((res: any) => {
      console.log(res);
      this.toastr.success(res.Message);
      this.router.navigate(['/home']);

    }, (e) => {
      console.log(e)
      if(e.error.Message)this.toastr.error(e.error.Message)
      else this.toastr.error(e.error)
    })
  }
  // forgot password method 
  navigateForgotPassword(){
    this.router.navigate(['/forgotpassword'])
  }
}
