# ADR 0003: Expand user management

## context

The project was designed for one person only in the first place.
However, to build a global-knowledge-place might scale for 1 person, but not for the project itself.
Requirements has to be changed, and the project-vision needs to cover more than 1 users thoughts and notes.


## decision

Allow new users to enter the website.
The project will be refurbished to allow new users to create their own knowledge-entries and certain features:

- a signup-page will be created
- feature to login/logout properly
- a new home-screen will be established
- users should be able to customize tags and some UI
- users should only see their private entries

## status

accepted

## consequences

- current CRUD functions needs to consider userId.
- make sure that user can only see global and private notes, tags, files
- more users leads into more testings, to receive user-based feedback on UI, UX
- ensure a domain-driven architecture