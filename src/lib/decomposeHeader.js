const objectFromString = require(`object-from-string`)(`:`)

const parseHead = str => {
  // str: '2016-09-27 12:59:10 +0000 total:4 added:1'

  // match '+0000', get index after
  const dataDivider = str.match(/\+\d{4}/).index + 5

  const timestamp = str.slice(0, dataDivider)
  // '2016-09-27 12:59:10 +0000'

  // separate stats
  const stats = str
    .slice(dataDivider)
    .trim()
    .split(/\s/)
    .reduce((acc, count) => {
      return Object.assign(acc, objectFromString(count))
    }, {})
  // { total: 4, added: 1 }

  return { timestamp, stats }
}

module.exports = parseHead
