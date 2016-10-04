import test from 'tape'
import consolidateChunks from '../lib/consolidateChunks.js'

const createInstance = () => {
  return consolidateChunks()
}

test(`is a transform stream`, assert => {
  const instance = createInstance()
  assert.equal(instance.constructor.name, `Transform`)
  assert.end()
})

test(`expected output #1`, assert => {
  const data = (
    `observing in /Users/roger/Library/Mobile Documents/com~apple~CloudDocs/temp for the docs|data|external scope(s)\n` +
    `2016-09-28 08:25:43 +0000 total:0\n` +
    `\n` +
    `2016-09-28 08:25:43 +0000 gathering done in 0.002s\n` +
    `\n`
  )

  const expected = `2016-09-28 08:25:43 +0000 total:0\n`

  const instance = createInstance()

  instance.on(`data`, data => {
    const actual = data.toString()
    assert.equal(actual, expected)
    assert.end()
  })

  instance.write(data)
})

test(`expected output #2`, assert => {
  const data = {
    a: `observing in /Users/roger/Library/Mobile Documents/com~apple~CloudDocs/temp for the docs|data|external scope(s)\n` +
      `2016-09-28 08:25:43 +0000 total:0\n`,
    b: `\n`,
    c: `2016-09-28 08:25:43 +0000 gathering done in 0.002s\n` +
      `\n`
  }

  const expected = `2016-09-28 08:25:43 +0000 total:0\n`

  let actual = ``

  const instance = createInstance()

  instance.on(`data`, data => {
    actual = actual.concat(data.toString())
  })

  instance.once(`finish`, () => {
    assert.equal(actual, expected)
    assert.end()
  })

  instance.write(data.a)
  instance.write(data.b)
  instance.write(data.c)
  instance.end()
})
