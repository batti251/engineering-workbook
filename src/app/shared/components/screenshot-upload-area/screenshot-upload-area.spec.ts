import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenshotUploadArea } from './screenshot-upload-area';

describe('ScreenshotUploadArea', () => {
  let component: ScreenshotUploadArea;
  let fixture: ComponentFixture<ScreenshotUploadArea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScreenshotUploadArea],
    }).compileComponents();

    fixture = TestBed.createComponent(ScreenshotUploadArea);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
