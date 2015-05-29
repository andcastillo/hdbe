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
    if((typeof query)=='string')
        query = JSON.parse(query);

    var properties = params.props;

    if((typeof properties)=='string')
        properties = JSON.parse(properties);

    switch(query.action){
        case 'create':
            return Entry.create(query.collection, query.data, {owner: properties.login.email}).save();
            break;
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
