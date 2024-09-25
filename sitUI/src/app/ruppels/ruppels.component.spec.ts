import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuppelsComponent } from './ruppels.component';

describe('RuppelsComponent', () => {
  let component: RuppelsComponent;
  let fixture: ComponentFixture<RuppelsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RuppelsComponent]
    });
    fixture = TestBed.createComponent(RuppelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
