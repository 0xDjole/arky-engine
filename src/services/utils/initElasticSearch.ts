import { Client, ClientOptions } from '@elastic/elasticsearch'

export class ElasticSearchClient extends Client {}

const initElasticSearch = (): ElasticSearchClient => {
    const clientOptions: ClientOptions = {
        node: process.env.ELASTIC_SEARCH_ENDPOINT,
        auth: {
            username: process.env.ELASTIC_SEARCH_USERNAME,
            password: process.env.ELASTIC_SEARCH_PASSWORD
        }
    }

    return new ElasticSearchClient(clientOptions)
}

export default initElasticSearch
