export enum EKafkaAction {
    CREATE = 'CREATE',
    READ = 'READ',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE'
}

export enum EKafkaTopic {
    POSTS = 'posts',
    CATEGORIES = 'categories',
    USERS = 'users'
}

export interface IKafkaValue {
    data: string
    action: EKafkaAction
}
export interface IKafkaInput {
    topic: string
    partition: number
    offset: number
    key?: string
    value?: string
    timestamp: number
}

export interface IKafkaPayload {
    payload: IKafkaInput
}

export type TKafkaEvent = IKafkaPayload[]
