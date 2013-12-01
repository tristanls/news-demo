# news-demo

_Stability: 1 - [Experimental](https://github.com/tristanls/stability-index#stability-1---experimental)_

Toy demo of displaying BBC & Sky UK news.

## Usage

### Command Line

    npm start

### Programmatically

```javascript
var Server = require('../index.js');

Server.listen({port: 8080}, function () {
    console.log('server listening on 8080...');
});
```

## Overview

Toy demo of displaying BBC & Sky UK news.

## Documentation

### Server

**Public API**

  * [Server.listen(options, \[callback\])](#serverlistenoptions-callback)
  * [new Server(options)](#new-serveroptions)
  * [server.close(\[callback\])](#serverclosecallback)
  * [server.listen(\[callback\])](#serverlistencallback)

### Server.listen(options, [callback])

  * `options`: See `new Server(options)` `options`.
  * `callback`: See `server.listen(callback)` `callback`.
  * Return: _Object_ An instance of Server with server running.

Creates a new Server and starts the server.

### new Server(options)

  * `options`: _Object_
    * `bbcFeedUrl`: _String_ _(Default: 'http://feeds.bbci.co.uk/news/rss.xml')_ URL to BBC UK News RSS feed.
    * `hostname`: _String_ _(Default: 'localhost')_ Hostname for the server to listen on. If not specified, the server will accept connections directed to any IPv4 address (`INADDR_ANY`).    
    * `port`: _Integer_ _(Default: 8080)_ Port number for the server to listen on.
    * `skyFeedUrl`: _String_ _(Default: 'http://news.sky.com/feeds/rss/uk.xml')_ URL to Sky UK News RSS feed.

Creates a new Server instance.

### server.close([callback])

  * `callback`: _Function_ _(Default: undefined)_ `function () {}` Optional callback to call once the server is stopped.

Stops the server from accepting new connections.

### server.listen([callback])

  * `callback`: _Function_ _(Default: undefined)_ `function () {}` Optional callback to call once the server is up.

Starts the server to listen to new connections.