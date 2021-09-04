import { Producer } from 'kafkajs'
import {
    EKafkaAction,
    EKafkaTopic,
    error,
    handleAsync,
    toValidKafkaTopicName,
    withHandleAsync
} from 'services'

interface IID {
    id: string
}

const encode = (registryId: number, payload: any) => {
    const registryIdBuffer = Buffer.alloc(4)
    registryIdBuffer.writeInt32BE(registryId, 0)
    return Buffer.concat([
        Buffer.alloc(1),
        registryIdBuffer,
        Buffer.from(JSON.stringify(payload))
    ])
}

const kafkaMessageProduce = async <T extends IID>(
    kafkaProducer: Producer,
    data: T,
    topic: EKafkaTopic,
    action: EKafkaAction
): Promise<void> => {
    const valueRaw = JSON.stringify({
        data,
        action
    })
    const isAppLocal = process.env.APP_LOCAL === 'true'

    const topicName = isAppLocal
        ? toValidKafkaTopicName(data.id, action)
        : topic
    const value = isAppLocal ? valueRaw : encode(100016, valueRaw)

    const [kafkaProducerError] = await handleAsync(
        kafkaProducer.send({
            topic: topicName,
            messages: [
                {
                    value
                }
            ]
        })
    )

    if (kafkaProducerError)
        throw error({
            name: kafkaProducerError.name,
            message: kafkaProducerError.message
        })
}

export default withHandleAsync(kafkaMessageProduce)
