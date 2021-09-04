export enum EElasticSearchIndex {
    POSTS = 'posts',
    CATEGORIES = 'categories',
    USERS = 'users',
    PERMISSIONS = 'permissions'
}

export interface GetRandomPostSearchBody {
    bool: {
        must: {
            match_all: {}
        }
        filter: [
            {
                geo_distance: {
                    distance: String
                    location: {
                        lat: string
                        lon: string
                    }
                }
            },
            {
                terms_set?: {
                    'categories.name': {
                        terms: string[]
                        minimum_should_match_script: {
                            source: string
                        }
                    }
                }
            }?
        ]
    }
}

export interface ShardsResponse {
    total: number
    successful: number
    failed: number
    skipped: number
}

export interface Explanation {
    value: number
    description: string
    details: Explanation[]
}

export interface SearchResponse<T> {
    took: number
    timed_out: boolean
    _scroll_id?: string
    _shards: ShardsResponse
    hits: {
        total: number
        max_score: number
        hits: Array<{
            _index: string
            _type: string
            _id: string
            _score: number
            _source: T
            _version?: number
            _explanation?: Explanation
            fields?: any
            highlight?: any
            inner_hits?: any
            matched_queries?: string[]
            sort?: string[]
        }>
    }
    aggregations?: any
}

export type ElasticSearchPage<T> = T[]
