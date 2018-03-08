let sm = require('../models/modelTest.js');

module.exports.init = function(runtime){
//console.log("Inside apiTest init",runtime);
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
	sm.getCache("a",(err1,res1)=>{
		if(err1){
			//console.log("err",err1);
			res.sendJson({
				code:500,
				data:err1
			})
		}else{
			if(res1){
				console.log("res",res1);
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
}

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