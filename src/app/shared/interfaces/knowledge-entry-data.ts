export interface KnowledgeEntryData {
    id?: number,
    title: string,
    description: string,
    tags: string[],
    image?: string,
    subEntries: KnowledgeSubEntryData[]

}

export interface KnowledgeSubEntryData {
    subTitle: string,
    description?: string,
    details?: string[],
    screenshots?: string[],
    externalLinks?: string[]
}

export interface tags {
    created_at?: string,
    id: number,
    tag : string
}