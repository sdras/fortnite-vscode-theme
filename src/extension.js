const path = require('path')
const fs = require('fs')
const vscode = require('vscode')

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  const config = vscode.workspace.getConfiguration('fortnite')
  let disableGlow = config && config.disableGlow ? !!config.disableGlow : false

  let brightness =
    parseFloat(config.brightness) > 1 ? 1 : parseFloat(config.brightness)
  brightness = brightness < 0 ? 0 : brightness
  brightness = isNaN(brightness) ? 0.45 : brightness

  const legendaryBrightness = Math.floor(brightness * 255)
    .toString(16)
    .toUpperCase()

  let disposable = vscode.commands.registerCommand(
    'fortnite.enableLegendary',
    function () {
      const isWin = /^win/.test(process.platform)
      const appDir = path.dirname(require.main.filename)
      const base = appDir + (isWin ? '\\vs\\code' : '/vs/code')

      const htmlFile =
        base +
        (isWin
          ? '\\electron-browser\\workbench\\workbench.html'
          : '/electron-browser/workbench/workbench.html')

      const templateFile =
        base +
        (isWin
          ? '\\electron-browser\\workbench\\legendary.js'
          : '/electron-browser/workbench/legendary.js')

      try {
        // generate production theme JS
        const chromeStyles = fs.readFileSync(
          __dirname + '/css/fortnite.css',
          'utf-8'
        )
        const jsTemplate = fs.readFileSync(
          __dirname + '/js/fortnite-template.js',
          'utf-8'
        )
        const themeWithChrome = jsTemplate.replace(
          /\[CHROME_STYLES\]/g,
          chromeStyles
        )
        const finalTheme = themeWithChrome.replace(
          /\[LEGENDARY_BRIGHTNESS\]/g,
          legendaryBrightness
        )
        fs.writeFileSync(templateFile, finalTheme, 'utf-8')

        // modify workbench html
        const html = fs.readFileSync(htmlFile, 'utf-8')

        // check if the tag is already there
        const isEnabled = html.includes('legendary.js')

        if (!isEnabled) {
          // delete fortnite script tag if there
          let output = html.replace(
            /^.*(<!-- FORTNITE --><script src="legendary.js"><\/script><!-- FORTNITE -->).*\n?/gm,
            ''
          )
          // add script tag
          output = html.replace(
            /\<\/html\>/g,
            `<!-- FORTNITE --><script src="legendary.js"></script><!-- FORTNITE -->\n`
          )
          output += '</html>'

          fs.writeFileSync(htmlFile, output, 'utf-8')

          vscode.window
            .showInformationMessage(
              "Legendary enabled. VS code must reload for this change to take effect. Code may display a warning that it is corrupted, this is normal. You can dismiss this message by choosing 'Don't show this again' on the notification.",
              { title: 'Restart editor to complete' }
            )
            .then(function (msg) {
              vscode.commands.executeCommand('workbench.action.reloadWindow')
            })
        } else {
          vscode.window
            .showInformationMessage(
              'Legendary is already enabled. Reload to refresh JS settings.',
              { title: 'Restart editor to refresh settings' }
            )
            .then(function (msg) {
              vscode.commands.executeCommand('workbench.action.reloadWindow')
            })
        }
      } catch (e) {
        if (/ENOENT|EACCES|EPERM/.test(e.code)) {
          vscode.window.showInformationMessage(
            'You must run VS code with admin privileges in order to enable Legendary.'
          )
          return
        } else {
          vscode.window.showErrorMessage(
            'Something went wrong when starting legendary. See README for more information.'
          )
          return
        }
      }
    }
  )

  let disable = vscode.commands.registerCommand(
    'fortnite.disableLegendary',
    uninstall
  )

  context.subscriptions.push(disposable)
  context.subscriptions.push(disable)
}
exports.activate = activate

// this method is called when your extension is deactivated
function deactivate() {
  // ...
}

function uninstall() {
  var isWin = /^win/.test(process.platform)
  var appDir = path.dirname(require.main.filename)
  var base = appDir + (isWin ? '\\vs\\code' : '/vs/code')
  var htmlFile =
    base +
    (isWin
      ? '\\electron-browser\\workbench\\workbench.html'
      : '/electron-browser/workbench/workbench.html')

  // modify workbench html
  const html = fs.readFileSync(htmlFile, 'utf-8')

  // check if the tag is already there
  const isEnabled = html.includes('legendary.js')

  if (isEnabled) {
    // delete synthwave script tag if there
    let output = html.replace(
      /^.*(<!-- FORTNITE --><script src="legendary.js"><\/script><!-- FORTNITE -->).*\n?/gm,
      ''
    )
    fs.writeFileSync(htmlFile, output, 'utf-8')

    vscode.window
      .showInformationMessage(
        'Legendary disabled. VS code must reload for this change to take effect',
        { title: 'Restart editor to complete' }
      )
      .then(function (msg) {
        vscode.commands.executeCommand('workbench.action.reloadWindow')
      })
  } else {
    vscode.window.showInformationMessage("Legendary isn't running.")
  }
}

module.exports = {
  activate,
  deactivate,
}
