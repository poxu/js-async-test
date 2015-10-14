var runAsync = (function() {
    return function(callbacks, times) {
        var cnt = times;

        if (callbacks.worker) {
            var worker = function() {
                callbacks.worker();
                cnt -= 1;
                if (cnt === 0) {
                    if(callbacks.onEnd) {
                        callbacks.onEnd();
                    }
                }
            };
            
            for(var i = 0;i<times; ++i) {
                setTimeout(worker, 0);
            }
        }

    };
}());

var runSeq = (function() {
    return function(callbacks, times) {
        var cnt = times;

        if (callbacks.worker) {
            var worker = callbacks.worker;
            
            for(var i = 0;i<times; ++i) {
                worker();
            }
        }

        if(callbacks.onEnd) {
            callbacks.onEnd();
        }

    };
}());

if (typeof module !== 'undefined') {
    module.exports = {
        runAsync: runAsync,
        runSeq: runSeq
    };
}
