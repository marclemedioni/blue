export function log(msg: string) {
    const debug = (process.env.NODE_ENV || "development") === "development"
    if (debug) {
        console.log(msg)
    }
}