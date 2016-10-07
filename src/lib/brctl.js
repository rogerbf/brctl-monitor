const spawn = require(`child_process`).spawn
const parseOptions = require(`./parseOptions.js`)
const consolidator = require(`./consolidateChunks.js`)()
const parser = require(`./parser.js`)()

const brctl = options => {

  return new Promise((resolve, reject) => {

    const instance = spawn(`brctl`, parseOptions(options))

    instance.on(`error`, err => reject(err))

    process.on(`exit`, () => instance.kill())
    process.on(`uncaughtException`, err => {
      instance.kill()
      throw err
    })

    instance.stdout.once(`readable`, () => {

      instance.stdout
        .pipe(consolidator)
        .pipe(parser)

      resolve(Object.assign(instance, { state: parser }))

    })
  })
}

brctl.ICLOUD_DRIVE = `/com~apple~CloudDocs`

module.exports = brctl
