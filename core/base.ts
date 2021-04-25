const onDevErrors: Array<any> = []

type DevErrorContext = {
    name: string
    target: any
    message: string
    functionName: string
}

class Base {
    _base: { name: string }

    constructor(name: string) {
        this._base = {
            name
        }
    }

    static onDevError(callback: (context: DevErrorContext) => void) {
        onDevErrors.push(callback)
    }

    $devError(functionName: string, message: string) {
        for (let callback of onDevErrors) {
            callback.call(this, {
                name: this._base.name,
                target: this,
                message,
                functionName
            })
        }
        throw new Error(`ALAS _(X_X)_ ${this._base.name} => ${functionName} -> ${message}`)
    }
}

export default Base
