import { Component , OnInit} from '@angular/core';
import { User } from 'src/models/user.model';
import { UserService } from 'src/service/user.service';
import { ToastrService } from 'ngx-toastr';
import { StudentdetailsComponent } from '../studentdetails/studentdetails.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-studentslist',
  templateUrl: './studentslist.component.html',
  styleUrls: ['./studentslist.component.css']
})

export class StudentslistComponent implements OnInit{
  expandedElement: User | null;

  enquiryref: MatDialogRef<StudentdetailsComponent>;

  displayedColumns: string[] = ['name', 'email', 'role', 'verified', 'enrolled'];
  dataSource: User[];

  constructor(private userService: UserService,
   private toastr: ToastrService,
   public dialog: MatDialog,
   ) {

  }

  ngOnInit() {
    this.userService.getstudents().subscribe(res => {
      // console.log(res)
      this.dataSource = res['user']
    }, (e) => {
      console.log(e)
      if(e.error.Message)this.toastr.error(e.error.Message)
      else this.toastr.error(e.error)
    })
    
  }

  getRecord(row: any){ 
    this.enquiryref = this.dialog.open(StudentdetailsComponent, {
      width: '74vw',
      height : '70vh',
      data: row
    });
  }

}
