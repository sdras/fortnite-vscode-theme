;(function () {
  // Grab body node
  const bodyNode = document.querySelector('body')
  bodyNode.setAttribute('id', 'fortnite-test')

  // Replace the styles with the glow theme
  const initLegendary = (disableGlow, obs) => {
    var themeStyleTag = document.querySelector('.vscode-tokens-styles')
    if (!themeStyleTag) {
      return
    }

    var initialThemeStyles = themeStyleTag.innerText

    var updatedThemeStyles = initialThemeStyles

    if (!disableGlow) {
      /* replace red */
      updatedThemeStyles = updatedThemeStyles.replace(
        /color: #fe4450;/g,
        'color: #fff5f6; text-shadow: 0 0 2px #000, 0 0 10px #fc1f2c[LEGENDARY_BRIGHTNESS], 0 0 5px #fc1f2c[LEGENDARY_BRIGHTNESS], 0 0 25px #fc1f2c[LEGENDARY_BRIGHTNESS];'
      )

      /* replace pink */
      updatedThemeStyles = updatedThemeStyles.replace(
        /color: #ff7edb;/g,
        'color: #f92aad; text-shadow: 0 0 2px #100c0f, 0 0 5px #dc078e33, 0 0 10px #fff3;'
      )

      /* replace yellow */
      updatedThemeStyles = updatedThemeStyles.replace(
        /color: #e5c07b;/g,
        'color: #efe5d3; text-shadow: 0 0 2px #0e0119, 0 0 8px #ef7b05[LEGENDARY_BRIGHTNESS], 0 0 2px #f3a007[LEGENDARY_BRIGHTNESS];'
      )

      /* replace green */
      updatedThemeStyles = updatedThemeStyles.replace(
        /color: #72f1b8;/g,
        'color: #72f1b8; text-shadow: 0 0 2px #100c0f, 0 0 10px #257c55[LEGENDARY_BRIGHTNESS], 0 0 35px #212724[LEGENDARY_BRIGHTNESS];'
      )

      /* replace blue */
      updatedThemeStyles = updatedThemeStyles.replace(
        /color: #36f9f6;/g,
        'color: #fdfdfd; text-shadow: 0 0 2px #001716, 0 0 3px #03edf9[LEGENDARY_BRIGHTNESS], 0 0 5px #03edf9[LEGENDARY_BRIGHTNESS], 0 0 8px #03edf9[LEGENDARY_BRIGHTNESS];'
      )
    }

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
    for (let mutation of mutationsList) {
      if (mutation.type === 'attributes') {
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
          initLegendary([DISABLE_GLOW], observer)
        }
      }
    }
  }

  // try to initialize the theme
  initLegendary([DISABLE_GLOW])

  // Use a mutation observer to check when we can bootstrap the theme
  const observer = new MutationObserver(watchForBootstrap)
  observer.observe(bodyNode, { attributes: true })
})()
