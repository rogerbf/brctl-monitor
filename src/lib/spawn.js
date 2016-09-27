const spawn = require(`child_process`).spawn
const os = require(`os`)
const path = require(`path`)
const consolidateChunks = require(`./consolidateChunks.js`)
const parse = require(`./parse.js`)

const defaultOptions = {
  scope: `both`,
  directory: null
}

const spawnInstance = userOptions => {
  const options = Object.assign({}, defaultOptions, userOptions)
  const baseDirectory = path.join(os.homedir(), `Library/Mobile Documents/`)

  const directory = options.directory
    ? path.join(baseDirectory, `/com~apple~CloudDocs`, options.directory)
    : null

  const args = directory
    ? [`monitor`, `--scope=${options.scope.toUpperCase()}`, directory]
    : [`monitor`, `--scope=${options.scope.toUpperCase()}`]

  return new Promise((resolve, reject) => {
    const instance = spawn(`brctl`, args)

    process.on(`exit`, () => instance.kill())
    process.on(`uncaughtException`, err => {
      instance.kill()
      throw err
    })

    instance.on(`error`, err => reject(err))

    instance.stdout.once(`readable`, () => {
      instance.stdout.pipe(consolidateChunks).pipe(parse)
      resolve(Object.assign(instance, { state: parse }))
    })
  })
}

module.exports = spawnInstance

// spawnInstance({ directory: `test` })
spawnInstance({ scope: `docs` })
  .then(brctl => {
    brctl.state.on(`data`, data => console.log(JSON.stringify(data, null, 2)))
  })
  .catch(e => console.log(e.toString()))
