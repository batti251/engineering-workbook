import { Routes } from '@angular/router';
import { Coding } from './shared/workbook/coding/coding';
import { CodingDoc } from './shared/workbook/coding/coding-doc/coding-doc';
import { CodingAdd } from './shared/workbook/coding/coding-add/coding-add';
import { DevNote } from './shared/workbook/dev-note/dev-note';
import { Home } from './shared/components/home/home';

export const routes: Routes = [
    {
        path: '',
        component: Home
    },
     {
        path: 'code',
        component: CodingAdd
    },
    {
        path: 'doc',
        component: CodingDoc
    },
    {
        path: 'dev-note',
        component: DevNote
    }
];
