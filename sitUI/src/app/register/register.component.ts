import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, Validators, FormControl } from '@angular/forms';
import { MustMatch } from './validator';
import { UserService } from 'src/service/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  validation : any;
  constructor(private formBuilder: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router) {

  }

  ngOnInit() {
    // this.createRegistrationForm()
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      isfromcollege: [false, [Validators.required]],
      collagename: [null],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
    this.registerForm.get('isfromcollege')?.valueChanges.subscribe(() => {
      const val = this.registerForm.getRawValue();
      if (val.isfromcollege == 'true') {
        this.registerForm.controls['collagename'].setValidators(Validators.required);
        this.registerForm.controls['collagename'].updateValueAndValidity();
        this.validation = true;
      } else if((val.isfromcollege == 'false') ) {
        this.registerForm.controls['collagename'].clearValidators();
        this.registerForm.controls['collagename'].updateValueAndValidity();
        this.validation = false;
      }
    });
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }
    this.userService.register(this.registerForm.value).subscribe((res: any) => {
      console.log(res);
      this.toastr.success(res.Message);
      this.router.navigate(['/login']);
    }, (e) => {
      this.submitted = false
      console.log(e)
      if(e.error.Message)this.toastr.error(e.error.Message)
      else this.toastr.error(e.error)
    })
  }
}
