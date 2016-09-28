const test = require(`tape`)
const consolidateChunks = require(`./lib/consolidateChunks.js`)
const separateSections = require(`./lib/separateSections.js`)
const splitFilesString = require(`./lib/splitFilesString.js`)

test(`consolidateChunks`, assert => {

  assert.test(`is a function`, assert => {
    assert.equal(typeof(consolidateChunks), `function`)
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

  const expectedChunks = {
    '1': Buffer(
      `observing in /Users/user/Library/Mobile Documents/com~apple~CloudDocs/temp for the docs|data|external scope(s)\n` +
      `2016-09-28 08:25:43 +0000 total:0\n` +
      `\n`
    ),
    '2': Buffer(
      `2016-09-28 08:25:43 +0000 gathering done in 0.002s\n` +
      `\n`
    ),
    '3': Buffer(
      `2016-09-28 08:26:48 +0000 total:1 added:1\n` +
      ` o /test1.md ↑ 9 byte 0.0% \n` +
      `\n`
    )
  }

  let returnedChunks = Buffer.alloc(0)
  let returnedNumberOfChunks = 0

  transform.on(`finish`, () => {

    assert.test(`input == complete output`, assert => {
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

    assert.comment(`returnedNumberOfChunks: ${returnedNumberOfChunks}`)
    assert.comment(`data: ${data.toString()}`)

    // assert.test(`expected buffer`, assert => {
    //   assert.looseEqual(
    //     data.toString(),
    //     expectedChunks[returnedNumberOfChunks.toString()].toString()
    //   )
    //   assert.end()
    // })
    returnedChunks = Buffer.concat([ returnedChunks, data ])
  })

  transform.write(expected)
  transform.end()
})

// test(`separateSections`, assert => {
//
//   const testdata_1 = (
//     `observing in /Users/user/Library/Mobile Documents/com~apple~CloudDocs/temp for the docs|data|external scope(s)\n` +
//     `2016-09-28 08:25:43 +0000 total:0\n` +
//     `\n` +
//     `2016-09-28 08:25:43 +0000 gathering done in 0.002s\n` +
//     `\n`
//   )
//
//   const testdata_2 = (
//     `observing in /Users/roger/Library/Mobile Documents/com~apple~CloudDocs/temp for the docs|data|external scope(s)\n` +
//     `2016-09-28 09:17:28 +0000 total:3\n` +
//     ` o /test 2 ☁\n` +
//     ` o /randomdump ☁\n` +
//     ` o /test1.md ☁\n` +
//     `\n` +
//     `2016-09-28 09:17:28 +0000 gathering done in 0.003s\n` +
//     `\n`
//   )
//
//   assert.end()
// })

// test(`splitFilesString`, assert => {
//   assert.equal(typeof(splitFilesString), `function`)
//   const data = (
//   `\n o /com~apple~Automator/Documents/Sleep.app ☁\n` +
//   `\n o /com~apple~CloudDocs/userdocs ☁\n` +
//   `\n o /com~apple~Automator/Documents/Shut Down.app ☁\n` +
//   `\n o /iCloud~com~apple~iBooks/Documents/The Good Parts.pdf ☁\n`
//   )
//   const expected = [
//     `/com~apple~Automator/Documents/Sleep.app ☁`,
//     `/com~apple~CloudDocs/userdocs ☁`,
//     `/com~apple~Automator/Documents/Shut Down.app ☁`,
//     `/iCloud~com~apple~iBooks/Documents/The Good Parts.pdf ☁`
//   ]
//   assert.looseEqual(splitFilesString(data), expected)
//   assert.end()
// })
