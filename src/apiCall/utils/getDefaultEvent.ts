import { IGetDefaltEvent } from 'appSyncApi'
import { AppSyncResolverEventHeaders } from 'aws-lambda'

const getDefaultEvent: IGetDefaltEvent = (
    eventArguments,
    eventFieldName,
    openIdToken: string
) => {
    let headers: AppSyncResolverEventHeaders = {
        'Accept-Language': 'en-US',
        origin: 'http://localhost:3000'
    }

    if (openIdToken) {
        headers = { ...headers, authorization: openIdToken }
    }

    return {
        identity: {
            sub: '',
            issuer: '',
            username: '',
            claims: {},
            sourceIp: [],
            defaultAuthStrategy: '',
            groups: []
        },
        request: {
            headers
        },
        info: {
            selectionSetList: [],
            selectionSetGraphQL: '',
            parentTypeName: '',
            fieldName: eventFieldName,
            variables: {}
        },
        arguments: eventArguments,
        prev: {
            result: {}
        },
        source: {},
        result: {},
        stash: {}
    }
}

export default getDefaultEvent
