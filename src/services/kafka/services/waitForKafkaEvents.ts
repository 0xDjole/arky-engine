import { Consumer, Kafka } from 'kafkajs'
import { arrayBufferToString, TKafkaEvent } from 'services'

const waitForKafkaEvents = async (
    kafka: Kafka,
    messagesAmount: number,
    fromBeginning: boolean,
    newTopic: string,
    newGroupId: string
): Promise<TKafkaEvent> => {
    const consumer: Consumer = kafka.consumer({ groupId: newGroupId })
    await consumer.connect()
    await consumer.subscribe({ topic: newTopic, fromBeginning })

    let resolveOnConsumption: (messages: TKafkaEvent) => void
    let rejectOnError: (e: Error) => void

    const returnThisPromise = new Promise<TKafkaEvent>((resolve, reject) => {
        resolveOnConsumption = resolve
        rejectOnError = reject
    }).finally(() => consumer.disconnect()) // disconnection is done here, reason why is explained below

    const messages: TKafkaEvent = []

    await consumer.run({
        autoCommit: false,
        eachMessage: async ({ message, partition, topic }) => {
            try {
                // eachMessage is called by eachBatch which can consume more than messagesAmount.
                // This is why we manually commit only messagesAmount messages.
                if (messages.length < messagesAmount) {
                    const jsonValue = arrayBufferToString(message.value)
                    const parsedMessageValue = JSON.parse(jsonValue)

                    const jsonKey = arrayBufferToString(message.key)
                    const parsedMessageKey = message.key
                        ? JSON.parse(jsonKey)
                        : null

                    messages.push({
                        payload: {
                            partition,
                            topic: newTopic,
                            offset: Number(message.offset),
                            value: JSON.stringify(parsedMessageValue),
                            key: parsedMessageKey,
                            timestamp: Number(message.timestamp)
                        }
                    })

                    // +1 because we need to commit the next assigned offset.
                    await consumer.commitOffsets([
                        {
                            topic,
                            partition,
                            offset: (Number(message.offset) + 1).toString()
                        }
                    ])
                }

                if (messages.length === messagesAmount) {
                    // I think we should be able to close the connection here, but kafkajs has a bug which makes it hang if consumer.disconnect is called too soon after consumer.run .
                    // This is why we close it in the promise's finally block

                    resolveOnConsumption(messages)
                }
            } catch (e) {
                rejectOnError(e)
            }
        }
    })

    return returnThisPromise
}

export default waitForKafkaEvents
