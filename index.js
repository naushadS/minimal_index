//Requires
let commandLineArgs = require('command-line-args');
let http = require('http');
let requireTree = require('require-tree');
let _ = require('lodash');
require('dotenv').config();
let bunyan = require('bunyan');
let BunyanElasticSearch = require('bunyan-elasticsearch');
let redis = require('redis');

//Declarations
var server = http.createServer(handler);
//for commandLineArgs
let optionDefinitions = [{
    name: 'port',
    alias: 'p',
    type: Number,
    defaultValue: 1995
}];
let options = commandLineArgs(optionDefinitions);

let routes = {
    POST: {},
    GET: {}
}

let runtime = {
    db: {},
    log: "",
    routes: routes
}
let log;
let config = JSON.parse(process.env.dbs)[process.env.name];
console.log('Environment Config====>',config);
//Starting Point
initDBs();

function sendJson(obj, statusCode) {
    let sObj = JSON.stringify(obj);
    //console.log('obj',sObj);
    this.setHeader('Content-Type', 'application/json');
    this.setHeader('Access-Control-Allow-Origin', '*');
    this.statusCode = statusCode || 200;
    this.end(sObj);
}

function isValidJson(json) {
    try {
        JSON.parse(json);
        return true;
    } catch (e) {
        return false;
    }
}

function handler(req, res) {
    let method = req.method;
    let url = req.url;
    console.log("In handler", method, url);

    res.sendJson = sendJson;
    //console.log("Request=========",res,"===============");
    //res.writeHead(200,{'Content-Type':'text/plain'});
    //res.write(String(options.port));
    //console.log('options',options);

    if (!routes[method][url]) {
        res.sendJson({
            message: 'Not Found:Wrong Method or Path'
        }, 404);
    } else {
        let contentType = req.headers['content-type'];
        if (method == 'POST') {
            if (contentType == 'application/json') {
                let body = '';
                req.on('data', (chunk) => {
                    body += chunk;
                }).on('end', () => {
                    console.log('body===>', body);
                    if (isValidJson(body)) {
                        req.payload = JSON.parse(body);
                        routes[method][url](req, res);
                    } else {
                 	res.sendJson({
				message:"invalid json"
			},400);
                    }
                });
            } else {
                res.sendJson({
                    message: 'Didn\'t send Content-Type'
                }, 400);
            }
        } else {
            routes[method][url](req, res);
        }
    }
}

function initApis(functions, filename, path) {
    functions.init(runtime);
    functions = _.omit(functions, 'init');
    //console.log("Inside initApis", 'functions=>', functions, 'filename=>', filename, 'path=>', path);
    for (let fun in functions) {
        let apiPath = path.replace(__dirname + '/apis', '');
        apiPath = apiPath.substring(0, apiPath.length - 3).concat('/' + fun);
        if (!routes[functions[fun].method][apiPath]) {
            routes[functions[fun].method][apiPath] = functions[fun].handler;
        }
    }
}

function initModels(functions, filename, path){
    functions.init(runtime);
}

function init() {
    requireTree('./apis', {
        each: initApis
    });
    requireTree('./models',{
        each: initModels
    });
    console.log(routes);
    let jsonbaba1 = {
        "indexPattern": "[minimalindexlogs-]YYYY.MM.DD",
        "type": "minimalindexlogs",
        "host": "localhost:9200"
    }
    let esStream = new BunyanElasticSearch(jsonbaba1);

    esStream.on('error', function (err) {
        console.log('Elasticsearch Stream Error:', err.stack);
    });

 let jsonbaba = {
        "name":"minimalindexlogs",
        "src":true,
        "streams":[
            {
                "path": "./logs"
            }
        ]
    };
    let bun = bunyan.createLogger({
        name:jsonbaba.name,
        src:jsonbaba.src,
        streams:[
            {stream: esStream},
            {
                path: jsonbaba.streams[0].path
            }
        ]
    });
    runtime.log = bun;
    log = runtime.log;
    log.info("Starting index ===========>");
}

function initDBs(){
    if(config.redis){
        runtime.db.redis=redis.createClient(config.redis);
        runtime.db.redis.on('error',(error)=>{});
        init();
    }else{
        init();
    }
}

server.listen(options.port, () => {
    console.log('listening on port', options.port);
});
