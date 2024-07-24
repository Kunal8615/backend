const asynchandler = (requesthandler)=>{
    
    return (req,res,next) =>{
        Promise.resolve(requesthandler(req,res,next))
        .catch((error)=>next(error))
    }
}

export {asynchandler}


//meth0d 2
//const asynhandler = (fn)=>async(req,res,next)=>{
//    try {
//        await fn(res,res,next)
//    } catch (error) {
 //       res.status(error.code || 500).json({
//            success :false,
//            message : error.message
 //       })
//    }
//}
