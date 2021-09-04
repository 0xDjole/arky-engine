import { EKafkaAction } from 'services'

const toValidKafkaTopicName = (
    topicName: string,
    action: EKafkaAction
): string =>
    topicName
        .split('#')
        .join('_')
        .split(':')
        .join('_')
        .split('-')
        .join('_')
        .concat('_')
        .concat(action)
        .replace(/\s/g, '')
        .replace('č', 'c')
        .replace('č', 'c')
        .replace('ž', 'z')
        .replace('š', 's')
        .replace('đ', 'dj')
        .replace('Ć', 'c')
        .replace("'", '')
        .replace('&', 'and')

export default toValidKafkaTopicName
