import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularEdit } from './angular-edit';

describe('AngularEdit', () => {
  let component: AngularEdit;
  let fixture: ComponentFixture<AngularEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AngularEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(AngularEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
