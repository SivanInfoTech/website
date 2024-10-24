import { Component, OnInit, QueryList, ViewChild} from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/models/user.model';
import { UserService } from 'src/service/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { VerifycertComponent } from '../verifycert/verifycert.component';

@Component({
  selector: 'mobile-header',
  templateUrl: './headerMobile.component.html',
  styleUrls: ['./headerMobile.component.css'],
})
export class HeaderMobileComponent implements OnInit {
  showModal = false
  expandCourseList = false
  currentUser$: Observable<User | null>;


  @ViewChild('menuTrigger') trigger: MatMenuTrigger
  @ViewChild('menuTrigger1') trigger1: MatMenuTrigger
  enquiryref: MatDialogRef<VerifycertComponent>;
  
  courselist = ['AWS', 'Azure', 'Kubernetes', 'Python']
  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
    public dialog: MatDialog) {
  }
  ngOnInit() {
    this.currentUser$= this.userService.currentUser;
  }


  logOut() {
    this.userService.logout().subscribe((res: any) => {
      this.toastr.success(res['Message']);
      this.userService.purgeAuth();
      this.router.navigate(['/login']);
    })
  }
  

  openMyMenu() {
    this.trigger.openMenu();
  } 
  closeMyMenu() {
    this.trigger.closeMenu();
  }
  openaccmenu() {
    this.trigger1.openMenu();
  }
  closeaccmenu() {
    this.trigger1.closeMenu();
  }


  navigateTo(route: string) {
    switch (route) {
      case 'home':
        this.router.navigate(['/home']);
        break;
      case 'aboutus':
        this.router.navigate(['/aboutus']);
        break;
      case 'course':
        this.listCourses();
        break;
      case 'verify':
        this.opencert();
        break;
      case 'register':
        this.router.navigate(['/register']);
        break;
      case 'login':
        this.router.navigate(['/login']);
        break;
      case 'payment':
        this.router.navigate(['/payment']);
        break;
    }
    this.toggleModal(false);
  }
  toggleModal(show: boolean) {
    this.showModal = show;
  }
  listCourses() {
    this.expandCourseList = !this.expandCourseList;
  }
  opencert() {
    this.enquiryref = this.dialog.open(VerifycertComponent, {
      width: '50vw'
    });
  }
}
