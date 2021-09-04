import { types as cassandraTypes } from 'cassandra-driver'
import moment from 'moment'

const cassandaTimeUuid = (startOf: moment.unitOfTime.StartOf): string => {
    const timeUuid = cassandraTypes.TimeUuid.fromDate(
        moment().startOf(startOf).toDate()
    ).toString()

    return timeUuid
}

export default cassandaTimeUuid
