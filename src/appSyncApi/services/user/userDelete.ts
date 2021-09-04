import { FAppSyncUserDelete } from 'appSyncApi'
import {
    coreUserDelete,
    error,
    errorMessages,
    getLanguage,
    handleAsync,
    initCassandraClient,
    initLogger
} from 'services'

const contextReused = () => ({
    logger: initLogger(),
    cassandraClient: initCassandraClient(),
    error,
    errorMessages,
    handleAsync
})

const handler: FAppSyncUserDelete = async event => {
    const context = await contextReused()

    try {
        const { payload } = event.arguments

        const [coreUserDeleteError, coreUserDeleteData] = await coreUserDelete(
            {
                id: payload.id
            },
            context,
            {
                language: getLanguage(event)
            }
        )

        if (coreUserDeleteError) throw error(coreUserDeleteError)

        return coreUserDeleteData
    } finally {
        context.cassandraClient.shutdown()
    }
}

export { handler }
