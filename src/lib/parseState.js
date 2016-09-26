const Transform = require(`stream`).Transform
const objectFromString = require(`object-from-string`)(`:`)

// const parseLines = chunk => {
//   const chunkString = chunk.toString()
//   const dateIndex = chunkString.match(/\d{4}-\d{2}-\d{2}/).index
//   const lastNewline = chunkString.lastIndexOf(`\n\n`)
//   return chunkString.slice(dateIndex, lastNewline).split(`\n`)
// }

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

const parseFilesArray = filesString => {
  return { files: filesString.split(`\n o `).slice(1) }
}

const parseState = new Transform({
  transform(chunk, encoding, callback) {
    // const lines = parseLines(chunk)
    const chunkString = chunk.toString()
    this.push(
      Object.assign(
        {},
        parseStatusLine(chunkString.slice(chunkString.indexOf(`\n`), chunkString.match(/\n\so\s/).index)),
        parseFilesArray(chunkString.slice(chunkString.match(/\n\so\s/).index))
      )
    )
    callback()
  },
  objectMode: true
})

module.exports = parseState
