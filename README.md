# MVP Editorials CMS 

Pragmatic, no frills, functional. Mildly delightful.

## Requirements

- sqlite3
- node
- smtp-accesible email account
For Google, follow the directions for "How to generate an app password" at: https://support.google.com/accounts/answer/185833

- database: needs editor w/ id 0 right now, configurable in src/App.js

## Installation, running

- NOTE: sqlite3 should be included with MacOS X
- Most Linux distros have a sqlite3 package, ex.

```
# Debian-based distros
sudo apt-get install sqlite3
```

Configure src/config.json:

```
{
    "clientUrl": "http://localhost:3000",
        "host": "http://localhost:3001",
        "port": 3001,
        "dbFile": "./ne-editorials.db",
        "smtp": {
            "host": "smtp.gmail.com",
            "port": 465,
            "username": "YOUR_EMAIL@gmail.com",
            "password": "APP_PASSWORD"
        }
}
```

Running the app:

```
npm install

# run this in another terminal instance
node ne-server.js 

# this starts the frontend
npm start

```

## Notes

### Reason for library choices:

- Support by commercial backer/large community: 
For example, node-sqlite3 is backed by Mapbox.  It uses node-style callbacks, but will likely be supported over wholly-promise-based libraries, developed by individuals. 

### Considerations for further development:

- State organization:
Most components right now are stateful, further development would find state being pulled upward and towards state-containers using children props.  

- Error Handling:
Right now errors are logged to console, and network errors mostly result in a React stack trace. 

