const Transform = require(`stream`).Transform
const objectFromString = require(`object-from-string`)(`:`)

const parseStatusLine = line => {
  const timeStatusDivider = line.match(/\+\d{4}/).index + 5
  const timestamp = line.slice(0, timeStatusDivider).trim()
  const status = line.slice(timeStatusDivider).trim()
    .split(` `)
    .reduce((acc, el) => {
      return Object.assign(acc, objectFromString(el))
    }, {})
  return { timestamp, status }
}

const parseFiles = filesString => {
  return { files: filesString.split(`\n o `).slice(1) }
}

const parseState = new Transform({
  transform(chunk, encoding, callback) {
    const chunkString = chunk.toString()
    const filesDivider = chunkString.match(/\n\so\s/).index
    this.push(
      Object.assign(
        {},
        parseStatusLine(chunkString.slice(chunkString.match(/\d{4}-\d{2}-\d{2}/).index, filesDivider)),
        parseFiles(chunkString.slice(filesDivider))
      )
    )
    callback()
  },
  objectMode: true
})

module.exports = parseState
