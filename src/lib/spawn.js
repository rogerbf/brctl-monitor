const spawn = require(`child_process`).spawn
const stream = require(`stream`)
const os = require(`os`)
const path = require(`path`)
const split = require(`./split.js`)

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
    instance.on(`error`, err => reject(err))
    instance.stdout.once(`readable`, () => resolve(instance))
  })
}

module.exports = spawnInstance

// spawnInstance({ directory: `test` })
//   .then(instance => instance.stdout.on(`data`, data => console.log(data.toString())))
//   .catch(e => console.log(e.toString()))

spawnInstance({ directory: `test` })
  .then(instance => instance.stdout.pipe(split).pipe(process.stdout))
  .catch(e => console.log(e.toString()))
