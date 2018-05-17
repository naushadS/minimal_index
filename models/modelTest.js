let R;
module.exports.init = function(runtime){
R = runtime;
//console.log("%%%%%%%%%%R",R);
}

module.exports.getCache = getCache;

//used callbacks for async code
function getCache(key,cb){
console.log("Inside getCache");
console.log("R",R.db.redis.ready);
if(R.db.redis.connected && R.db.redis.ready){
    console.log("in if connected:true and ready:true");
    R.db.redis.get(key,(err,res)=>{
        if(err){
            //console.log("err in get Cache",Object.keys(err));
            if(err.code==='NOAUTH'){
                let errObj={
                    "msg": "Redis Authentication Problem"
                };
                return cb(errObj,null);
            }
            return cb(err,null);
        }else{
            if(res){
                console.log("res in get cache:",res);
                return cb(null,res)
            }
        }
    })
}else{
    console.log("in else connected:",R.db.redis.connected,"ready:",R.db.redis.ready);
    let err="redisDown";
    console.log("###########Redis is down");
    return cb(err,null)
}
}

module.exports.getCachePromise = getCachePromise;

//used promises for async code 
function getCachePromise(key){
    return new Promise((resolve,reject)=>{
    console.log("Inside getCachePromise");
    console.log("R",R.db.redis.ready);
    if(R.db.redis.connected && R.db.redis.ready){
        console.log("in if connected:true and ready:true");
        R.db.redis.get(key,(err,res)=>{
            if(err){
                if(err.code==='NOAUTH'){
                    let errObj={
                        "msg": "Redis Authentication Problem"
                    };
                    reject(errObj);
                }
                reject(err);
            }else{
                if(res){
                    console.log("res in get cache:",res);
                    resolve(res)
                }
            }
        })
    }else{
        console.log("in else connected:",R.db.redis.connected,"ready:",R.db.redis.ready);
        let err="redisDown";
        console.log("###########Redis is down");
        reject(err);
    }
})
}

module.exports.getCacheAsyncAwait = getCacheAsyncAwait;

async function getCacheAsyncAwait(key){
    console.log("inside getCacheAsyncAwait");
    if(R.db.redis.connected && R.db.redis.ready){
        R.db.redis.get(key,(err,res)=>{
            if(err){
                if(err.code === 'NOAUTH'){
                    let errObj = {
                        "msg": "Redis Authentication Problem" 
                    };
                    throw errObj
                }
                throw err;
            }else{
                if(res){
                    console.log("got redis resp",res);
                    return res;
                }
            }
        });
    }else{
        console.log("in else connected:",R.db.redis.connected,"ready:",R.db.redis.ready);
        let err="redisDown";
        console.log("###########Redis is down");
        throw err;
    }
}