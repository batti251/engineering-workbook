export interface KnowledgeEntryData {
    id?: number,
    language: string,
    description: string,
    syntax: string,
    return_value: string,
    properties?: string[],
    use_cases?: string[],
    screenshots?: string[]
}
