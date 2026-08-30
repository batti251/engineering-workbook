# ADR 0002: Set general KnowledgeEntryData Interface

## context

At the beginning of this project, it started with one interface that was focused on storing knowledge about specific code syntax and its properties.
Since the project will grow into a universal knowledge database, with different entry & knowledge topics, the initial interface will be depricated soon and will not enable a scalable, domain driven landscape.

## decision

The Interfaces for KnowledgeEntryData and all affacted components will be ouverhauled to this structure:

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

The knowledge backend table will be restructured accordingly.
By this chance, current components will be refactored, where its feasible.
i.e. there will be no coding-add , coding-edit anymore.
This will be replaces by knowledge-form.
The decision will not include a complete refactoring/restructuring from services and component.ts files. This needs to be achieved afterwards. 

## status

accepted

## consequences

### Pros

- It allows the user -me- to create individual articles, without getting stuck by the form-architecture. 
- The general structure should allow a more natural reading and treatment with different kind of entries.
- A better entry scaling is given accordingly. 
- It leads into a better architecture to move faster through the projects directory 

### Cons

- Current functions need to be refactored to the new interface.
- It's not excluded, that changes in future -related to the purpose of the project- will lead to another challenge of the KnowledgeEntryData Interface.
- Changing to a general Interface may be confusing, when adding or editing a new article, since it may not be known how the inputs must be shown on the documentation-site.

### Chances 

- Need to consider to implement a selection of topic-driven-templates during adding/edit process