# Noom Editorials

Pragmatic MVP Editorials CMS 

## Requirements

- sqlite3
- node
- smtp-accesible email account
For Google, follow the directions for "How to generate an app password" at: https://support.google.com/accounts/answer/185833

### Reason for library choices:

- Support by commercial backer/large community: 
For example, node-sqlite3 is backed by Mapbox.  It uses node-style callbacks, but will likely be supported over wholly-promise-based libraries, developed by individuals. 

### Considerations for further development:

- State organization:
Most components right now are stateful, further development would find state being pulled upward and towards state-containers using children props.  

### Notes on design choices:

- Opted to duplicate articles using the authorId that is sent by the client rather than the one set in the article, because Editors may want to use articles as templates rather than wholesale
