/**
 * Created by acastillo on 5/22/15.
 */
'use strict';

var db = require("./hds_metabo/db");

var onInit = function(parameters){
    db.initdb(parameters);
}

var execute = function(parameters){
    return db.query(parameters);
    //return parameters.host.name+"="+parameters.query
}

var catResponses = function(response1, response2){
    if(typeof response2 === 'string'){
        if(response2.length==0)
            response2 = null;
        try{
            response2 = JSON.parse(response2);
        }
        catch(e){
            console.log("response2 is not an object");
        }
    }
    if(response1===null)
        return response2;
    if(response2===null)
        return response1;
    if(response1 instanceof Array){
        if(response2 instanceof Array){
            for(var i=0;i<response2.length;i++){
                response1.push(response2[i]);
            }
        }
        else{
            if(response2)
                response1.push(response2);
        }
        return response1;
    }
    else{
        if(response2 instanceof Array){
            for(var i=0;i<response2.length;i++){
                response2.push(response1);
            }
            return response2;
        }
        else{
            return [response1, response2];
        }
    }
}

exports.onInit = onInit;
exports.execute = execute;
exports.catResponses = catResponses;