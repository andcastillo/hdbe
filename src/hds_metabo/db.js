'use strict';

var hds = require('hds');
var Entry = hds.Entry;
var servers = require('./mongo.json');

require('./kinds');

function initdb(params){
    hds.init({
        database: servers[params]
    }).then(console.log("Connected to mongoDB"));
}



function query(params){
    var query = params.query;
    switch(query.action){
        case 'findOne':
            var constrain = {};
            constrain[query.field]=query.value;
            return Entry.findOne(query.collection, constrain
            ).exec();
        break;
        case 'find':
            var constrain = {};
            constrain[query.field]=query.value;
            return Entry.find(query.collection, constrain
            ).exec();
        break;
        case 'save':

        break;
        case 'delete':

        break;
        default :
            return null;
    }


}

exports.hds = hds;
exports.initdb = initdb;
exports.query = query;
