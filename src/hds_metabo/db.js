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
    //console.log(params);
    var query = params.query;
    if((typeof query)=='string')
        query = JSON.parse(query);

    var properties = params.props;

    if((typeof properties)=='string')
        properties = JSON.parse(properties);

    switch(query.action){
        case 'create':
            return Entry.create(query.kind, query.data, {owner: properties.login.email}).save();
            break;
        case 'findOne':
            var constrain = {};
            constrain[query.field]=query.value;
            return Entry.findOne(query.kind, constrain
            ).exec();
        break;
        case 'find':
            return find(query);
            break;
        case 'getChildren':
            return getChildren(query);
            break;
        case 'save':

            break;
        case 'delete':

            break;
        default :
            return null;
    }
}

function find(query){
    var constrain = {};
    if(query.value)
        constrain[query.field]=query.value;
    else{
        if(query.values){
            constrain[query.field]={'$in':query.values};
        }

    }
    return Entry.find(query.kind, constrain).exec();
}

function getChildren(query){
    return new Promise(function (resolve, reject) {
        Entry.findOne(query.kind,{"_id":query._id}).exec().then(function (entry) {
            resolve(entry.getChildren({ groupKind: true }));
        },reject);
    });
}
exports.hds = hds;
exports.initdb = initdb;
exports.query = query;
