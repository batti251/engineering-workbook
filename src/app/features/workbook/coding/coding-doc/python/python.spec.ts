import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Python } from './python';

describe('Python', () => {
  let component: Python;
  let fixture: ComponentFixture<Python>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Python],
    }).compileComponents();

    fixture = TestBed.createComponent(Python);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
