import test from 'tape'
import parser from '../lib/parser.js'

test(`is a Transform stream`, assert => {
  assert.ok(parser.constructor.name === `Transform`)
  assert.end()
})
