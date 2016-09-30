import tape from 'tape'
import separateFiles from '../lib/separateFiles.js'
const test = tape

test(`separateFiles`, assert => {

  assert.test(`is a function`, assert => {
    assert.ok(typeof(separateFiles), `function`)
    assert.end()
  })

  assert.test(`expected output #1`, assert =>  {
    const data = ``
    const expected = []
    const actual = separateFiles(``)
    assert.deepEqual(actual, expected)
    assert.end()
  })

  assert.test(`expected output #2`, assert => {
    const data = ` o /test1.md ↑ 9 byte 0.0% \n\n`
    const expected = [`/test1.md ↑ 9 byte 0.0%`]
    const actual = separateFiles(data)
    assert.deepEqual(actual, expected)
    assert.end()
  })

  assert.test(`expected output #3`, assert => {
    const data = ` o /test1.md ☁\n o /test 2 ☁\n\n`
    const expected = [`/test1.md ☁`, `/test 2 ☁`]
    const actual = separateFiles(data)
    assert.deepEqual(actual, expected)
    assert.end()
  })

  assert.test(`expected output #4`, asssert => {
    const data = ` o /test1.md ☁\n o /test 2 (Waiting for upload)\n		 upload error: offline\n\n`
    const expected = [`/test1.md ☁`, `/test 2 (Waiting for upload)\n		 upload error: offline`]
    const actual = separateFiles(data)
    assert.deepEqual(actual, expected)
    assert.end()
  })

  assert.test(`throws`, assert => {
    assert.throws(() => separateFiles(Array()))
    assert.throws(() => separateFiles(Number()))
    assert.throws(() => separateFiles(Object()))
    assert.end()
  })

})
