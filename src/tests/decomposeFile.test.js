import test from 'tape'
import decomposeFile from '../lib/decomposeFile.js'

/*
/test 2 (Waiting for upload)\n		 upload error: offline
/test1.md ↑ 9 byte 95.0%
/test1.md ☁
/randomdump ☁ ↓ 56,0 MB (55963648) 0.0%  not downloaded
*/


test(`decomposeFile`, assert => {

  assert.test(`is a function`, assert => {
    assert.ok(typeof(decomposeFile) === `function`)
    assert.end()
  })

  assert.test(`expected filename #1`, assert => {
    const data = `/randomdump ☁ ↓ 56,0 MB (55963648) 0.0%  not downloaded`
    const expected = `/randomdump`
    const actual = decomposeFile(data).filename

    assert.equal(actual, expected)
    assert.end()
  })

  assert.test(`expected filename #2`, assert => {
    const data = `/random/a directory/a picture.png ☁ ↓ 56,0 MB (55963648) 0.0%  not downloaded`
    const expected = `/random/a directory/a picture.png`
    const actual = decomposeFile(data).filename

    assert.equal(actual, expected)
    assert.end()
  })

  assert.test(`raw`, assert => {
    const data = `/test1.md ↑ 9 byte 95.0%`
    const expected = ` ↑ 9 byte 95.0%`
    const actual = decomposeFile(data).status.raw

    assert.equal(actual, expected)
    assert.end()
  })

  assert.test(`availability`, assert => {
    const data = `/random/a directory/a picture.png ☁ ↓ 56,0 MB (55963648) 0.0%  not downloaded`
    const expected = { local: false, remote: true }
    const actual = decomposeFile(data).status.availability

    assert.deepEqual(actual, expected)
    assert.end()
  })

  assert.test(`upload data, no upload`, assert => {
    const data = `/random/a directory/a picture.png ☁ ↓ 56,0 MB (55963648) 0.0%  not downloaded`
    const expected = null
    const actual = decomposeFile(data).status.transfers.up

    assert.equal(actual, expected)
    assert.end()
  })

  assert.test(`upload data, uploading`, assert => {
    const data = `/test1.md ↑ 9 byte 95.0%`
    const expected = { progress: 95, size: 9 }
    const actual = decomposeFile(data).status.transfers.up

    assert.deepEqual(actual, expected)
    assert.end()
  })

  assert.test(`download data, no download`, assert => {
    const data = `/test1.md ↑ 9 byte 95.0%`
    const expected = null
    const actual = decomposeFile(data).status.transfers.down

    assert.equal(actual, expected)
    assert.end()
  })

  assert.test(`download data, downloading`, assert => {
    const data = `/random/a directory/a picture.png ☁ ↓ 56,0 MB (55963648) 0.0%  not downloaded`
    const expected = { progress: 0, size: 55963648 }
    const actual = decomposeFile(data).status.transfers.down

    assert.deepEqual(actual, expected)
    assert.end()
  })

  assert.test(`uploading & downloading`, assert => {
    const data = `/random/a directory/a picture.png ☁ ↓ 56,0 MB (55963648) 0.0% ↑ 9 byte 95.0%  not downloaded`
    const expected = {
      up: { progress: 95, size: 9 },
      down: { progress: 0, size: 55963648 }
    }
    const actual = decomposeFile(data).status.transfers

    assert.deepEqual(actual, expected)
    assert.end()
  })

  assert.test(`waiting true`, assert => {
    const data = `/test 2 (Waiting for upload)		 upload error: offline`
    const expected = true
    const actual = decomposeFile(data).status.waiting

    assert.equal(actual, expected)
    assert.end()
  })

  assert.test(`waiting false`, assert => {
    const data = `/test1.md ↑ 9 byte 95.0%`
    const expected = false
    const actual = decomposeFile(data).status.waiting

    assert.equal(actual, expected)
    assert.end()
  })

  assert.test(`error true`, assert => {
    const data = `/test 2 (Waiting for upload)		 upload error: offline`
    const expected = true
    const actual = decomposeFile(data).status.error

    assert.equal(actual, expected)
    assert.end()
  })

  assert.test(`error false`, assert => {
    const data = `/test1.md ↑ 9 byte 95.0%`
    const expected = false
    const actual = decomposeFile(data).status.error

    assert.equal(actual, expected)
    assert.end()
  })

})
