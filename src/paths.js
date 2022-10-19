const path = require('path')
const vscode = require('vscode')

const workbench = {
  dir: makePath(
    path.dirname(require.main.filename),
    'vs',
    'code',
    isVSCodeBelowVersion('1.70.0') ? 'electron-browser' : 'electron-sandbox',
    'workbench'
  ),
  get html() {
    return makePath(this.dir, 'workbench.html')
  },
  get legendary() {
    return makePath(this.dir, 'legendary.js')
  },
}
const legendary = {
  dir: makePath(__dirname, 'legendary'),
  get css() {
    return makePath(this.dir, 'index.css')
  },
  get js() {
    return makePath(this.dir, 'template.js')
  },
}

/*
 * 10/2022
 * https://github.com/robb0wen/synthwave-vscode/blob/master/src/extension.js#L141
 */
function isVSCodeBelowVersion(version) {
  const vscodeVersion = vscode.version
  const vscodeVersionArray = vscodeVersion.split('.')
  const versionArray = version.split('.')
  for (let i = 0; i < versionArray.length; i++) {
    if (vscodeVersionArray[i] < versionArray[i]) {
      return true
    }
  }
  return false
}

function makePath(...args) {
  return args.join(path.sep)
}

module.exports = {
  workbench,
  legendary,
}
