import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Screenshot } from './screenshot';

describe('Screenshot', () => {
  let component: Screenshot;
  let fixture: ComponentFixture<Screenshot>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Screenshot],
    }).compileComponents();

    fixture = TestBed.createComponent(Screenshot);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
