const shared = {
  /**
   * Caches the DOM for website information that'll be used to
   * turn features on and off in the tool
   */
  cacheDOM () {
    this.contextManager = unsafeWindow.ContextManager;
    this.setNextgenFlag();
  },
  /**
   * Tampermonkey function.
   * Save value to local storage for program to use.
   * @param {string} variable The variable that will be looked up.
   * @param {bool} val The value that the variable will be set too.
   */
  saveValue (variable, val) {
    GM_setValue(variable, val); // eslint-disable-line new-cap
  },
  /**
  * This is a quick workaround to phase the TETRA functionality for the QA
  * Tool.  The QA Tool will be forced into NextGen Mode and functionality for 
  * the various tools by a boolean value that will be stored in local storage. 
  */
  setNextgenFlag () {
    shared.saveValue('nextgenMode', true);
  },
  /**
   * Tampermonkey function.
   * Copy text to the clipboard.
   * @param {string} variable The variable that will be copied to the clipboard.
   */
  clipboardCopy (variable) {
    GM_setClipboard(variable, 'text'); // eslint-disable-line new-cap
  },
  /**
   * Tampermonkey function.
   * Get value to local storage for program to use.
   * @param {string} variable The variable that will be looked up.
   * @return {bool} The saved value of current variable.
   */
  getValue (variable) {
    return GM_getValue(variable, false); // eslint-disable-line new-cap
  },
  /**
   * Tampermonkey function.
   * to retrieve all the program variables from local storage.
   * @return {object} The list of saved values.
   */
  programVariables () {
    return GM_listValues(); // eslint-disable-line new-cap
  },
  /**
   * Tampermonkey function.
   * to open URL in a new tab.
   * @param {string} openThis A URL that will be opened in a new window.
   */
  openNewTab (openThis) {
    GM_openInTab(openThis); // eslint-disable-line
  },
  /**
   * Will verify the current viewed web page is a next gen website
   * by checking the Context Manager Object > nextGen property
   */
  nextGenCheck () {
    return shared.getValue("nextgenMode");
  },
  toggleFeature: (e) => {
    jQuery(e.target).toggleClass('minimized');
    const $callingElement = jQuery(e.target)
      .siblings('.toolsPanel');
    return $callingElement.slideToggle(500);
  },
  getResourceUrl: name => {
    return GM_getResourceURL(name);
  }, // eslint-disable-line
  saveState: (e) => {
    // get current state
    const vName = jQuery(e.target)
      .siblings('.toolsPanel')
      .attr('id');
    const currState = shared.getValue(vName);
    // sets usingM4 value
    shared.saveValue(vName, !currState);
  },
  /**
  * Adds the appear/disappear class to the tool panel which will hide/show
  * the panel of buttons
  * @param {object} $panel - the panel of tools to apply the class too
  * @param {string} state - the last saved state of the panel
  */
  setDisplayState ($panel, state) {
    if (state === 'show') {
      $panel.addClass('appear');
      $panel.siblings('.panelTitle').removeClass('minimized');
    }

    if (state === 'hide') {
      $panel.addClass('disappear');
      $panel.siblings('.panelTitle').addClass('minimized');
    }
  },
  programData: () => {
    const allVariables = shared.programVariables(); // global function
    const length = allVariables.length;
    const varList = {};
    let key = '';
    let value = '';
    // add variables to list
    for (let a = 0; a < length; a += 1) {
      key = allVariables[a];
      value = shared.getValue(key);
      varList[key] = value;
    }
    return varList;
  },
  buildLegendContent ($legendContent, $legendListContainer) {
    let key = '';
    let value = '';
    // loop through Legend Content list
    for (key in $legendContent) {
      if ($legendContent.hasOwnProperty(key)) {
        if (key === 'unsupportedPageLink' && !shared.nextGenCheck()) {
          continue;
        }

        // set value to value of 'text' key if the legendcontent is an object
        value = (typeof $legendContent[key]).toLowerCase() === 'object' ?
          $legendContent[key].text : $legendContent[key];

        // build listing element
        this.$listItem = jQuery('<li>')
          .attr({
            class: key,
          })
          .append(value);
        // attach to legend list
        $legendListContainer.append(this.$listItem);
      }
    }
  },
  displayPanel ($toolPanel) {
    const variables = this.programData();
    const panelId = $toolPanel.attr('id');
    let state = '';
    let key = '';

    // loop through variable list to find the panel title
    for (key in variables) {
      if (variables.hasOwnProperty(key)) {
        if (key === panelId) {
          state = variables[key] ? 'show' : 'hide';
          shared.setDisplayState($toolPanel, state);
        }
      }
    }
  },
  addDivOverlay (isNextGen, $currentLink, $currentCard) {
    // sets $currentCard to null for tetra site checks
    $currentCard = $currentCard || null;

    this.cacheDOMOverlayElements($currentLink);
    this.createOverlayElements(isNextGen);
    this.buildOverlayElements(isNextGen);
    this.attachToImage(isNextGen, $currentLink, $currentCard);
    return this.$divOverlay;
  },
  cacheDOMOverlayElements ($currentLink /* , isNextGen */) {
    // IF NEXTGEN SITE
    this.widthOfImage = $currentLink.find('img')
      .width();
    this.heightOfImage = $currentLink.find('img')
      .height();
    this.linkTitle = jQuery($currentLink)[0].innerHTML;
  },
  createOverlayElements (isNextGen) {
    // create div overlay
    if (isNextGen) {
      this.$divOverlay = jQuery('<div>')
        .attr({
          class: 'cardOverlay',
        });
    } else {
      this.$divOverlay = jQuery('<div>')
        .attr({
          class: 'siteLink imgOverlay',
        });
    }
  },
  buildOverlayElements (isNextGen) {
    if (!isNextGen) {
      // make the div overlay the same dimensions as the image
      this.$divOverlay.css({
        width: `${this.widthOfImage}px`,
        height: `${this.heightOfImage}px`,
      });
    }
    // add content to div
    // ADD THE LINK TITLE
    this.$divOverlay.append(this.linkTitle);
  },
  attachToImage (isNextGen, $currentLink, $currentCard) {
    // center div overlay
    try {
      if (isNextGen) {
        this.$divOverlay.attr({
          class: 'imgOverlay myNextGen',
        });
        $currentCard.prepend(this.$divOverlay);
      } else {
        $currentLink.prepend(this.$divOverlay);
      }
    } catch (e) {
      // console.log(e);
      // console.log($currentCard);
      // console.log($currentLink);
    }
  },
  toggleOverlayClass ($currentImage) {
    jQuery($currentImage)
      .toggleClass('overlaid');
  },
  centerDiv ($currentImage, $divOverlay) {
    const parent = $currentImage.closest('figure');
    $divOverlay.css({
      'left': parent.width() / 2 - $divOverlay.width() / 2 + 'px',
    });
    return $divOverlay;
  },
  // FLAG ALL BUTTONS AS A BUTTON ELEMENT
  flagButtons () {
    const buttons = jQuery('body')
      .find(':button');
    const length = buttons.length;

    for (let a = 0; a < length; a += 1) {
      jQuery(buttons[a])
        .addClass('buttonFlag');
    }
  },
};

// module.export = Shared;
