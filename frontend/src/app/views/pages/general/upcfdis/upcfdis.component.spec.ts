import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcfdisComponent } from './upcfdis.component';

describe('UpcfdisComponent', () => {
  let component: UpcfdisComponent;
  let fixture: ComponentFixture<UpcfdisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpcfdisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpcfdisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
