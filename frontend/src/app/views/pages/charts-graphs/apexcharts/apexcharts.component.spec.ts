import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ApexchartsComponent } from './apexcharts.component';

describe('ApexchartsComponent', () => {
  let component: ApexchartsComponent;
  let fixture: ComponentFixture<ApexchartsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ApexchartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApexchartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
