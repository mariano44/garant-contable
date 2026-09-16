import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambiarcontraseniaComponent } from './cambiarcontrasenia.component';

describe('CambiarcontraseniaComponent', () => {
  let component: CambiarcontraseniaComponent;
  let fixture: ComponentFixture<CambiarcontraseniaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CambiarcontraseniaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CambiarcontraseniaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
