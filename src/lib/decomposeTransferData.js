const extractTransferData = (str, type) => {

  let start = undefined

  switch (type) {
    case `upload`:
      start = str.indexOf(`↑`)
      break;
    case `download`:
      start = str.indexOf(`↓`)
      break;
  }

  if (start >= 0) {
    const stop = str.indexOf(`%`, start)
    const data = str.slice(start, stop + 1)
    return data
  } else {
    return null
  }

}

const deconstructTransferData = str => {

  if (!str) return null

  const progress = parseFloat(
    str.slice(
      // a white space character followed by any number of digit characters
      // immediately followed by a decimal dot
      // followed by any number of digit characters
      // immediately followed by a '%'-character
      str.match(/\s\d*[?=\.]\d*[?=%]/).index,
      str.indexOf(`%`)).trim()
    )

  const size = parseInt(
    // contains a '(' followed by any number och digit characters
    // followed by a ')'
    str.match(/[(]\d*[)]/)
    ? str.slice(str.indexOf(`(`) + 1, str.indexOf(`)`))
    // starts and ends with a digit character with any amount between
    : str.split(/\s/).filter(s => s.match(/^\d*\d$/))[0]
  )

  return {
    progress,
    size
  }

}

module.exports = str => {
  return {
    up: deconstructTransferData(extractTransferData(str, `upload`)),
    down: deconstructTransferData(extractTransferData(str, `download`))
  }
}
