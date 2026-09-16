import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NgxColorPickerComponent } from './ngx-color-picker.component';

describe('NgxColorPickerComponent', () => {
  let component: NgxColorPickerComponent;
  let fixture: ComponentFixture<NgxColorPickerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxColorPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxColorPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
