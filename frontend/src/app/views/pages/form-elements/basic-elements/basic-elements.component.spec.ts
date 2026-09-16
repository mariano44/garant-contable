import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BasicElementsComponent } from './basic-elements.component';

describe('BasicElementsComponent', () => {
  let component: BasicElementsComponent;
  let fixture: ComponentFixture<BasicElementsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicElementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicElementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
