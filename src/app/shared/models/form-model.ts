import { TableRow } from "../interfaces/table-row"

export class FormModel {
    language: string;
    title: string;
    description: string;
    syntax: string;
    returnValue: string;
    useCases: []



    constructor(data: Partial<TableRow>){
        this.language = data.language ?? "";
        this.title = data.title ?? "";
        this.description = data.description ?? "";
        this.syntax = data.syntax ?? "";
        this.returnValue = data.returnValue ?? "";
        this.useCases = data.useCases ?? []
    }
}