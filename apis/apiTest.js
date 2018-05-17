let sm = require('../models/modelTest.js');
let R;

module.exports.init = function(runtime){
	R = runtime;
}

module.exports.apiTestFunction1 = {
	method:'POST',
	handler:apiTestFunction1

};

module.exports.apiTestFunction2 = {
	method:'GET',
	handler:apiTestFunction2

};

module.exports.redisget = {
	method:'GET',
	handler:redisget
}

function apiTestFunction1(req,res){
    console.log("Inside apiTestFunction1");
    console.log('payload',req.payload);
    res.sendJson({
        code:200,
        data:'from apiTestFunction1'
    });
}

function apiTestFunction2(req,res){
    console.log("Inside apiTestFunction2");
    res.sendJson({
        code:200,
        data:'from apiTestFucntion2'
    });
}

function redisget(req,res){
	console.log("inside redisget");
	R.log.info("Got a hit at redisget");
	sm.getCache("a",(err1,res1)=>{
		if(err1){
			//console.log("err",err1);
			R.log.error({
				msg : "Got error while accessing key: a",
                err : err1
            });
			res.sendJson({
				code:500,
				data:err1
			})
		}else{
			if(res1){
				console.log("res",res1);
                /*R.log.error({
                    err : res1
                },'Got success while accessing key: a');*/
                R.log.error({
                    message : 'Got success while accessing key: a',
                    err : res1
                });
				res.sendJson({
					code:200,
					data:res1
				})
			}
		}
	})
}

module.exports.redisgetpromise = {
	method:'GET',
	handler:redisgetPromise
};

function redisgetPromise(req,res){
	console.log("inside redisgetPromise");
	sm.getCachePromise("a")
		.then((fullfilled)=>{
			if(fullfilled){
				console.log("fullfilled",fullfilled);
				res.sendJson({
					code:200,
					data:fullfilled
				})
			}
		})
		.catch((rejected)=>{
			res.sendJson({
				code:500,
				data:rejected
			})
		})
}

module.exports.redisgetasyncawait = {
	method: 'GET',
	handler: redisgetasyncawait
};

async function redisgetasyncawait(req,res){
		try{
		let full= await sm.getCachePromise("a");
		res.sendJson({
			code:200,
			data:full
		})
		}catch(e){
			res.sendJson({
				code:500,
				data:e
			})
		}
}
