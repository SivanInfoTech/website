import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BluzapComponent } from './bluzap.component';

describe('BluzapComponent', () => {
  let component: BluzapComponent;
  let fixture: ComponentFixture<BluzapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BluzapComponent]
    });
    fixture = TestBed.createComponent(BluzapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
