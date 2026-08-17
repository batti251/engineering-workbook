import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevNoteAdd } from './dev-note-add';

describe('DevNoteAdd', () => {
  let component: DevNoteAdd;
  let fixture: ComponentFixture<DevNoteAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevNoteAdd],
    }).compileComponents();

    fixture = TestBed.createComponent(DevNoteAdd);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
