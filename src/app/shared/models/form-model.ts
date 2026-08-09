import { TableRow } from "../interfaces/table-row"

export class FormModel {
    language: string;
    title: string;
    description: string;
    syntax: string;
    return_value: string;
    use_cases: string[]



    constructor(data: Partial<TableRow>){
        this.language = data.language ?? "";
        this.title = data.title ?? "";
        this.description = data.description ?? "";
        this.syntax = data.syntax ?? "";
        this.return_value = data.return_value ?? "";
        this.use_cases = data.use_cases ?? []
    }
}