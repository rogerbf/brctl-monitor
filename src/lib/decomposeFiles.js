module.exports = str => {
  return str
    .split(/\so\s/)
    .slice(1)
    .map(s => s.trim())
}
