import { BodyRules } from './interfaces'

export type Views = {
    [key: string]: any
}

export type MakeModelOptions = {
    save?: boolean
}

export type InterfaceSuppotrs = 'body' | 'views' | 'methods' | 'loaders'

export type ContainerInterface = {
    [key in InterfaceSuppotrs]?: Array<string>
}

export type Modes = 'status' | 'model' | 'list' | 'dictionary' | 'any'

// List

export type ListWriteOptions = {
    insert?: number
}

// Rule

export type RuleCallback = (...params: any) => true | string

export type RuleArray = Array<BodyRules | RuleCallback>

export interface Rule {
    required: boolean
    handler: RuleCallback
}

// Event

export type EventCallback<T extends any[] = any> = (
    target: any,
    context: EventContext,
    ...params: T
) => void

export type EventContext = {
    id: string
}
