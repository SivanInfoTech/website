import { Component, OnInit } from '@angular/core';
import { ScreenSizeService } from '../app/screen-size.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  isMobile: boolean;
  title = 'sit_ui';
  constructor(
    private screenSizeService: ScreenSizeService,
  ) {}

  ngOnInit() {
    this.screenSizeService.isMobile$.subscribe((isMobile: boolean) => {
      this.isMobile = isMobile;
    });
  }
}
