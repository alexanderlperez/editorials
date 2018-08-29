# MVP Editorials CMS 

Pragmatic, no frills, functional. Mildly delightful.

## Requirements

- sqlite3
- node
- smtp-accesible email account
For Google, follow the directions for "How to generate an app password" at: https://support.google.com/accounts/answer/185833

- database: needs editor w/ id 0 right now, configurable in src/App.js

## Installation, running

*Install sqlite3*

- NOTE: sqlite3 should be included with MacOS X
- Most Linux distros have a sqlite3 package, ex.

```
# Debian-based distros
sudo apt-get install sqlite3
```

*Configure src/config.json:*

- NOTE: there's rudimentary support for being hosted over HTTPS

```
{
    "host": "http://localhost:3001",
    "port": 3001,
    "https": false,
    "dbFile": "./ne-editorials.db",
    "clientUrl": "http://localhost:3000",
    "smtp": {
        "host": "smtp.gmail.com",
        "port": 465,
        "username": "YOUR_EMAIL@gmail.com",
        "password": "APP_PASSWORD"
    },
    "ssl": {
        "certPath": "PATH_TO_CERT.crt",
        "keyPath": "PATH_TO_KEY.pem"
    }
}
```

- NOTE: ne-editorials.db and the seed files (under *.sql) are included in this repo.

*Running the app:*

```
npm install

# start the backend API service
node ne-server.js 

# this starts the frontend
# run this in another terminal instance
npm start
```

## Notes

### Considerations for further development:

- Extract endpoints to modules:
As the number of endpoints increases, so does the backend code become unwieldy. Common endpoint bases would be extracted to their own modules. 

- Per-Component Styles:
Putting component styles in their own CSS files would keep maintainability hight, vs having a central CSS file

- Per-Component folders:
A common pattern with larger React apps is creating a folder per-component, which would include the CSS and any associated sub-modules for that component. Using module resolution with webpack would make importing these modular components simple.

- State organization:
Most components right now are stateful, further development would find state being pulled upward and towards state-containers using children props.  

- Error Handling:
Right now errors are logged to console, and network errors mostly result in a React stack trace. A logging service would be useful, to create parseable logs and store for retrieval. UI elements to handle the various error states would be helpful for users.

- Debouncing UI buttons for async actions: 
Some UI actions can be run multiple times before async operations are finished, ex. the "Share" request can be fired multiple times before the initial request finishes and closes the modal.

### Credits and Attributions

- email submission code courtesy of docs @ nodemailer.com 
- sqlite3 module docs at https://github.com/mapbox/node-sqlite3/wiki
- keeping whitespace in text area: https://stackoverflow.com/a/30593806/1817379
- Reactstrap snippets from: https://reactstrap.github.io/
- https with node: https://www.sitepoint.com/how-to-use-ssltls-with-node-js/
- pushing to github pages: https://github.com/gitname/react-gh-pages
- hosting an SPA with github pages: https://github.com/rafrex/spa-github-pages

### Reason for library choices:

- Support by commercial backer/large community: 
For example, node-sqlite3 is backed by Mapbox.  It uses node-style callbacks, but will likely be supported over wholly-promise-based libraries, developed by individuals. 

