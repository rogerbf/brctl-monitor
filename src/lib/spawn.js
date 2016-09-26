const spawn = require(`child_process`).spawn
const os = require(`os`)
const path = require(`path`)
const split = require(`./split.js`)
const parseState = require(`./parseState.js`)

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
    process.on(`uncaughtException`, () => instance.kill())

    instance.on(`error`, err => reject(err))

    instance.stdout.once(`readable`, () => {
      instance.stdout.pipe(split).pipe(parseState)
      resolve(Object.assign(instance, { state: parseState }))
    })
  })
}

module.exports = spawnInstance

spawnInstance({ directory: `test` })
  .then(brctl => {
    brctl.state.on(`data`, data => console.log(data))
  })
  .catch(e => console.log(e.toString()))
