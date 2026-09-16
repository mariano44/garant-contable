import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellosComponent } from './sellos.component';

describe('SellosComponent', () => {
  let component: SellosComponent;
  let fixture: ComponentFixture<SellosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SellosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
