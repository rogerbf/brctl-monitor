import decomposeFiles from './decomposeFiles.js'

export default test => {
  test(`decomposeFiles`, assert => {

    assert.test(`is a function`, assert => {
      assert.ok(typeof(decomposeFiles), `function`)
      assert.end()
    })

    assert.test(`expected output #1`, assert => {
      const data = ``
      const expected = []
      const actual = decomposeFiles(``)
      assert.deepEqual(actual, expected)
      assert.end()
    })

    assert.test(`expected output #2`, assert => {
      const data = ` o /test1.md ↑ 9 byte 0.0% \n\n`
      const expected = [`/test1.md ↑ 9 byte 0.0%`]
      const actual = decomposeFiles(data)
      assert.deepEqual(actual, expected)
      assert.end()
    })

    assert.test(`expected output #3`, assert => {
      const data = ` o /test1.md ☁\n o /test 2 ☁\n\n`
      const expected = [`/test1.md ☁`, `/test 2 ☁`]
      const actual = decomposeFiles(data)
      assert.deepEqual(actual, expected)
      assert.end()
    })

    assert.test(`expected output #4`, asssert => {
      const data = ` o /test1.md ☁\n o /test 2 (Waiting for upload)\n		 upload error: offline\n\n`
      const expected = [`/test1.md ☁`, `/test 2 (Waiting for upload)\n		 upload error: offline`]
      const actual = decomposeFiles(data)
      assert.deepEqual(actual, expected)
      assert.end()
    })

    assert.test(`throws`, assert => {
      assert.throws(() => decomposeFiles(Array()))
      assert.throws(() => decomposeFiles(Number()))
      assert.throws(() => decomposeFiles(Object()))
      assert.end()
    })

  })
}
