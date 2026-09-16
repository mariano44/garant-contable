import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewclienteComponent } from './newcliente.component';

describe('NewclienteComponent', () => {
  let component: NewclienteComponent;
  let fixture: ComponentFixture<NewclienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewclienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewclienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
