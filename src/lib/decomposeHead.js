const objectFromString = require(`object-from-string`)(`:`)

const decomposeHead = str => {
  // str: '2016-09-27 12:59:10 +0000 total:4 added:1'

  if (!/total:/.test(str)) throw new Error(`string should contain total`)

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
      const kvd = count.indexOf(`:`)
      const key = count.slice(0, count.indexOf(`:`))
      const value = parseInt(count.slice(count.indexOf(`:`) + 1))
      return Object.assign(acc, { [ key ] : value })
    }, {})
  // { total: 4, added: 1 }

  return { timestamp, stats }

}

module.exports = decomposeHead
