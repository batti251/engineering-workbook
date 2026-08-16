import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularAdd } from './angular-add';

describe('AngularAdd', () => {
  let component: AngularAdd;
  let fixture: ComponentFixture<AngularAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AngularAdd],
    }).compileComponents();

    fixture = TestBed.createComponent(AngularAdd);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
