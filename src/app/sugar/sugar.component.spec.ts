/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SugarComponent } from './sugar.component';

describe('SugarComponent', () => {
  let component: SugarComponent;
  let fixture: ComponentFixture<SugarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SugarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SugarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
