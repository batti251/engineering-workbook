import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodingDoc } from './coding-doc';

describe('CodingDoc', () => {
  let component: CodingDoc;
  let fixture: ComponentFixture<CodingDoc>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodingDoc],
    }).compileComponents();

    fixture = TestBed.createComponent(CodingDoc);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
