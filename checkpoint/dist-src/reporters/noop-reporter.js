import BaseReporter from './base-reporter.js';
export default class NoopReporter extends BaseReporter {
    lang(key, ...args) {
        return 'do nothing';
    }
    verbose(msg) { }
    verboseInspect(val) { }
    initPeakMemoryCounter() { }
    checkPeakMemory() { }
    close() { }
    getTotalTime() {
        return 0;
    }
    list(key, items, hints) { }
    tree(key, obj) { }
    step(current, total, message, emoji) { }
    error(message) { }
    info(message) { }
    warn(message) { }
    success(message) { }
    log(message) { }
    command(command) { }
    inspect(value) { }
    header(pkg) { }
    footer(showPeakMemory) { }
    table(head, body) { }
    activity() {
        return {
            tick(name) { },
            end() { },
        };
    }
    activitySet(total, workers) {
        return {
            spinners: Array(workers).fill({
                clear() { },
                setPrefix() { },
                tick() { },
                end() { },
            }),
            end() { },
        };
    }
    progress(total) {
        return function () { };
    }
    disableProgress() {
        this.noProgress = true;
    }
}
