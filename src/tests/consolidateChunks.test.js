import tape from 'tape'
import consolidateChunks from '../lib/consolidateChunks.js'
const test = tape

test(`consolidateChunks`, assert => {

  assert.test(`is a function`, assert => {
    assert.ok(typeof(consolidateChunks) === `function`)
    assert.end()
  })

  const transform = consolidateChunks()

  assert.test(`returns a transform stream`, assert => {
    assert.equal(transform.constructor.name, `Transform`)
    assert.end()
  })

  const expected = Buffer(
    `observing in /Users/user/Library/Mobile Documents/com~apple~CloudDocs/temp for the docs|data|external scope(s)\n` +
    `2016-09-28 08:25:43 +0000 total:0\n` +
    `\n` +
    `2016-09-28 08:25:43 +0000 gathering done in 0.002s\n` +
    `\n` +
    `2016-09-28 08:26:48 +0000 total:1 added:1\n` +
    ` o /test1.md ↑ 9 byte 0.0% \n` +
    `\n`
  )

  const expectedNumberOfChunks = 3

  const expectedChunks = [
    `observing in /Users/user/Library/Mobile Documents/com~apple~CloudDocs/temp for the docs|data|external scope(s)\n` +
    `2016-09-28 08:25:43 +0000 total:0\n` +
    `\n`,
    `2016-09-28 08:25:43 +0000 gathering done in 0.002s\n` +
    `\n`,
    `2016-09-28 08:26:48 +0000 total:1 added:1\n` +
    ` o /test1.md ↑ 9 byte 0.0% \n` +
    `\n`
  ]

  let returnedChunks = Buffer.alloc(0)
  let returnedNumberOfChunks = 0

  transform.on(`finish`, () => {

    assert.test(`input == output`, assert => {
      assert.looseEqual(returnedChunks.toString(), expected.toString())
      assert.end()
    })

    assert.test(`returned number of chunks`, assert => {
      assert.looseEqual(returnedNumberOfChunks, expectedNumberOfChunks)
      assert.end()
    })

    assert.end()
  })

  transform.on(`data`, data => {
    returnedNumberOfChunks++

    assert.test(`expected buffer`, assert => {
      assert.ok(expectedChunks.includes(data.toString()))
      assert.end()
    })

    returnedChunks = Buffer.concat([returnedChunks, data])
  })

  transform.write(expected)
  transform.end()
})
