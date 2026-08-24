import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevNote } from './dev-note';

describe('DevNote', () => {
  let component: DevNote;
  let fixture: ComponentFixture<DevNote>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevNote],
    }).compileComponents();

    fixture = TestBed.createComponent(DevNote);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
