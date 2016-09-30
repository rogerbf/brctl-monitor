const Transform = require(`stream`).Transform
const split = require(`recursive-buffer-split`)

const newline_newline = Buffer(`\n\n`)

module.exports = () => {
  return Object.assign(
    new Transform({
      transform(chunk, encoding, next) {
        split(newline_newline, chunk)
          .map(s => {
            if (s.length > 0) {
              this.push(Buffer.concat([s, newline_newline]))
            }
          })
        next()
      }
    })
  )
}
