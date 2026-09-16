import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleditComponent } from './roledit.component';

describe('RoleditComponent', () => {
  let component: RoleditComponent;
  let fixture: ComponentFixture<RoleditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
