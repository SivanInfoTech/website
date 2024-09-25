import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Terrgen2Component } from './terrgen2.component';

describe('Terrgen2Component', () => {
  let component: Terrgen2Component;
  let fixture: ComponentFixture<Terrgen2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Terrgen2Component]
    });
    fixture = TestBed.createComponent(Terrgen2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
