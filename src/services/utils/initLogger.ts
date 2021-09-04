import winston, { Logger } from 'winston'

const customLevels = {
    levels: {
        trace: 5,
        debug: 4,
        info: 3,
        warn: 2,
        error: 1,
        fatal: 0
    },
    colors: {
        trace: 'white',
        debug: 'green',
        info: 'green',
        warn: 'yellow',
        error: 'red',
        fatal: 'red'
    }
}

const initLogger = (): Logger => {
    const logger = winston.createLogger({
        levels: customLevels.levels,
        transports: [new winston.transports.Console()]
    })

    winston.addColors(customLevels.colors)

    return logger
}

export default initLogger
