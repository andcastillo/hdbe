'use strict';

var hds = require('hds');
var Entry = hds.Entry;
var servers = require('./mongo.json');
var mongo = hds.mongoext;

require('./kinds');

function initdb(params){
    hds.init({
        database: servers[params]
    }).then(console.log("Connected to mongoDB"));
}

function query(params){
    var query = params.query||{};
    /*if((typeof query)=='string'){
        try{
            query = JSON.parse(query);
        }
        catch(e){
            console.log("String does not seems to be a JSON");
            query = {};
        }
    }*/

    var properties = params.props;
    if((typeof properties)=='string')
        properties = JSON.parse(properties);
    if(query && query.action){
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
            case 'getFile':
                return getFile(query);
                break;
            case 'save':

                break;
            case 'delete':

                break;
            default :
                return new Promise(function (resolve, reject) {
                    resolve(null);
                });
        }
    }
    else
        return new Promise(function (resolve, reject) {
            resolve(null);
        });

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
    //console.log("omg omg");
    return Entry.find(query.kind, constrain).exec();
}

function getChildren(query){
    return new Promise(function (resolve, reject) {
        Entry.findOne(query.kind,{"_id":query._id}).exec().then(function (entry) {
            query.params = query.params||{ groupKind: true };
            if(entry)
                resolve(entry.getChildren(query.params));
            else{
                if(query.params.groupKind&&query.params.groupKind===true)
                    resolve({});
                else
                    resolve([])
            }
        },reject);
    });
}

function getFile(query){
    return new Promise(function(resolve, reject){
        var entry = mongo.readFile(query._id, { root: 'files'}).then(function(file){
                resolve(file.content.toString());
            },function(error){
                resolve(null);
        });

    });
}

exports.hds = hds;
exports.initdb = initdb;
exports.query = query;
