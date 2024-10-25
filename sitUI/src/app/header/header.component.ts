import { Component, OnInit, QueryList, ViewChild} from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/models/user.model';
import { UserService } from 'src/service/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { VerifycertComponent } from '../verifycert/verifycert.component';
import { ScreenSizeService } from '../screen-size.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  
  
  isMobile: boolean;
  loggedin = false
  currentUser$: Observable<User | null>;
  @ViewChild('menuTrigger') trigger: MatMenuTrigger
  @ViewChild('menuTrigger1') trigger1: MatMenuTrigger
  enquiryref: MatDialogRef<VerifycertComponent>;
  courselist = ['AWS', 'Azure','GCP' ]//  need to enable in future kubernetes,python
  
  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
    public dialog: MatDialog,
    private screenSizeService: ScreenSizeService,) {
  }
  // currentUser$ = inject(UserService).currentUser;
  ngOnInit() {
    this.currentUser$= this.userService.currentUser;
    this.screenSizeService.isMobile$.subscribe((isMobile) => {
      this.isMobile = isMobile;
    });
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
  opencert() {
    this.enquiryref = this.dialog.open(VerifycertComponent, {
      width: this.isMobile ? '75vw' : '50vw'
    });
  }
}
