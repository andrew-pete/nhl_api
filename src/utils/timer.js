class Timer {
    constructor(inSeconds) {
        if (inSeconds) {
            this._timeScale = 1/1000;
        } else {
            this._timeScale = 1;
        }
    }

    start() {
        const start = new Date() * 1;
        this._startTime = start;
        return start;
    }

    stop() {
        const finish = new Date() * 1;
        this._endTime = finish;
        return finish;
    }

    reset() {
        this._startTime = this._endTime = 0;
        return this;
    }

    get time() {
        return this._timeScale * (this._endTime - this._startTime);
    }
}

module.exports = Timer;