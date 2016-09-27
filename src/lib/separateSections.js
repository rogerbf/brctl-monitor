const separateSections = str => {
  // str:
  // observing in /Users/user/Library/Mobile Documents for the docs scope(s)
  // 2016-09-27 12:59:10 +0000 total:4
  //  o /com~apple~Automator/Documents/Sleep.app ☁
  //  o /com~apple~CloudDocs/userdocs ☁

  // start of date '###-##-##'
  const date = str.match(/\d{4}-\d{2}-\d{2}/).index

  // start of file list '\n o '
  const files = str.match(/\n\so\s/).index

  return {
    head: str.slice(date, files),
    files: str.slice(files)
  }
}

module.exports = separateSections
