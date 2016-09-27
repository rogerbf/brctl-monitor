const Transform = require(`stream`).Transform
const objectFromString = require(`object-from-string`)(`:`)

const extractStatusAndFileStrings = chunk => {
  const chunkString = chunk.toString()
  const date = new RegExp(/\d{4}-\d{2}-\d{2}/)
  const filesDivider = chunkString.match(/\n\so\s/).index
  return {
    status: chunkString.slice(chunkString.match(date).index, filesDivider),
    files: chunkString.slice(filesDivider)
  }
}

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

const parseFiles = fileString => {
  const parsed = fileString
    .split(`\n o `)
    .slice(1)
    .map(file => {
      const parts = file.split(` `)
      return {
        path: parts[0],
        status: parts.slice(1).join(` `)
      }
    })
    .map(file => {
      switch (file.status[0]) {
        case `☁`:
        return Object.assign({}, file, { status: { state: `synchronized`, raw: file.status } })
        break;
        case `↑`:
        return Object.assign({}, file, { status: { state: `uploading`, raw: file.status } })
        break;
        default:
        if (/^\(Waiting/.test(file.status)) {
          return Object.assign({}, file, { status: { state: `waiting`, raw: file.status, message: file.status.slice(file.status.indexOf(`)`) + 1).trim() } })
        } else {
          return Object.assign({}, file, { status: { state: `unknown`, raw: file.status } })
        }
      }
    })
  return {
    files: parsed
  }
}

const parseState = new Transform({
  transform(chunk, encoding, callback) {
    const strings = extractStatusAndFileStrings(chunk)
    this.push(
      Object.assign(
        {},
        parseStatusLine(strings.status),
        parseFiles(strings.files)
      )
    )
    callback()
  },
  objectMode: true
})

module.exports = parseState
