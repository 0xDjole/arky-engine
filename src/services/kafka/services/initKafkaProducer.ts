import { Kafka, Producer } from 'kafkajs'

const initKafkaProducer = async (kafkaClient: Kafka): Promise<Producer> => {
    const producer = kafkaClient.producer()

    return producer.connect().then(() => producer)
}

export default initKafkaProducer
