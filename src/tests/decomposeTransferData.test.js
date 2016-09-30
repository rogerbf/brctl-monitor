import test from 'tape'
import decomposeTransferData from '../lib/decomposeTransferData.js'

test(`decomposeTransferData is a function`, assert => {
  assert.ok(typeof(decomposeTransferData), `function`)
  assert.end()
})

test(`decomposeTransferData(null)`, assert => {
  assert.deepEqual(decomposeTransferData(null), { up: null, down: null })
  assert.end()
})

test(`decomposeTransferData('↓ 56,0 MB (55963648) 0.0%')`, assert => {
  const data = `↓ 56,0 MB (55963648) 0.0%`
  const expected = {
    up: null,
    down: {
      progress: 0,
      size: 55963648
    }
  }
  const actual = decomposeTransferData(data)
  assert.deepEqual(actual, expected)
  assert.end()
})

test(`decomposeTransferData('↑ 9 byte 95.0%')`, assert => {
  const data = `↑ 9 byte 95.0%`
  const expected = {
    up: {
      progress: 95,
      size: 9
    },
    down: null
  }
  const actual = decomposeTransferData(data)
  assert.deepEqual(actual, expected)
  assert.end()
})

test(`decomposeTransferData(/random/a directory/a picture.png ☁ ↓ 56,0 MB (55963648) 0.0% ↑ 9 byte 95.0%  not downloaded)`, assert => {
  const data = `/random/a directory/a picture.png ☁ ↓ 56,0 MB (55963648) 0.0% ↑ 9 byte 95.0%  not downloaded`
  const expected = {
    up: {
      size: 9,
      progress: 95.0
    },
    down: {
      size: 55963648,
      progress: 0.0
    }
  }
  const actual = decomposeTransferData(data)
  assert.deepEqual(actual, expected)
  assert.end()
})
