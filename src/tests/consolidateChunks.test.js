import test from 'tape'
import consolidateChunks from '../lib/consolidateChunks.js'

test(`is a function`, assert => {
  assert.ok(typeof(consolidateChunks) === `function`)
  assert.end()
})

const transform = consolidateChunks()

test(`returns a transform stream`, assert => {
  assert.equal(transform.constructor.name, `Transform`)
  assert.end()
})
