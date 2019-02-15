/**
 * Event emitter.
 * @property {Map} events Event listener map
 */
class EventEmitter {
    constructor() {
        this.events = new Map();
    }

    _errorHandler() {
        throw TypeError('Uncaught, unspecified "error" event.');
    }

    _newListener(event, listener, prepend=false) {
        if (typeof listener !== 'function') {
            throw new TypeError('The listener must be a function');
        }

        let listeners = this.events.get(event);
        if (!listeners) {
            listeners = new Array();
            this.events.set(event, listeners);
        }
        this.emit("newListener", event, listener);
        if (prepend) {
            listeners.unshift(listener);
        } else {
            listeners.push(listener);
        }
    }

    /**
     * Register event listener
     * @param {string} event Event name
     * @param {function} listener Listener callback
     * @param {Object} opts Options
     * @param {boolean} opts.prepend Whether to prepend listener
     * @param {boolean} opts.once Whether to use listener once only
     */
    on(event, listener, {prepend=false, once=false} = {}) {
        if (once) listener.once = true;
        this._newListener(event, listener, prepend);
        return () => this.off(event, listener);
    }


    /**
     * Unregister listener.
     * @param {string} [event] Event name.
     * @param {function} [listener] Same function that was registered.
     */
    off(event, listener) {
        switch (arguments.length) {
            case 0: {
                const events = new Map(this.events);
                this.events.clear();
                return () => {
                    for (const [event, listeners] of events.entries()) {
                        for (const listener of listeners) {
                            this._newListener(event, listener);
                        }
                    }
                }
            }
            case 1: {
                const listeners = this.events.get(event);
                this.events.delete(event);
                return () => {
                    for (const listener of listeners) {
                        this._newListener(event, listener);
                    }
                };
            }
            default: {
                const listeners = this.events.get(event);
                if (listeners) {
                    const idx = listeners.indexOf(listener);
                    if (idx !== -1) {
                        listeners.splice(idx, 1);
                        this.emit("removeListener", event, listener);
                    }
                }
                return () => this.on(event, listener);
            }
        };
    }

    /**
     * Emit event with arguments.
     * @param {string} event Event name.
     * @param  {...any} args Arguments to pass to listeners.
     */
    emit(event, ...args) {
        const listeners = this.events.get(event);
        if (listeners) {
            for (const listener of listeners) {
                listener.apply(this, args);
                if (listener.once) this.off(event, listener);
            }
        } else if (event === "error") {
            this._errorHandler();
        }
    }
}

module.exports = EventEmitter;