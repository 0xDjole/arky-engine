import {
    ArrayOrObject,
    Client,
    DseClientOptions,
    QueryOptions,
    types as cassandraTypes
} from 'cassandra-driver'
import path from 'path'
import { handleAsync } from 'services'

export class CassandraClient extends Client {
    async handleExecute<U = Error>(
        query: string,
        params?: ArrayOrObject,
        options?: QueryOptions
    ): Promise<[U, undefined] | [undefined, cassandraTypes.ResultSet]> {
        return handleAsync(this.execute(query, params, options))
    }

    async handleBatch<U = Error>(
        queries: Array<string | { query: string; params?: ArrayOrObject }>,
        options?: QueryOptions
    ): Promise<[U, undefined] | [undefined, cassandraTypes.ResultSet]> {
        return handleAsync(this.batch(queries, options))
    }
}

const initCassandraClient = (): CassandraClient => {
    const isAppLocal = process.env.APP_LOCAL === 'true'
    let clientOptions: DseClientOptions = {
        keyspace: process.env.CASSANDRA_KEYSPACE
    }

    if (!isAppLocal) {
        clientOptions = {
            ...clientOptions,
            cloud: {
                secureConnectBundle: path.resolve(
                    path.join(__dirname, 'secure-connect-tox.zip')
                )
            },
            credentials: {
                username: process.env.CASSANDRA_USERNAME,
                password: process.env.CASSANDRA_PASSWORD
            }
        }

        return new CassandraClient(clientOptions)
    }

    return new CassandraClient({
        ...clientOptions,
        protocolOptions: {
            maxVersion: 4
        },
        contactPoints: ['127.0.0.1:9042'],
        localDataCenter: 'datacenter1'
    })
}

export default initCassandraClient
