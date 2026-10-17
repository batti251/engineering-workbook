import { Routes } from '@angular/router';
import { KnowledgeDoc } from './features/workbook/knowledge-doc/knowledge-doc';
import { KnowledgeForm, entryResolver } from './features/workbook/knowledge-form/knowledge-form';
import { Home } from './features/home/home';
import { UserSignup } from './features/user-signup/user-signup';
import { CustomSettings } from './features/home/custom-settings/custom-settings';
import { userGuard } from './core/user-guard';
import { KnowledgeCard } from './features/workbook/knowledge-card/knowledge-card';

export const routes: Routes = [
    {
        path: 'home',
        component: Home
    },
    {
        path: 'home/settings',
        component: CustomSettings,
        canActivate: [userGuard]
    },
    {
        path: 'signup',
        component: UserSignup
    },
    {
        path: 'knowledge/doc',
        component: KnowledgeDoc,
        canActivate: [userGuard]
    },
    {
        path: 'knowledge/:state',
        component: KnowledgeForm,
        canActivate: [userGuard],
       
    },
    {
        path: 'knowledge/edit-entry/:id',
        component: KnowledgeForm,
        canActivate: [userGuard],
        resolve: {
            entry: entryResolver,
        }
    },
    {
        path: 'knowledge/entry/:id',
        component: KnowledgeCard,
        canActivate: [userGuard],
        resolve: {
            entry: entryResolver,
        }
    },


];
