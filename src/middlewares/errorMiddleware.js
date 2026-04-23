// Centralized error handler
// Express sends all errors here when next(error) is called

export function errorMiddleware(err,req,res,next){
    // If response has already started (headers sent),
    // we cannot modify status or send a new body.
    // Attempting to do so would cause:
    // "Cannot set headers after they are sent" error.
    // So we delegate to Express's default error handler,
    // which safely finalizes the response and closes the connection.
    // If response already started, delegate to Express default handler
    if (res.headersSent) {
      return next(err);
    }


    // console.error("Error : ",err.message) // notice console.error not .log 
    console.error("ERROR:", err.stack); // log full internally
    const status=err.status || 500; //known vs unknown error separation 
   return res.status(status).json({
        success:false,
        error:{
            // message:status===500 ? "Internal Server Error" : err.message,
            message:err.isOperational ? err.message : "Internal Server Error" ,
            type : err.name,
            status
        }
    })
}