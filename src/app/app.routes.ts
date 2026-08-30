import { Routes } from '@angular/router';
import { KnowledgeDoc } from './features/workbook/knowledge-doc/knowledge-doc';
import { KnowledgeForm, entryResolver } from './features/workbook/knowledge-form/knowledge-form';
import { Home } from './features/home/home';

export const routes: Routes = [
    {
        path: '',
        component: Home
    },
    {
        path: 'knowledge/doc',
        component: KnowledgeDoc
    },
    {
        path: 'knowledge/:state',
        component: KnowledgeForm,
        resolve: {
            entry: entryResolver,
        }
    },
    {
        path: 'knowledge/:state/:id',
        component: KnowledgeForm,
        resolve: {
            entry: entryResolver,
        }
    },
    

];
