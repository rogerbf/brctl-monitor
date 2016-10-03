const Transform = require(`stream`).Transform
const isolateSections = require(`./isolateSections.js`)
const decomposeHead = require(`./decomposeHead.js`)
const separateFiles = require(`./separateFiles.js`)
const decomposeFile = require(`./decomposeFile.js`)

module.exports = new Transform({
  transform(chunk, encoding, next) {
    const cstr = chunk.toString()
    const sections = isolateSections(cstr)
    const head = decomposeHead(sections.head)
    const files = separateFiles(sections.files).map(decomposeFile)
    this.push({ ...head, ...files })
    next()
  },
  objectMode: true
})
