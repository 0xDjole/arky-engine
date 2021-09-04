class MissingParametersError extends Error {
    constructor(args: string) {
        super(args)
        this.name = 'MissingParametersError'
    }
}

export default MissingParametersError
