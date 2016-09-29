import isolateSections from './isolateSections.js'

export default test => {

  test(`isolateSections`, assert =>  {

    assert.test(`is a function`, assert => {

      assert.ok(typeof(isolateSections) === `function`)
      assert.end()

    })

    assert.test(`throws`, assert => {

      assert.throws(() => { isolateSections() })
      assert.end()

    })

    assert.test(`expected output #1`, assert => {

      const chunk = (
        `observing in /Users/user/Library/Mobile Documents/com~apple~CloudDocs/temp for the docs|data|external scope(s)\n` +
        `2016-09-28 08:25:43 +0000 total:0\n` +
        `\n`
      )

      const expected = {
        head: `2016-09-28 08:25:43 +0000 total:0`,
        files: ``
      }

      const actual = isolateSections(chunk)

      assert.deepEqual(actual, expected)
      assert.end()

    })

    assert.test(`expected output #2`, assert => {

      const chunk = (
        `2016-09-28 08:25:43 +0000 gathering done in 0.002s\n` +
        `\n`
      )

      const expected = {
        head: ``,
        files: ``
      }

      const actual = isolateSections(chunk)

      assert.deepEqual(actual, expected)
      assert.end()

    })

    assert.test(`expected output #3`, assert => {

      const chunk = (
        `2016-09-28 08:26:48 +0000 total:1 added:1\n` +
        ` o /test1.md ↑ 9 byte 0.0% \n` +
        `\n`
      )

      const expected = {
        head: `2016-09-28 08:26:48 +0000 total:1 added:1`,
        files: ` o /test1.md ↑ 9 byte 0.0% \n\n`
      }

      const actual = isolateSections(chunk)

      assert.deepEqual(actual, expected)
      assert.end()

    })

    assert.test(`expected output #4`, assert => {

      const chunk = (
        `2016-09-28 08:27:33 +0000 total:2 added:1\n` +
        ` o /test1.md ☁\n` +
        ` o /test 2 (Waiting for upload)\n` +
        `		 upload error: offline\n` +
        `\n`
      )

      const expected = {
        head: `2016-09-28 08:27:33 +0000 total:2 added:1`,
        files: ` o /test1.md ☁\n o /test 2 (Waiting for upload)\n		 upload error: offline\n\n`
      }

      const actual = isolateSections(chunk)

      assert.deepEqual(actual, expected)
      assert.end()

    })

  })
}
