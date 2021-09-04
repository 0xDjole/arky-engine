import { types as CassandraTypes } from 'cassandra-driver'
import { ICassandraPage } from 'services'

export const pageFromItem = (item: CassandraTypes.Row): ICassandraPage => {
    return {
        number: item.number,
        itemCount: item.item_count,
        totalCount: item.total_count
    }
}
