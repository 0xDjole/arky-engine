import { FAppSyncUserUpdate } from 'appSyncApi'
import {
    coreUserUpdate,
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

const handler: FAppSyncUserUpdate = async event => {
    const context = await contextReused()
    try {
        const { payload } = event.arguments

        const [coreUserUpdateError, coreUserUpdateData] = await coreUserUpdate(
            {
                userKeyData: {
                    id: payload.userKeyData.id
                },
                updateUserData: {
                    name: payload.updateUserData.name,
                    image: payload.updateUserData.image
                }
            },
            context,
            {
                language: getLanguage(event)
            }
        )

        if (coreUserUpdateError) throw error(coreUserUpdateError)

        return coreUserUpdateData
    } finally {
        context.cassandraClient.shutdown()
    }
}

export { handler }
