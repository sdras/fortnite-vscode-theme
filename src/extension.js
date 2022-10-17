const fs = require('fs')
const path = require('path')
const vscode = require('vscode')
const paths = require('./paths')

const reloadCode = () =>
  vscode.commands.executeCommand('workbench.action.reloadWindow')
const handleError = err => {
  if (err.code in ['ENOENT', 'EACCES', 'EPERM']) {
    vscode.window.showInformationMessage(
      'You must run VS Code with admin privileges in order to enable Legendary!'
    )
  } else {
    vscode.window.showErrorMessage(`Error: ${err.message}`)
  }
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand('fortnite.enableLegendary', enableLegendary),
    vscode.commands.registerCommand('fortnite.disableLegendary', disableLegendary)
  )
}

function enableLegendary() {
  try {
    // generate production theme JS
    const legendaryBrightness = parseBrightness()
    const chromeStyles = fs.readFileSync(paths.legendary.css, 'utf-8')
    const legendary = fs.readFileSync(paths.legendary.js, 'utf-8')
      .replace('[CHROME_STYLES]', chromeStyles)
      .replace('[LEGENDARY_BRIGHTNESS]', legendaryBrightness)
    fs.writeFileSync(paths.workbench.legendary, legendary, 'utf-8')

    const html = fs.readFileSync(paths.workbench.html, 'utf-8')
    if (!html.includes('legendary.js')) {
      const output = html.replace(
        '</html>',
        `\t<!-- FORTNITE --><script src="legendary.js"></script><!-- FORTNITE -->\n</html>`
      )
      fs.writeFileSync(paths.workbench.html, output, 'utf-8')

      vscode.window
        .showInformationMessage(
          "Legendary enabled. VS Code must be reloaded for this change to take effect. " +
            "Code may display a warning that it is corrupted. This is normal! " +
            "You can dismiss the warning by choosing 'Don't show this again' on the notification.",
          { title: 'Restart Editor to Complete' }
        )
        .then(reloadCode)
    } else {
      vscode.window
        .showInformationMessage(
          'Legendary is already enabled. Reload to refresh the JS settings.',
          { title: 'Restart Editor to Refresh Settings' }
        )
        .then(reloadCode)
    }
  } catch (e) {
    handleError(e)
  }
}

function disableLegendary() {
  try {
    const html = fs.readFileSync(paths.workbench.html, 'utf-8')
    if (html.includes('legendary.js')) {
      let output = html.replace(
        /\t<!-- FORTNITE --><script src="legendary.js"><\/script><!-- FORTNITE -->\n/gm,
        ''
      )
      fs.writeFileSync(paths.workbench.html, output, 'utf-8')

      vscode.window
        .showInformationMessage(
          'Legendary disabled. VS Code must be reloaded for this change to take effect.',
          { title: 'Restart Editor to Complete' }
        )
        .then(reloadCode)
    } else {
      vscode.window.showInformationMessage("Legendary isn't running.")
    }
  } catch (e) {
    handleError(e)
  }
}

function parseBrightness() {
  const config = vscode.workspace.getConfiguration('fortnite')
  let brightness = parseFloat(config.get('brightness'))
  if (isNaN(brightness)) brightness = 0.45
  else if (brightness > 1) brightness = 1
  else if (brightness < 0) brightness = 0
  return Math.floor(brightness * 255)
    .toString(16)
    .toUpperCase()
}

module.exports = {
  activate,
}
