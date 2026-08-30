import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowledgeDoc } from './knowledge-doc';

describe('CodingDoc', () => {
  let component: KnowledgeDoc;
  let fixture: ComponentFixture<KnowledgeDoc>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KnowledgeDoc],
    }).compileComponents();

    fixture = TestBed.createComponent(KnowledgeDoc);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
