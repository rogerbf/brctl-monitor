const Transform = require(`stream`).Transform
const separateSections = require(`./separateSections.js`)
const decomposeHeader = require(`./decomposeHeader.js`)
const separateFiles = require(`./separateFiles.js`)

const parse = new Transform({
  transform(chunk, encoding, callback) {

    const chunkString = chunk.toString()
    // observing in /Users/user/Library/Mobile Documents for the docs scope(s)
    // 2016-09-27 12:59:10 +0000 total:4
    //  o /com~apple~Automator/Documents/Sleep.app ☁
    //  o /com~apple~CloudDocs/userdocs ☁
    //  o /com~apple~Automator/Documents/Shut Down.app ☁
    //  o /iCloud~com~apple~iBooks/Documents/The Good Parts.pdf ☁

    const sections = separateSections(chunkString)
    // {
    //   head: '2016-09-27 12:59:10 +0000 total:4',
    //   files: '\n o /com~apple~Automator/Documents/Sleep.app ☁'...
    // }

    this.push(
      Object.assign(
        {},
        decomposeHeader(sections.head), // { timestamp, stats }
        separateFiles(sections.files) // [ {} ]
      )
    )

    callback()
  },
  objectMode: true
})

module.exports = parse
