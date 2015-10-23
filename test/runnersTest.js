var expect = require('expect.js');

var exports = require('../src/runners.js');

var runAsync = exports.runAsync;

var getTime = function() {
    return new Date().getTime();
};

describe('Runners', function() {
    var functions = Object.keys(exports);

    functions.forEach(function(funcName) {
        var func = exports[funcName];

    describe('#' + funcName, function() {
        it('should run final callback', function(done) {
            func({
                worker: function() {},
                onEnd: function() {
                    done();
                }
            }, 10);

        });

        it('should count sum correctly', function(done) {
            func({
                worker: function(num) {
                   return 1; 
                },
                onEnd: function(sum) {
                    expect(sum).to.be.equal(10);
                    done();
                }
            }, 10);

        });

        it('should run worket 10 times and run callback after all workers are done', function(done) {
            var times = 10;
            func({
                worker: function() {
                    times -= 1;
                },
                onEnd: function() {
                    expect(times).to.be.equal(0);
                    done();
                }
            }, times);
        });


        it('should not run callbacks simultaniously', function(done) {
            this.timeout(10000);
            this.slow(20000);
            var startTime = getTime();
            var lastCallbackTime = startTime;
            var workersTime = 0;

            func({
                worker: function() {
                    var currTime = getTime();

                    for(var cnt = getTime(); getTime() - cnt < 1000;);

                    workersTime += (currTime - lastCallbackTime);
                    lastCallbackTime = currTime;
                },
                onEnd: function() {
                    var endTime = getTime();
                    var executorTime = endTime - startTime;
                    expect(executorTime).to.be.within(workersTime, Infinity);
                    done();
                }
            }, 5);
        });
    });
    });
});


