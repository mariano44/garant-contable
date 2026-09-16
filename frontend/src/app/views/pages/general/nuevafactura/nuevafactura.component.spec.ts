import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevafacturaComponent } from './nuevafactura.component';

describe('NuevafacturaComponent', () => {
  let component: NuevafacturaComponent;
  let fixture: ComponentFixture<NuevafacturaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NuevafacturaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevafacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
