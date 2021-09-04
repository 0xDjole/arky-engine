class ForbbidenError extends Error {
    constructor(args: string) {
        super(args)
        this.name = 'ForbbidenError'
    }
}

export default ForbbidenError
