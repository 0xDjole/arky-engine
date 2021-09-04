import {
    CassandraCategory,
    IServiceContext,
    IServiceContextReused
} from 'services'

export type FassandraFeedsByCategoryDelete = (
    params: CassandraCategory,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<CassandraCategory>
