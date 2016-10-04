const Transform = require(`stream`).Transform
const split = require(`recursive-buffer-split`)

const newline = Buffer(`\n`)

module.exports = () =>
  Object.assign(
    new Transform({
      transform(chunk, encoding, next) {

        const arr = split(newline, chunk)

        const processed = arr.reduce((acc, c) => {
          if (c.indexOf(` o `) >= 0 || c.indexOf(`total:`) >= 0) {
            return Buffer.concat([acc, c, Buffer(`\n`)])
          } else {
            return acc
          }
        }, this.queue)

        this.queue = Buffer.alloc(0)

        if (arr[arr.length - 1].length === 0 && arr[arr.length - 2].length === 0) {
          this.push(processed)
          this.queue = Buffer.alloc(0)
        } else {
          this.queue = Buffer.concat([this.queue, processed])
        }

        next()
      }
    }), {
      queue: Buffer.alloc(0)
    }
  )
