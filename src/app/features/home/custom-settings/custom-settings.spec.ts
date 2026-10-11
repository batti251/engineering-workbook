import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSettings } from './custom-settings';

describe('CustomSettings', () => {
  let component: CustomSettings;
  let fixture: ComponentFixture<CustomSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomSettings],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomSettings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
