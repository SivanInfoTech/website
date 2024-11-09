import { Component, OnInit } from '@angular/core';
import { ScreenSizeService } from '../app/screen-size.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  isMobile: boolean;
  title = 'sit_ui';
  constructor(
    private screenSizeService: ScreenSizeService,private router:Router
    
  ) {}

  ngOnInit() {
    this.screenSizeService.isMobile$.subscribe((isMobile: boolean) => {
      this.isMobile = isMobile;
    });
    this.hideCourseNavigation()

    
  }
  hideCourseNavigation(){
    this.router.events.subscribe((value: any) => {
      if (value instanceof NavigationEnd) {
        console.log(this.router.url.toString(),"url")
        if (this.router.url.toString()=='/course'){
          this.router.navigate(['/'])
        }
      }})
  }
}
