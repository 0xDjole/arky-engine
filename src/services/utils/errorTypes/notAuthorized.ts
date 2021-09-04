class NotAuthorizedError extends Error {
    constructor(args: string) {
        super(args)
        this.name = 'NotAuthorized'
    }
}

export default NotAuthorizedError
