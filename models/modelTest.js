module.exports.init = function(runtime){
console.log("In moduleTest init",runtime);
}


module.exports.testModelFunction = testModelFunction;

function testModelFunction(){
console.log("Inside testModelFunction");
}
