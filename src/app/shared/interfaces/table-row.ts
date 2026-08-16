export interface TableRow {
    id?: number,
    language: string,
    description: string,
    syntax: string,
    return_value: string,
    properties?: string[],
    use_cases?: string[],
    screenshots?: string[]
}

export interface AngularInDepth {
    id?: number,
    topic: string,
    description?: string,
    notes?: AngularNote[],
}

export interface AngularNote {
    note?: string,
    notes?: string[],
    external_links: string[],
    screenshots?: string[]
}