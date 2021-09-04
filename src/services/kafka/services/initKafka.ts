import { Kafka, KafkaConfig } from 'kafkajs'

const parseJSON = (string: string, alternative: any): any => {
    try {
        const value = JSON.parse(string)
        return value
    } catch (e) {
        return alternative
    }
}

const initKafkaClient = (): Kafka => {
    const isAppLocal = process.env.APP_LOCAL === 'true'

    let kafkaAdditionalOptions: KafkaConfig = {
        clientId: process.env.KAFKA_CLUSTER_ID,
        brokers: parseJSON(process.env.KAFKA_BROKERS, ['broker']),
        retry: {
            retries: 1
        },
        logLevel: 2,
        ssl: false
    }

    if (!isAppLocal) {
        const { username, password } = parseJSON(process.env.KAFKA_SECRET, {
            username: 'username',
            password: 'password'
        })

        kafkaAdditionalOptions = {
            ...kafkaAdditionalOptions,
            ssl: true,
            sasl: {
                mechanism: 'plain',
                username,
                password
            }
        }
    }

    const kafka = new Kafka(kafkaAdditionalOptions)

    return kafka
}

export default initKafkaClient
