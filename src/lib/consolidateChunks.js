const Transform = require(`stream`).Transform

const double_newline = Buffer(`\n\n`)

// module.exports = () => {
//   return Object.assign(
//     new Transform({
//       transform(chunk, encoding, next) {
//         const stop = chunk.indexOf(double_newline)
//         if (stop >= 0) {
//           this.push(
//             Buffer.concat([
//               this.queue,
//               chunk.slice(0, stop + 2)
//             ])
//           )
//           this.queue = Buffer.concat([
//             Buffer.alloc(0),
//             chunk.slice(stop + 2)
//           ])
//         } else {
//           this.queue = Buffer.concat([
//             this.queue,
//             chunk
//           ])
//         }
//         next()
//       },
//       flush (next) {
//         this.push(this.queue)
//         next()
//       }
//     }),
//     { queue: Buffer.alloc(0) }
//   )
// }

module.exports = () => {
  return Object.assign(
    new Transform({
      transform(chunk, encoding, next) {
        chunk.toString()
          .split(`\n\n`)
          .map(s => {
            if (s.length > 0) {
              this.push(`${s}\n\n`)
            }
          })
        next()
      }
    })
  )
}
