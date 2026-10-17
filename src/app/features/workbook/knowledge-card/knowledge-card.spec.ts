import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowledgeCard } from './knowledge-card';

describe('KnowledgeCard', () => {
  let component: KnowledgeCard;
  let fixture: ComponentFixture<KnowledgeCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KnowledgeCard],
    }).compileComponents();

    fixture = TestBed.createComponent(KnowledgeCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
