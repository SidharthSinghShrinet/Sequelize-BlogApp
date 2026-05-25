class ErrorHandler extends Error{
    private statusCode:number;
    constructor(message:string,statusCode:number) {
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}

export default ErrorHandler;