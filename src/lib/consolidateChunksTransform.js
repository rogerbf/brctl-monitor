const Transform = require(`stream`).Transform

// instead of creating new buffers with every chunk
const buffers = {
  newline: Buffer(`\n`),
  double_newline: Buffer(`\n\n`)
}

const consolidateChunks = Object.assign(
  new Transform({
    transform(chunk, encoding, callback) {
      // brctl monitor output:

      // observing in /Users/user/Library/Mobile Documents for the docs scope(s)
      // 2016-09-27 12:12:03 +0000 total:7
      // o /file1.md ☁
      // o /file2 ☁
      // o /dir/file 4 ☁
      // o /whammy.app ☁
      //
      // 2016-09-27 12:12:03 +0000 gathering done in 0.017s
      //

      // end of file-list
      const stop = chunk.indexOf(buffers.double_newline)

      // check if chunk contains complete file-list
      if (stop >= 0) {
        // push entire state onto stream
        this.push(Buffer.concat([this.queue, chunk.slice(0, stop)]))
        // reset queue, removing unwanted data
        this.queue = Buffer.alloc(0)
        callback()
      } else {
        // queue chunk
        this.queue = Buffer.concat([this.queue, chunk], this.queue.length + chunk.length)
        callback()
      }
    }
  }),
  { queue: Buffer.alloc(0) }
)

module.exports = consolidateChunks
