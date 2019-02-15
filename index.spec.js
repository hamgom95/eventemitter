const test = require("tape");
const EventEmitter = require("./index");

const withEmitter = (fn) => (t) => fn(t, new EventEmitter());

const eventName = "a";
const noopListener = () => { };
const argsListener = (t, ...expectedArgs) => (...actualArgs) => {
    t.pass("Listener executed");
    if (expectedArgs.length > 0) t.deepEqual(expectedArgs, actualArgs, "Passed event arguments not matching");
};


test("#off(event, listener)", withEmitter((t, e) => {
    t.plan(1);
    const listener = argsListener(t);
    e.on(eventName, listener);
    e.emit(eventName);
    e.off(eventName, listener);
    e.emit(eventName);
}));

test("const off = #on", withEmitter((t, e) => {
    t.plan(1);

    const off = e.on(eventName, argsListener(t));

    e.emit(eventName);
    off();
    e.emit(eventName);
}));

test("#on", (t) => {

    t.test("{}", withEmitter((t, e) => {
        t.plan(4);

        const msg = "test";

        e.on(eventName, argsListener(t, msg));

        e.emit(eventName, msg);
        e.emit(eventName, msg);

    }));

    t.test("{once: true}", withEmitter((t, e) => {
        // check that listener is called only once
        t.plan(1);

        e.on(eventName, argsListener(t), { once: true });

        e.emit(eventName);
        e.emit(eventName);
    }));

    t.test("{prepend: true}", withEmitter((t, e) => {
        // check that listener is called only once
        t.plan(2);

        let counter = 0;
        e.on(eventName, () => {
            t.equal(counter, 1, "counter should be incremented by prepended listener");
        });
        e.on(eventName, () => {
            t.equal(counter, 0, "zero because prepended");
            counter++;

        }, { prepend: true });

        e.emit(eventName);
    }));

});

test("event:error", (t) => {

    t.test("default handler", withEmitter((t, e) => {
        t.plan(4);

        try {
            e.emit("error");
        } catch (e) {
            t.pass("should throw error");
            t.assert(e instanceof TypeError, "should use TypeError by default");
            t.equal(e.message, "Uncaught, unspecified \"error\" event.", "should match default error message");
        }

        t.throws(() => e.emit("error", new Error("test message")), /test message/, "throws passed error");
    }));

    t.test("registered listener", withEmitter((t, e) => {
        e.on("error", noopListener);
        t.doesNotThrow(() => e.emit("error"), "registered listener disables throwing error");

        t.end();
    }));

});

test("event:newListener", withEmitter((t, e) => {
    t.plan(2);

    e.on("newListener", argsListener(t, eventName, noopListener));
    e.on(eventName, noopListener);
}));

test("event:removeListener", withEmitter((t, e) => {
    t.plan(2);

    e.on("removeListener", argsListener(t, eventName, noopListener));

    const off = e.on(eventName, noopListener);
    off();
}));
