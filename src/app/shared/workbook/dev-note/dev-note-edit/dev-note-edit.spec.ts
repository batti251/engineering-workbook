import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevNoteEdit } from './dev-note-edit';

describe('DevNoteEdit', () => {
  let component: DevNoteEdit;
  let fixture: ComponentFixture<DevNoteEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevNoteEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(DevNoteEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
