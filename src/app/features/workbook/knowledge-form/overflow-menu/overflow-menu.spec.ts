import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverflowMenu } from './overflow-menu';

describe('OverflowMenu', () => {
  let component: OverflowMenu;
  let fixture: ComponentFixture<OverflowMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverflowMenu],
    }).compileComponents();

    fixture = TestBed.createComponent(OverflowMenu);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
