import { Routes } from '@angular/router';
import { Coding } from './shared/workbook/coding/coding';
import { CodingDoc } from './shared/workbook/coding/coding-doc/coding-doc';
import { CodingAdd } from './shared/workbook/coding/coding-add/coding-add';

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
    }
];
