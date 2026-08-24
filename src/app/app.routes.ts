import { Routes } from '@angular/router';
import { Coding } from './features/workbook/coding/coding';
import { CodingDoc } from './features/workbook/coding/coding-doc/coding-doc';
import { CodingAdd } from './features/workbook/coding/coding-add/coding-add';
import { DevNote } from './features/workbook/dev-note/dev-note';
import { Home } from './features/home/home';

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
