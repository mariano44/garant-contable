import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NgSelectComponent } from './ng-select.component';

describe('NgSelectComponent', () => {
  let component: NgSelectComponent;
  let fixture: ComponentFixture<NgSelectComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NgSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
