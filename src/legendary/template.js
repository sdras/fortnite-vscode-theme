;(function main() {
  // Add a llama, and remove it when we're done bouncing
  const DOM_img = document.createElement('img')
  setTimeout(() => {
    DOM_img.src = 'https://assets.codepen.io/28963/llama-bounce.gif'
    DOM_img.classList.add('llama')
    document.body.appendChild(DOM_img)
  }, 4000)
  setTimeout(() => {
    const llamaEl = document.querySelector('.llama')
    llamaEl.parentNode.removeChild(llamaEl)
  }, 9000)

  // try to initialize the legendary
  initLegendary()

  // Use a mutation observer to check when we can bootstrap the legendary
  (new MutationObserver(watchForBootstrap))
    .observe(document.body, { attributes: true })
})()

function initLegendary() {
  const themeStyleTag = document.querySelector('.vscode-tokens-styles')
  if (!themeStyleTag) return

  let legendaryStyles = themeStyleTag.innerText
    /* replace magenta */
    .replace(
      'color: #ea5a9c;',
      'color: #ef5ea0; text-shadow: 0 0 2px #000000, 0 0 8px #bf226a, 0 0 2px #ef5ea0;'
    )
    /* replace yellow */
    .replace(
      'color: #f9dea6;',
      'color: #efe5d3; text-shadow: 0 0 2px #0e0119, 0 0 8px #ef7b05cc, 0 0 2px #f3a007cc;'
    )
    /* replace teal */
    .replace(
      'color: #8cefd8;',
      'color: #9eecda; text-shadow: 0 0 1px #0e0119, 0 0 6px #16ccded9cc, 0 0 2px #9eecdacc;'
    )
    /* replace green */
    .replace(
      'color: #cfe08a;',
      'color: #cfe08a; text-shadow: 0 0 2px #000000, 0 0 5px #5ca2cc;'
    )
  /* append the remaining styles */
  legendaryStyles += `[CHROME_STYLES]`

  const newStyleTag = document.createElement('style')
  newStyleTag.setAttribute('id', 'fortnite-theme-styles')
  newStyleTag.innerText = legendaryStyles
  document.head.appendChild(newStyleTag)

  console.log('Fortnite: LEGENDARY initialized!')
}

function watchForBootstrap(mutationsList, observer) {
  console.log(mutationsList)
  for (const mutation of mutationsList) {
    if (mutation.type === 'attributes' || mutation.type === 'childList') {
      const isUsingFortnite = document.querySelector(
        '[class*="sdras-fortnite"]'
      )
      const tokensLoaded = document.querySelector('.vscode-tokens-styles')
      const tokenStylesLoaded =
        tokensLoaded.innerText && tokensLoaded.innerText !== ''

      if (isUsingFortnite && tokensLoaded && tokenStylesLoaded) {
        observer.disconnect()
        initLegendary()
      }

      if (mutation.type === 'attributes' &&
          isUsingFortnite && tokensLoaded && !tokenStylesLoaded) {
        // Sometimes VS Code takes a while to init the styles content,
        //   so stop this observer and add one for that.
        observer.disconnect()
        observer.observe(tokensLoaded, { childList: true })
      }
    }
  }
}
