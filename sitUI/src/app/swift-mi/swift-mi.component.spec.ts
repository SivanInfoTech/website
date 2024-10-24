import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwiftMiComponent } from './swift-mi.component';

describe('SwiftMiComponent', () => {
  let component: SwiftMiComponent;
  let fixture: ComponentFixture<SwiftMiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SwiftMiComponent]
    });
    fixture = TestBed.createComponent(SwiftMiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
