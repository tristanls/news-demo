/*

index.js - "news-demo"

The MIT License (MIT)

Copyright (c) 2013 Tristan Slominski

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

*/
"use strict";

var events = require('events'),
    FeedParser = require('feedparser'),
    http = require('http'),
    util = require('util');

/*
  * `options`: _Object_
    * `bbcFeedUrl`: _String_ _(Default: 'http://feeds.bbci.co.uk/news/rss.xml')_ URL to BBC UK News RSS feed.
    * `hostname`: _String_ _(Default: 'localhost')_ Hostname for the server to listen on. If not specified, the server will accept connections directed to any IPv4 address (`INADDR_ANY`).    
    * `port`: _Integer_ _(Default: 8080)_ Port number for the server to listen on.    
    * `skyFeedUrl`: _String_ _(Default: 'http://news.sky.com/feeds/rss/uk.xml')_ URL to Sky UK News RSS feed.
*/
var Server = module.exports = function Server (options) {
    var self = this;
    events.EventEmitter.call(self);

    options = options || {};

    self.hostname = options.hostname || 'localhost';
    self.port = options.port || 8080;

    self.bbcFeedUrl = options.bbcFeedUrl || "http://feeds.bbci.co.uk/news/rss.xml";
    self.skyFeedUrl = options.skyFeedUrl || "http://news.sky.com/feeds/rss/uk.xml";

    self.server = null;
};

util.inherits(Server, events.EventEmitter);

/*
  * `callback`: _Function_ _(Default: undefined)_ `function () {}` Optional 
          callback to call once the server is stopped.
*/
Server.listen = function listen (options, callback) {
    var server = new Server(options);
    server.listen(callback);
    return server;
};

/*
  * `callback`: _Function_ _(Default: undefined)_ `function () {}` Optional 
          callback to call once the server is stopped.
*/
Server.prototype.close = function close (callback) {
    var self = this;
    if (self.server)
        self.server.close(callback);
};

/*
  * `callback`: _Function_ _(Default: undefined)_ `function () {}` Optional 
          callback to call once the server is up.
*/
Server.prototype.listen = function listen (callback) {
    var self = this;
    self.server = http.createServer(function (req, res) {
        if (req.method != "GET") {
            res.writeHead(405, {Allow: 'GET'}); // Method Not Allowed
            res.end();
            return;
        }

        var connectionOpen = true;

        try {
            var bbcItems = [];
            var skyItems = [];
            var bbcItemsComplete = false;
            var skyItemsComplete = false;
            var completionCheck = function completionCheck() {
                if (bbcItems.length >= 10 && skyItems.length >= 10) {
                    res.writeHead(200);
                    res.write('<html><head></head><body>');
                    res.write('<h2>BBC Headlines:</h2><br/>');
                    for (var i = 0; i < 10; i++) {
                        res.write('' + (i + 1) + ' ' + bbcItems[i] + '<br/>');
                    }
                    res.write('<h2>SKY Headlines:</h2><br/>');
                    for (var i = 0; i < 10; i++) {
                        res.write('' + (i + 1) + ' ' + skyItems[i] + '<br/>');
                    }
                    res.end('</body></html>');
                }
            };
            var bbcRequest = http.get(self.bbcFeedUrl, function (res) {
                res
                    .pipe(new FeedParser())
                    .on('error', function (error) {
                        console.error(error);
                    })
                    .on('meta', function (meta) {
                        // console.dir(meta);
                    })
                    .on('readable', function () {
                        var stream = this, item;
                        while (item = stream.read()) {
                            console.log('BBC', item.title);
                            bbcItems.push(item.title);
                            if (bbcItems.length >= 10) {
                                bbcRequest.abort();
                                completionCheck();
                            }
                        }
                    });
            });
            var skyRequest = http.get(self.skyFeedUrl, function (res) {
                res
                    .pipe(new FeedParser())
                    .on('error', function (error) {
                        console.error(error);
                    })
                    .on('meta', function (meta) {
                        // console.dir(meta);
                    })
                    .on('readable', function () {
                        var stream = this, item;
                        while (item = stream.read()) {
                            console.log('SKY', item.title);
                            skyItems.push(item.title);
                            if (skyItems.length >= 10) {
                                skyRequest.abort();
                                completionCheck();
                            }
                        }
                    });
            });
        } catch (exception) {
            res.statusCode = 500; // Internal Server Error
            res.end();
            return;
        }
    });
    self.server.listen(self.port, self.hostname, callback);
};