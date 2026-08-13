import { TableRow } from "../interfaces/table-row"

export class FormModel {
    id?: number;
    language: string;
    description: string;
    syntax: string;
    return_value: string;
    properties: string[];
    use_cases: string[];
    screenshots?: string[]



    constructor(data: Partial<TableRow>){
        this.id = data.id ?? 0;
        this.language = data.language ?? "";
        this.description = data.description ?? "";
        this.syntax = data.syntax ?? "";
        this.return_value = data.return_value ?? "";
        this.properties = data.properties ?? [];
        this.use_cases = data.use_cases ?? [];
        this.screenshots = data.screenshots ?? [];
    }
}