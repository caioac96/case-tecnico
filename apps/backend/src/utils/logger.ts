class Logger {
    private context: string
    private timers: Map<string, bigint>

    constructor(context = '') {
        this.context = context
        this.timers = new Map()
    }

    now() {
        return new Date().toLocaleString()
    }

    format(message: string) {
        return this.context
            ? `[${this.now()}] [${this.context}] ${message}`
            : `[${this.now()}] ${message}`
    }

    log(...args: any[]) {
        console.log(`[API][log]${this.format(args.join(' '))}`)
    }

    info(...args: any[]) {
        console.info(`[API][info]${this.format(args.join(' '))}`)
    }

    warn(...args: any[]) {
        console.warn(`[API][WARN]${this.format(args.join(' '))}`)
    }

    error(...args: any[]) {
        console.error(`[API][ERROR]${this.format(args.join(' '))}`)
    }

    time(label: string) {
        this.timers.set(label, process.hrtime.bigint())
        console.log(`[API][start]${this.format(`${label}`)}`)
    }

    timeEnd(label: string) {
        const start = this.timers.get(label)

        if (!start) {
            console.warn(`[API][WARN]${this.format(`Timer '${label}' not found`)}`)
            return
        }

        const end = process.hrtime.bigint()
        const durationMs = Number(end - start) / 1_000_000

        console.log(
            this.format(`[API][end]${label} | ${durationMs.toFixed(2)} ms`)
        )

        this.timers.delete(label)
    }
}

const logger = new Logger()
export default logger;