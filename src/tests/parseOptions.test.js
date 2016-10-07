import test from 'tape'
import parseOptions from '../lib/parseOptions.js'
import * as path from 'path'
import * as os from 'os'

const defaultContainer = path.join(
  os.homedir(),
  `Library/Mobile Documents/com~apple~CloudDocs`
)

test(`parseOptions is a function`, assert => {
  assert.ok(typeof(parseOptions), `function`)
  assert.end()
})

test(`expected output`, assert => {
  assert.test(`parseOptions()`, assert => {
    const actual = parseOptions()
    assert.ok(actual.includes(`monitor`))
    assert.ok(actual.includes(`--scope=BOTH`))
    assert.end()
  })

  assert.test(`parseOptions({ scope: 'docs' })`, assert => {
    const actual = parseOptions({ scope: `docs` })
    assert.ok(actual.includes(`monitor`))
    assert.ok(actual.includes(`--scope=DOCS`))
    assert.end()
  })

  assert.test(`parseOptions({ container: 'com~apple~CloudDocs' })`, assert => {
    const actual = parseOptions({ container: `com~apple~CloudDocs` })
    assert.ok(actual.includes(`monitor`))
    assert.ok(actual.includes(`--scope=BOTH`))
    assert.ok(actual.includes(defaultContainer))
    assert.end()
  })
})
