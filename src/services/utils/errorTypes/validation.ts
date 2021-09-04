class ValidationError extends Error {
    constructor(args: string) {
        super(args)
        this.name = 'ValidationError'
    }
}

export default ValidationError
