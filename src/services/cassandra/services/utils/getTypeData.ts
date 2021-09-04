import { types as CassandraTypes } from 'cassandra-driver'

const getTypeData = (
    data: CassandraTypes.Row,
    type: string
): CassandraTypes.Row =>
    Object.keys(data)
        .filter(key => key.indexOf(type) === 0)
        .reduce(
            (currentData, key) => ({
                ...currentData,
                [key.split(`${type}_`)[1]]: data[key]
            }),
            {} as CassandraTypes.Row
        )

export default getTypeData
