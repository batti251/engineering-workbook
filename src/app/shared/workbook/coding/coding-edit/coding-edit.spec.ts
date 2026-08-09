import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodingEdit } from './coding-edit';

describe('CodingEdit', () => {
  let component: CodingEdit;
  let fixture: ComponentFixture<CodingEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodingEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(CodingEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
