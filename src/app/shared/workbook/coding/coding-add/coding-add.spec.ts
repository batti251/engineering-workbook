import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodingAdd } from './coding-add';

describe('CodingAdd', () => {
  let component: CodingAdd;
  let fixture: ComponentFixture<CodingAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodingAdd],
    }).compileComponents();

    fixture = TestBed.createComponent(CodingAdd);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
