const fs = require('fs/promises')
const path = require('path')
const vscode = require('vscode')
const paths = require('./paths')

const enc = { encoding: 'utf-8' }
const legendaryJs = path.basename(paths.workbench.js)
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

async function enableLegendary() {
  try {
    // generate production theme JS
    const legendaryBrightness = parseBrightness()
    const chromeStyles = await fs.readFile(paths.legendary.css, enc)
    const legendary = (await fs.readFile(paths.legendary.js, enc))
      .replace('[CHROME_STYLES]', chromeStyles)
      .replace('[LEGENDARY_BRIGHTNESS]', legendaryBrightness)
    await fs.writeFile(paths.workbench.legendary, legendary, enc)

    const html = await fs.readFile(paths.workbench.html, enc)
    if (!html.includes(legendaryJs)) {
      const output = html.replace(
        '</html>',
        `\n\t<!-- FORTNITE -->\n\t<script src="${legendaryJs}"></script>\n</html>`
      )
      await fs.writeFile(paths.workbench.html, output, enc)

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

async function disableLegendary() {
  try {
    const html = await fs.readFile(paths.workbench.html, enc)
    if (html.includes(legendaryJs)) {
      let output = html.replace(
        /\s*<!-- FORTNITE -->\s*<script src="${legendaryJs}"><\/script>/gm,
        ''
      )
      await fs.writeFile(paths.workbench.html, output, enc)

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
