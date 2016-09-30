import test from 'tape'
import decomposeTransferData from '../lib/decomposeTransferData.js'

test(`decomposeTransferData is a function`, assert => {
  assert.ok(typeof(decomposeTransferData), `function`)
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
