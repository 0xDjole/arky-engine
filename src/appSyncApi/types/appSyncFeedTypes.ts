import { IAppSyncInput } from 'appSyncApi'
import { ICoreFeedGet, ICoreFeedGetInput } from 'services'

export type FAppSyncFeedGet = (
    event: IAppSyncInput<ICoreFeedGetInput>
) => Promise<ICoreFeedGet>
