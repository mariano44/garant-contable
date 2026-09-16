import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NgxDropzoneWrapperComponent } from './ngx-dropzone-wrapper.component';

describe('NgxDropzoneWrapperComponent', () => {
  let component: NgxDropzoneWrapperComponent;
  let fixture: ComponentFixture<NgxDropzoneWrapperComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxDropzoneWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxDropzoneWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
