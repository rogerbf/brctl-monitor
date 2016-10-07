import test from 'tape'
import brctl from '../lib/brctl.js'

test(`is a function`, assert => {
  assert.ok(typeof(brctl) === `function`)
  assert.end()
})

test(`returns an instance with expected properties`, assert => {
  brctl().then(instance => {
    assert.ok(typeof(instance.pid) === `number`, `should have a pid`)
    assert.ok(instance.hasOwnProperty(`state`), `should have a property: state`)
    instance.kill()
    assert.end()
  })
})
