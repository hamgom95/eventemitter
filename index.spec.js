const test = require("tape");
const EventEmitter = require("./index");

test("EventEmitter", (t) => {

    const noop = () => {};
    const name = "a";

    t.test("#off(event, listener)", (t) => {
        t.plan(1);

        const e = new EventEmitter();
        const listener = () => {
            t.pass("Listener executed");
        };

        e.on(name, listener);

        e.emit(name);
        e.off(name, listener);
        e.emit(name);
    });

    t.test("const off = #on", (t) => {
        t.plan(1);

        const e = new EventEmitter();

        const off = e.on(name, () => {
            t.pass("Listener executed");
        });

        e.emit(name);
        off();
        e.emit(name);
    });

    t.test("#on", (t) => {

        t.test("{}", (t) => {
            t.plan(4);

            const e = new EventEmitter();
            const msg = "test";

            e.on(name, (a1) => {
                t.pass("Listener executed");
                t.equal(a1, msg, "Arguments should be equal");
            });

            e.emit(name, msg);
            e.emit(name, msg);

        });

        t.test("{once: true}", (t) => {
            // check that listener is called only once
            t.plan(1);
    
            const e = new EventEmitter();
    
            e.on(name, () => {
                t.pass("Listener executed");
            }, {once: true});
    
            e.emit(name);
            e.emit(name);
        });

        t.test("{prepend: true}", (t) => {
            // check that listener is called only once
            t.plan(2);
    
            let counter = 0;
            const e = new EventEmitter();
    
            e.on(name, () => {
                t.equal(counter, 1, "counter should be incremented by prepended listener");
            });
            e.on(name, () => {
                t.equal(counter, 0, "zero because prepended");
                counter++;

            }, {prepend: true});

            e.emit(name);
        });    
        
    });

    t.test("event:error", (t) => {

        t.test("default handler", (t) => {
            t.plan(4);

            const e = new EventEmitter();

            try {
                e.emit("error");
            } catch (e) {
                t.pass("should throw error");
                t.assert(e instanceof TypeError, "should use TypeError by default");
                t.equal(e.message, "Uncaught, unspecified \"error\" event.", "should match default error message");
            }

            t.throws(() => e.emit("error", new Error("test message")), /test message/, "throws passed error");
        });
    
        t.test("registered listener", (t) => {
            const e = new EventEmitter();
    
            e.on("error", noop);
            t.doesNotThrow(() => e.emit("error"), "registered listener disables throwing error");
            
            t.end();
        });

    });

    t.test("event:newListener", (t) => {

        t.plan(3);

        const e = new EventEmitter();

        e.on("newListener", (event, listener) => {
            t.pass("newListener is called");
            t.equal(event, name, "event name matches");
            t.equal(listener, noop, "listener function matches");
        }); 
        e.on(name, noop);
    });

    t.test("event:removeListener", (t) => {

        t.plan(3);

        const e = new EventEmitter();

        e.on("removeListener", (event, listener) => {
            t.pass("removeListener is called");
            t.equal(event, name, "event name matches");
            t.equal(listener, noop, "listener function matches");
        }); 
        const off = e.on(name, noop);
        off();
    });

    t.end();
});