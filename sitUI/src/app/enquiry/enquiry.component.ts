import { Component, Inject, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CourseService } from 'src/service/course.service';
import { UserService } from 'src/service/user.service';
@Component({
  selector: 'app-enquiry',
  templateUrl: './enquiry.component.html',
  styleUrls: ['./enquiry.component.css']
})

export class EnquiryComponent implements OnInit {
  batches: any;
  coursebatchdetails: any;
  queryform: FormGroup;
  submitted: Boolean = false
  ispopup: Boolean = false
  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private userservice: UserService,
    private courseservice: CourseService,
    // public dialogRef: MatDialogRef<EnquiryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) { }

  public dialogRef: MatDialogRef<EnquiryComponent>
  ngOnInit() {
    this.queryform = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      enquiry: ['', [Validators.required]],
      course: ['', [Validators.required]],
      batch: ['']
      // recaptcha: ['', Validators.required]
    });
    this.courseservice.getCourseAndBatchDetails().subscribe((res: any) => {
      this.coursebatchdetails = res['details'];
    }, (e) => {
      console.log(e)
      if (e.error.Message) this.toastr.error(e.error.Message)
      else this.toastr.error(e.error)
    })
    this.queryform.get('course')?.valueChanges.subscribe(() => {
      const formval = this.queryform.getRawValue();
      this.coursebatchdetails.find((data: any) => {
        if (data.courseid == formval.course) this.batches = data.batches
      });
    });
  }

  get f() { return this.queryform.controls; }

  onSubmit() {
    this.submitted = true;

    this.userservice.sendenquiry(this.queryform.value).subscribe((res: any) => {
      console.log(res)
      this.toastr.success(res.Message)
      this.queryform.reset()
      this.submitted = false;
    })
    // this.dialogRef.close('Pizza!');
    this.dialogRef.close();

  }

}

