import { afterRenderEffect, Component, computed, effect, inject, resource, signal } from '@angular/core';
import { Supabase } from '../../../core/db';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { KnowledgeEntryData } from '../../../shared/interfaces/knowledge-entry-data';
import { Keys } from '../../../shared/services/key';
import { LowerCasePipe } from '@angular/common';
import Prism from 'prismjs';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-python';
import { StickyHeader } from '../../../shared/directives/sticky-header';

@Component({
  selector: 'app-knowledge-card',
  imports: [RouterLink, LowerCasePipe, StickyHeader],
  templateUrl: './knowledge-card.html',
  styleUrl: './knowledge-card.scss',
})
export class KnowledgeCard {
  private db = inject(Supabase)
  private activatedRoute = inject(ActivatedRoute);
  private key = inject(Keys)
  readonly storageImgPath = this.key.dbURL + '/' + this.key.dbStorage + '/' + this.key.ImgStore

  entryId = signal(this.getUserId())
  userRessource = resource({
    params: () => ({ id: this.entryId() }),
    loader: ({ params }) => this.db.readSingleKnowledgeEntry(params.id)
  })


  getUserId() {
    let urlID = this.activatedRoute.snapshot.paramMap.get('id')
    return urlID as string
  }

  data = computed(() => {
    if (this.userRessource.hasValue()) {
      return this.userRessource.value().at(0)
    } return undefined
  })


  constructor() {
    effect(() => {
      if (this.userRessource.hasValue()) {
        this.data() as KnowledgeEntryData
      }
      return
    })

    afterRenderEffect(() => {
      this.data()
      Prism.highlightAll()
    });
  }
}
