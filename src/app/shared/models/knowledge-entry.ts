import { KnowledgeEntryData, KnowledgeSubEntryData } from "../interfaces/knowledge-entry-data"

export class KnowledgeEntry {
    id?: number;
    title: string;
    description: string;
    tags: string[];
    image?: string;
    subEntries: KnowledgeSubEntryData[]

    constructor(data: Partial<KnowledgeEntryData>) {
        this.id = data.id ?? 0;
        this.title = data.title ?? "";
        this.description = data.description ?? "";
        this.tags = data.tags ?? [];
        this.image = data.image ?? '';
        this.subEntries = data.subEntries ?? [];
    }
}
