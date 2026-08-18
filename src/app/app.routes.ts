import { Routes } from '@angular/router';
import { Coding } from './shared/workbook/coding/coding';
import { CodingDoc } from './shared/workbook/coding/coding-doc/coding-doc';
import { CodingAdd } from './shared/workbook/coding/coding-add/coding-add';
import { DevNote } from './shared/workbook/dev-note/dev-note';

export const routes: Routes = [
    {
        path: '',
        component: Coding
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
