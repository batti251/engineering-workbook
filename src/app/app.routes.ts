import { Routes } from '@angular/router';
import { Coding } from './shared/workbook/coding/coding';
import { CodingDoc } from './shared/workbook/coding/coding-doc/coding-doc';

export const routes: Routes = [
    {
        path: '',
        component: Coding
    },
    {
        path: 'doc',
        component: CodingDoc
    }
];
