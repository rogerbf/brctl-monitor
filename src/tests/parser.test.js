import test from 'tape'
import parser from '../lib/parser.js'

test(`is a Transform stream`, assert => {
  assert.ok(parser.constructor.name === `Transform`)
  assert.end()
})

test(`return expected data`, assert => {
  const data = (
    `observing in /Users/roger/Library/Mobile Documents/com~apple~CloudDocs/temp for the docs|data|external scope(s)\n` +
    `2016-09-28 09:18:40 +0000 total:4\n` +
    ` o /randomdump ☁\n` +
    ` o /test 2 ☁\n` +
    ` o /testfile3 ☁\n` +
    ` o /test1.md ☁\n` +
    `\n` +
    `2016-09-28 09:18:40 +0000 gathering done in 0.003s\n` +
    `\n`
  )

  const expected = {
    timestamp: `2016-09-28 09:18:40 +0000`,
    stats: {
      total: 4
    }
  }

  parser.on(`data`, parsedData => {
    assert.equal(parsedData.timestamp, expected.timestamp)
    assert.deepEqual(parsedData.stats, expected.stats)
    assert.end()
  })

  parser.write(data)
})
