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

const parseStatusLine = line => {
  const timeStatusDivider = line.match(/\+\d{4}/).index + 5
  const timestamp = line.slice(0, timeStatusDivider).trim()
  const status = line.slice(timeStatusDivider).trim()
    .split(/\s/)
    .reduce((acc, el) => {
      return Object.assign(acc, objectFromString(el))
    }, {})
  return { timestamp, status}
}

const parseBytes = str => {
  if (/\(\d*\)/.test(str)) {
    // "↑ 793 K (793150) 95.0%"
    return str.slice(
      str.indexOf(`(`) + 1,
      str.indexOf(`)`)
    )
  } else {
    // "↑ 18 byte 95.0%"
    return str.split(/\s/)[1]
  }
}

const parseFiles = fileString => {
  const parsed = fileString
    .split(/\n\so\s/) // file listing starts with: '\n o '
    .slice(1) // first element is empty
    .map(file => {
      const filenameStop = (
        file.match(/☁/) ||
        file.match(/↑/) ||
        file.match(/(Waiting for upload)/)
      )
      return {
        path: file.slice(0, filenameStop.index - 1).trim(),
        status: file.slice(filenameStop.index - 1).trim()
      }
    })
    .map(file => {
      if (/☁/.test(file.status)) {
        return Object.assign(
          {}, file, { status: { state: `synchronized`, raw: file.status } }
        )
      }
      if (/↑/.test(file.status)) {
        return Object.assign(
          {},
          file,
          { status: {
              state: `uploading`,
              bytes: parseBytes(file.status),
              // progress: file.status.split(/\s/).reverse()[0],
              progress: file.status.slice(file.status.lastIndexOf(` `)).trim(),
              raw: file.status
            }
          }
        )
      }
      if (/(Waiting for upload)/.test(file.status)) {
        return Object.assign(
          {},
          file,
          { status: {
              state: `waiting`,
              raw: file.status,
              message: file.status.slice(file.status.indexOf(`\n`) + 1).trim()
            }
          }
        )
      } else {
        return Object.assign(
          {}, file, { status: { state: `unknown`, raw: file.status } }
        )
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
