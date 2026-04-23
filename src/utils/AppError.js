//now will call throw new AppError("error message",404) instead of throw new Error("error message")
// Custom error class for operational errors (expected errors like validation failures)
class AppError extends Error{ //remember it should be Error and not Error()
    constructor(message,status){
        super(message);      //this calls constructor of parent class and initialise that obj and that obj is then modified further using below code , here it is similar to Error(message)
        this.status=status; // this means current instance
        this.isOperational=true;       // marks as expected error

        Error.captureStackTrace(this,this.constructor) //this tells V8: Start stack trace from where this error was created, not from inside the constructor , So it cleans stack output.


    } // we dont need anything extra in this class so only constructor and no extra functions so only obj is modified 
}
export {AppError};