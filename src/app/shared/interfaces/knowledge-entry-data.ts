export interface KnowledgeEntryData {
    id?: number,
    userId: string,
    title: string,
    description: string,
    tags: string[],
    subEntries: KnowledgeSubEntryData[]

}

export interface KnowledgeSubEntryData {
    subTitle: string,
    description?: string,
    code?: Code,
    details?: string[],
    screenshots?: string[],
    externalLinks?: string[]
}

export interface Code {
    isCode?: boolean,
    language: string
}

export interface tags {
    created_at?: string,
    id: number,
    tag : string,
    userId: string
}
