const Transform = require(`stream`).Transform

module.exports = new Transform({
  transform(chunk, encoding, next) {
  },
  objectMode: true
})
