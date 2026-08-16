import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Git } from './git';

describe('Git', () => {
  let component: Git;
  let fixture: ComponentFixture<Git>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Git],
    }).compileComponents();

    fixture = TestBed.createComponent(Git);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
