import tape from 'tape'
import decomposeFile from '../lib/decomposeFile.js'
const test = tape

/*
/test 2 (Waiting for upload)\n		 upload error: offline
/test1.md ↑ 9 byte 95.0%
/test1.md ☁
/randomdump ☁ ↓ 56,0 MB (55963648) 0.0%  not downloaded
/randomdump ☁ ↓ 56,0 MB (55963648) 0.0%  not downloaded ↑ 9 byte 95.0%
*/


test(`decomposeFile`, assert => {

  assert.test(`is a function`, assert => {
    assert.ok(typeof(decomposeFile) === `function`)
    assert.end()
  })

  assert.test(`expected filename #1`, assert => {
    const data = `/randomdump ☁ ↓ 56,0 MB (55963648) 0.0%  not downloaded ↑ 9 byte 95.0%`
    const expected = `/randomdump`
    const actual = decomposeFile(data).filename

    assert.equal(actual, expected)
    assert.end()
  })

  assert.test(`expected filename #2`, assert => {
    const data = `/random/a directory/a picture.png ☁ ↓ 56,0 MB (55963648) 0.0%  not downloaded ↑ 9 byte 95.0%`
    const expected = `/random/a directory/a picture.png`
    const actual = decomposeFile(data).filename

    assert.equal(actual, expected)
    assert.end()
  })

})
