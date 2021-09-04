import { FAppSyncPostsGetFiltered } from 'appSyncApi'

const handler: FAppSyncPostsGetFiltered = async event => {
    return event.info.fieldName as any
}

export { handler }
