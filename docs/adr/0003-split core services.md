# ADR 0003: Split core services

## context

At the beginning of the project it just started with a simple database. 
With implementing a file storage, small refactorings where done, but not enough to split responsibilites in the services.


## decision

Each service should have a clearly defined area of responsibility. 
Therefore functionalities will be separated into:
- db => the database service, including CRUD operations and RealTime-Channel for the table
- storage => the storage service, including CRUD operations for files

Refactoring and documentation will be done accordingly
Circular dependencies should be avoided and changed to dependency injections

## status

accepted

## consequences

Current service functions must be reviewed and evaluated for wether they belong to the respective service.
With more knowledge and experience, or with changing requirements from the project itself, another architectural strategy may need to be reconsidered.