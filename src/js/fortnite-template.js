;(function () {
  // Grab body node
  const bodyNode = document.querySelector('body')
  bodyNode.setAttribute('id', 'fortnite-test')

  // Replace the styles with the glow theme
  const initLegendary = (obs) => {
    let themeStyleTag = document.querySelector('.vscode-tokens-styles')
    if (!themeStyleTag) return
    let updatedThemeStyles = themeStyleTag.innerText

    /* replace magenta */
    updatedThemeStyles = updatedThemeStyles.replace(
      /color: #ea5a9c;/g,
      'color: #ef5ea0; text-shadow: 0 0 2px #000000, 0 0 8px #bf226a, 0 0 2px #ef5ea0;'
    )

    /* replace yellow */
    updatedThemeStyles = updatedThemeStyles.replace(
      /color: #f9dea6;/g,
      'color: #efe5d3; text-shadow: 0 0 2px #0e0119, 0 0 8px #ef7b05cc, 0 0 2px #f3a007cc;'
    )

    /* replace teal */
    updatedThemeStyles = updatedThemeStyles.replace(
      /color: #8cefd8;/g,
      'color: #9eecda; text-shadow: 0 0 1px #0e0119, 0 0 8px #16ccded9, 0 0 2px #9eecda;'
    )

    /* replace green */
    updatedThemeStyles = updatedThemeStyles.replace(
      /color: #cfe08a;/g,
      'color: #cfe08a; text-shadow: 0 0 2px #000000, 0 0 5px #5ca2cc;'
    )

    /* append the remaining styles */
    updatedThemeStyles = `${updatedThemeStyles}[CHROME_STYLES]`

    const newStyleTag = document.createElement('style')
    newStyleTag.setAttribute('id', 'fortnite-theme-styles')
    newStyleTag.innerText = updatedThemeStyles.replace(/(\r\n|\n|\r)/gm, '')
    document.body.appendChild(newStyleTag)

    console.log('Fortnite: LEGENDARY initialized!')

    // disconnect the observer because we don't need it anymore
    if (obs) {
      obs.disconnect()
    }
  }

  // Callback function to execute when mutations are observed
  const watchForBootstrap = function (mutationsList, observer) {
    console.log(mutationsList)
    for (let mutation of mutationsList) {
      if (mutation.type === 'attributes') {
        // only init if we're using a Fortnite subtheme
        const isUsingFortnite = document.querySelector(
          '[class*="sdras-fortnite"]'
        )
        // does the style div exist yet?
        const tokensLoaded = document.querySelector('.vscode-tokens-styles')

        // sometimes VS code takes a while to init the styles content, so stop this observer and add an observer for that
        if (isUsingFortnite && tokensLoaded) {
          observer.disconnect()
          observer.observe(tokensLoaded, { childList: true })
        }
      }
      if (mutation.type === 'childList') {
        // only init if we're using a Fortnite subtheme
        const isUsingFortnite = document.querySelector(
          '[class*="sdras-fortnite"]'
        )
        // does the style div exist yet?
        const tokensLoaded = document.querySelector('.vscode-tokens-styles')
        // does it have content ?
        const tokenStyles = document.querySelector(
          '.vscode-tokens-styles'
        ).innerText

        // Everything we need is ready, so initialize
        if (isUsingFortnite && tokensLoaded && tokenStyles) {
          initLegendary(observer)
        }
      }
    }
  }

  // try to initialize the theme
  initLegendary()

  // Use a mutation observer to check when we can bootstrap the theme
  const observer = new MutationObserver(watchForBootstrap)
  observer.observe(bodyNode, { attributes: true })
})()
