export class EventEmitter {
    constructor() {
        this.listeners = {};
    }

    on(eventName, listener) {
        if (this.listeners[eventName] === undefined) {
            this.listeners[eventName] = [listener];
        } else {
            this.listeners[eventName].push(listener);
        }
    }

    emit(eventName, ...args) {
        if (this.listeners[eventName] !== undefined) {
            for (const listener of this.listeners[eventName]) {
                listener(args);
                // TODO maybe try-catch?
            }
        }
    }
}