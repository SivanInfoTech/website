// screen-size.service.ts
import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ScreenSizeService {
  isMobile$: Observable<boolean>;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.initializeScreenSize();
  }

  private initializeScreenSize() {
    this.isMobile$ = this.breakpointObserver.observe([Breakpoints.Handset]).pipe(
      map((result) => result.matches),
      shareReplay() // Ensure that the observable is shared among subscribers
    );
  }
}
