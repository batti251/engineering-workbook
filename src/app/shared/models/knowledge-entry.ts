import { KnowledgeEntryData, KnowledgeSubEntryData } from "../interfaces/knowledge-entry-data"

export class KnowledgeEntry {
    id: number;
    userId: string;
    title: string;
    description: string;
    tags: string[];
    subEntries: KnowledgeSubEntryData[]

    constructor(data: Partial<KnowledgeEntryData>) {
        this.id = data.id ?? 0;
        this.userId = data.userId ?? '';
        this.title = data.title ?? "";
        this.description = data.description ?? "";
        this.tags = data.tags ?? [];
        this.subEntries = data.subEntries ?? [];
    }
}
