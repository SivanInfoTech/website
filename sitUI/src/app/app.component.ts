import { Component, OnInit } from '@angular/core';
import { ScreenSizeService } from '../app/screen-size.service';
import { NavigationEnd, Router } from '@angular/router';

declare let gtag: Function;  //  Step 1: Declare gtag

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isMobile: boolean;
  title = 'sit_ui';

  constructor(
    private screenSizeService: ScreenSizeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.screenSizeService.isMobile$.subscribe((isMobile: boolean) => {
      this.isMobile = isMobile;
    });

    this.hideCourseNavigation();
    this.trackPageViews();  //  Step 2: Call GA4 tracking function
  }

  hideCourseNavigation() {
    this.router.events.subscribe((value: any) => {
      if (value instanceof NavigationEnd) {
        console.log(this.router.url.toString(), "url");
        if (this.router.url.toString() == '/course') {
          this.router.navigate(['/']);
        }
      }
    });
  }

  //  Step 3: GA4 Router Tracking Function
  trackPageViews() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        gtag('config', 'G-DBXE3DPVB5', {
          page_path: event.urlAfterRedirects
        });
      }
    });
  }
}
