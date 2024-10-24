import { Component, OnInit } from '@angular/core';

import { User } from 'src/models/user.model';
import { UserService } from 'src/service/user.service';
import { ToastrService } from 'ngx-toastr';
import { StudentdetailsComponent } from '../studentdetails/studentdetails.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CourseService } from 'src/service/course.service';
import { DomSanitizer } from '@angular/platform-browser';
import {base64StringToBlob} from 'blob-util';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-coursepdfs',
  templateUrl: './coursepdfs.component.html',
  styleUrls: ['./coursepdfs.component.css']
})
export class CoursepdfsComponent implements OnInit {
  expandedElement: User | null;

  enquiryref: MatDialogRef<StudentdetailsComponent>;
  fileUrl: any;
  displayedColumns: string[] = ['courseid', 'courseshortform', 'title', 'syllabus'];
  dataSource: User[];
  fileToUpload: File | null = null;

  constructor(private courseService: CourseService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) {

  }

  ngOnInit() {
    this.courseService.getCourselist().subscribe((res: any) => {
      console.log(res)
      this.dataSource = res['courses']
    }, (e) => {
      console.log(e)
      if (e.error.Message) this.toastr.error(e.error.Message)
      else this.toastr.error(e.error)
    })

  }

  downloaddoc(courseid: string) {
    this.courseService.getCoursesyllabusDoc(courseid).subscribe((res: any) => {
      console.log(res)
      let blob = base64StringToBlob(res.details, 'application/pdf');
      saveAs(blob, `${res.courseid}-syllabus.pdf`)
    }, (e) => {
      console.log(e)
      if (e.error.Message) this.toastr.error(e.error.Message)
      else this.toastr.error(e.error)
    })
  }

  handleFileInput = (event: any, courseid: string) => {
    // const target = event.target as HTMLInputElement;
    // const file: File = (target.files as FileList)[0];
    const file = event.target.files[0]
    const formdata = new FormData();
    formdata.append("courseid", courseid)
    formdata.append("syllabus", file, file.name);
    this.courseService.saveCoursesyllabusDoc(formdata).subscribe((res: any) => {
      console.log(res)
      this.toastr.success(res.Message)
    }, (e) => {
      console.log(e)
      if (e.error.Message) this.toastr.error(e.error.Message)
      else this.toastr.error(e.error)
    })
  };
}
