const isolateSections = str => {

  if (typeof(str) !== `string`) {
    throw new Error(`expected a string`)
  }

  const head = str
    .split(/\n/)
    .filter(s => s.match(/\d{4}-\d{2}-\d{2}.*total:/))[0] ||
    ``

  let files = undefined

  try {
    files = str.slice(str.match(/\so\s/).index)
  } catch (e) {
    files = ``
  }

  return { head, files }

}

module.exports = isolateSections
