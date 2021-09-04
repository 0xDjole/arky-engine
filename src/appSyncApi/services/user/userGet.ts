import { FAppSyncUserGet } from 'appSyncApi'

const handler: FAppSyncUserGet = async event => {
    return event.info.fieldName as any
}

export { handler }
