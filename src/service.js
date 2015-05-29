'use strict';

var express = require('express');
var http = require('http');
var querystring = require('querystring');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


var localtask = require("./localtask");
var host = require("./host.json");

/**
 * Manage the GET requests. Forward a GET to children servers
 */
app.get('/', function (req, res) {
    if(host.children&&host.children.length>0&&!(req.props&&(req.props.local||false))){
        http.get(host.children[0].url+"?"+querystring.stringify(req), function(response) {
            // Continuously update stream with data
            var body = '';
            response.on('data', function(d) {
                body += d;
            });
            response.on('end', function() {
                var result = localtask.execute({"query":req.query,"host":host}).then(function(result){
                    res.send(localtask.catResponses(result,body));
                });
            });

        }).on('error', function(e) {
            res.send(host.name+"="+querystring.stringify(req.query)+" error "+ e.message);
        });
    }
    else{
        var result = localtask.execute({"query":req.query,"host":host}).then(function(result){
            res.send(result);
        });
    }
});
/**
 * Manage the POST requests. Forward a POST to children servers
 */
app.post('/', function(req, res) {
    var post_data = querystring.stringify(req.body);
    var props = JSON.parse(req.body.props);
    if(host.children&&host.children.length>0&&!(props.local||false)){

        host.children[0].method='POST';
        host.children[0].headers= {
            "Content-Type": "application/x-www-form-urlencoded",
            "Content-Length": post_data.length
        };

        var post_req = http.request(host.children[0], function(response) {
            response.setEncoding('utf8');
            var body = '';
            response.on('data', function (chunk) {
                body += chunk;
            });
            response.on('end', function() {
                var result = localtask.execute({"query":req.body.query,"props":req.body.props,"host":host}).then(function(result){
                    res.send(localtask.catResponses(result,body));
                });

            });
        }).on('error', function(e) {
            res.send(host.name+"="+req.body+" error "+ e.message);
        });

        post_req.write(post_data);
        post_req.end();
    }
    else{
        var result = localtask.execute({"query":req.body.query,"props":req.body.props,"host":host}).then(function(result){
            res.send(result);
        });
    }
});

var server = app.listen(host.port, function () {

    var host = server.address().address;
    var port = server.address().port;

    localtask.onInit(0);

    console.log('App listening at http://%s:%s', host, port);

});
