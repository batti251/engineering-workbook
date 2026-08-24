# ADR 0001: Change the current file structure

## context

The current file structure is missleading the intention and functionality of the components.
Components that act as a feature of the Website are stored in shared-files.
shared-file is loosing its purpose

## decision

The project file structure will be inspired by [Medium blog from Dragos Atanasoae.](https://medium.com/@dragos.atanasoae_62577/angular-project-structure-guide-small-medium-and-large-projects-e17c361b2029)

The project file structure will be split into 
- core
- features
- layout
- shared
    - components
    - interfaces
    - models
    - services

## status

accepted

## consequences

Adapt File structure according to proposed structure.
Current component and services naming and substructure may need to be reconsidered afterwards to match the new file structure.
As the project grows, the file structure may need to be adapted again.