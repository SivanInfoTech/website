import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CourseService } from 'src/service/course.service';

@Component({
  selector: 'app-verifycert',
  templateUrl: './verifycert.component.html',
  styleUrls: ['./verifycert.component.css']
})
export class VerifycertComponent implements OnInit {
  verifyform: FormGroup;
  submitted = false;
  verificationDetails : any;
  verificationStatus : boolean = false;
  constructor(private formBuilder: FormBuilder,
    private courseService: CourseService
    ) {

  }  
  ngOnInit() {
    // this.createRegistrationForm()
    this.verifyform = this.formBuilder.group({
      enrollmentID: ['', [Validators.required]],
      certificateID: ['', [Validators.required]],
    });
  }
  get f() { return this.verifyform.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.verifyform.invalid) {
      return;
    }
    this.verificationStatus = true;
    this.verificationDetails = {
      status: 200,
      Message: 'Verified Certification',
      userName: 'sit',
      enrollmentDetails: {
          courseID: 'AWS',
          certifiedOn: '31.12.2025',
          courseTitle: 'AWS Certification'
      }
  }
    // this.courseService.verifycert(this.verifyform.value).subscribe(res => {
    //   console.log(res)
    //   this.verificationDetails = res;
    // }, (e) => {
    //   console.log(e)
    //   this.verificationDetails = e.error;
    // })
  }
}

