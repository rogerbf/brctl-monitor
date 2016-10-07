const os = require(`os`)
const path = require(`path`)

module.exports = options => {
  const opts = { scope: `both`, ...options }

  let args = [`monitor`, `--scope=${opts.scope.toUpperCase()}`]

  if (opts.container) {
    args = args.concat(
      `${path.join(os.homedir(), `Library/Mobile Documents/`, opts.container)}`
    )
  }

  return args
}
