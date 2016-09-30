import tape from 'tape'
import decomposeHead from '../lib/decomposeHead.js'
const test = tape

test(`decomposeHead`, assert =>  {

  assert.test(`is a function`, assert => {

    assert.ok(typeof(decomposeHead) === `function`)
    assert.end()

  })

  assert.test(`expected output #1`, assert => {

    const data = `2016-09-28 08:25:43 +0000 total:0`

    const expected = {
      timestamp: `2016-09-28 08:25:43 +0000`,
      stats: {
        total: 0
      }
    }

    const actual = decomposeHead(data)

    assert.deepEqual(actual, expected)
    assert.end()

  })

  assert.test(`expected output #2`, assert => {

    const data = `2016-09-28 08:26:48 +0000 total:1 added:1`

    const expected = {
      timestamp: `2016-09-28 08:26:48 +0000`,
      stats: {
        total: 1,
        added: 1
      }
    }

    const actual = decomposeHead(data)

    assert.deepEqual(actual, expected)
    assert.end()

  })

  assert.test(`expected output #3`, assert => {

    const data = `2016-09-28 08:26:49 +0000 total:1 updated:1`

    const expected = {
      timestamp: `2016-09-28 08:26:49 +0000`,
      stats: {
        total: 1,
        updated: 1
      }
    }

    const actual = decomposeHead(data)

    assert.deepEqual(actual, expected)
    assert.end()

  })

  assert.test(`expected output #4`, assert => {

    const data = `2016-09-28 08:33:09 +0000 total:3 updated:1`

    const expected = {
      timestamp: `2016-09-28 08:33:09 +0000`,
      stats: {
        total: 3,
        updated: 1
      }
    }

    const actual = decomposeHead(data)

    assert.deepEqual(actual, expected)
    assert.end()

  })

  assert.test(`throws`, assert => {
    assert.throws(() => decomposeHead(Array()))
    assert.throws(() => decomposeHead(Number()))
    assert.throws(() => decomposeHead(Object()))
    assert.throws(() => decomposeHead(``))
    assert.throws(() => decomposeHead(`2016-09-28 08:33:09 +0000`))
    assert.end()
  })

})
