const Transform = require(`stream`).Transform

const split = Object.assign(
  new Transform({
    transform(chunk, encoding, callback) {
      const i = chunk.indexOf(Buffer(`\n\n`))
      if (i >= 0) {
        this.push(Buffer.concat([this.queue, chunk.slice(0, i)]))
        this.queue = chunk.slice(chunk.lastIndexOf(Buffer(`\n`)))
        callback()
      } else {
        this.queue = Buffer.concat([this.queue, chunk], this.queue.length + chunk.length)
        callback()
      }
    }
  }),
  { queue: Buffer.alloc(0) }
)

module.exports = split
