import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpticosComponent } from './opticos.component';

describe('OpticosComponent', () => {
  let component: OpticosComponent;
  let fixture: ComponentFixture<OpticosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OpticosComponent]
    });
    fixture = TestBed.createComponent(OpticosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
