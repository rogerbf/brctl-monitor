const Transform = require(`stream`).Transform
const recursiveSplit = require(`recursive-buffer-split`)

const newline_newline = Buffer(`\n\n`)

module.exports = () => {
  return Object.assign(
    new Transform({
      transform(chunk, encoding, next) {
        recursiveSplit(newline_newline, chunk)
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
