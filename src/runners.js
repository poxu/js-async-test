var runAsyncWithoutRace = (function() {
    return function(callbacks, times) {
        var flags = Array(times);

        for(var i = 0;i < flags.length;++i) {
            flags[i] = false;
        }
        
        var sum = 0;


        if (callbacks.worker) {
            var worker = function(iteration) {
                var num = callbacks.worker(iteration);
                sum += num;
                flags[iteration] = true;

                var isOver = flags.every(function(flag) {
                    return flag === true;
                });

                if (isOver) {
                    if(callbacks.onEnd) {
                        callbacks.onEnd(sum);
                    }
                }
            };
            
            for(var i = 0;i<times; ++i) {
                setTimeout(worker, 0, i);
            }
        }

    };
}());

var runAsync = (function() {
    return function(callbacks, times) {
        var cnt = times;
        var sum = 0;

        if (callbacks.worker) {
            var worker = function(iteration) {
                var num = callbacks.worker(iteration);
                sum += num;
                cnt -= 1;
                if (cnt === 0) {
                    if(callbacks.onEnd) {
                        callbacks.onEnd(sum);
                    }
                }
            };
            
            for(var i = 0;i<times; ++i) {
                setTimeout(worker, 0, i);
            }
        }

    };
}());

var runSeq = (function() {
    return function(callbacks, times) {
        var cnt = times;
        var sum = 0;

        if (callbacks.worker) {
            var worker = callbacks.worker;
            
            for(var i = 0;i<times; ++i) {
                var num = worker(i);
                sum += num;
            }
        }

        if(callbacks.onEnd) {
            callbacks.onEnd(sum);
        }

    };
}());

if (typeof module !== 'undefined') {
    module.exports = {
        runAsync: runAsync,
        runAsyncWithoutRace: runAsyncWithoutRace,
        runSeq: runSeq
    };
}
