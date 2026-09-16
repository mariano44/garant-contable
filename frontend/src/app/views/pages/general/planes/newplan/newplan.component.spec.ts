import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewplanComponent } from './newplan.component';

describe('NewplanComponent', () => {
  let component: NewplanComponent;
  let fixture: ComponentFixture<NewplanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewplanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
