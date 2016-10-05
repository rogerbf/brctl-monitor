import test from 'tape'
import spawn from '../lib/spawn.js'

test(`is a function`, assert => {
  assert.ok(typeof(spawn) === `function`)
  assert.end()
})

test(`returns an instance with expected properties`, assert => {
  spawn().then(instance => {
    assert.ok(typeof(instance.pid) === `number`, `should have a pid`)
    assert.ok(instance.hasOwnProperty(`state`), `should have a property: state`)
    instance.kill()
    assert.end()
  })
})
