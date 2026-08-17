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

export interface DevInDepth {
    id?: number,
    topic: string,
    description?: string,
    notes?: DevNote[],
}

export interface DevNote {
    note?: string,
    notes?: string[],
    external_links: string[],
    screenshots?: string[]
}