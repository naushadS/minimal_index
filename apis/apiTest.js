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
