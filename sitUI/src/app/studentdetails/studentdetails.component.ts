import { Component, Inject, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-studentdetails',
  templateUrl: './studentdetails.component.html',
  styleUrls: ['./studentdetails.component.css']
})
export class StudentdetailsComponent implements OnInit {

  queryform: FormGroup;
  submitted: Boolean = false
  ispopup: Boolean = false
  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    // public dialogRef: MatDialogRef<EnquiryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) { }
  
  public dialogRef: MatDialogRef<StudentdetailsComponent>
  ngOnInit() {
    this.queryform = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
    });
    console.log(this.data)
  }

  get f() { return this.queryform.controls; }

  onSubmit() {
    this.submitted = true;
    console.log(this.data)
    // stop here if form is invalid
    if (this.queryform.invalid) {
      return;
    }
    // this.dialogRef.close('Pizza!');
    this.dialogRef.close();

  }
}

