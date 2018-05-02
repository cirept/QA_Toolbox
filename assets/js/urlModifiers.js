const urlModifiers = {
  init() {
    // initialize module
    this.createElements();
    this.buildPanel();
    this.cacheDOM();
    this.setToggle();
    this.addTool();
    this.bindEvents();
    shared.displayPanel(urlModifiers.config.$urlModPanel);
  },
  // ----------------------------------------
  // tier 1 functions
  // ----------------------------------------
  createElements() {
    // main panel container
    urlModifiers.config = {
      $urlModContainer: jQuery('<div>')
        .attr({
          class: 'toolBox',
          id: 'urlModContainer',
        }),
      $urlModPanel: jQuery('<div>')
        .attr({
          class: 'toolsPanel',
          id: 'urlModTools',
        }),
      $urlModTitle: jQuery('<div>')
        .attr({
          class: 'panelTitle',
          id: 'urlModTitle',
          title: 'Click to Minimize / Maximize',
        })
        .text('URL Modifiers'),
      $autoApplyContainer: jQuery('<div>')
        .attr({
          class: 'toggleTool autoApplyInput',
          title: 'will auto apply URL modifiers to current URL\n*please reload the page to update the URL to current settings*',
        }),
      $autoApplyTitle: jQuery('<div>')
        .attr({
          class: 'autoApply',
        })
        .text('Auto Apply Modifiers?'),
      $autoApplyIcon: jQuery('<div>')
        .attr({
          id: 'autoApplyIcon',
        }),
      $FAtoggle: jQuery('<i class="fa fa-toggle-off fa-lg"></i>'),
    };
  },
  buildPanel() {
    // attach panel elements to container
    urlModifiers.config.$urlModPanel
      .append(nextGenToggle.init())
      .append(m4Check.init())
      .append(autofillToggle.init());

    urlModifiers.config.$autoApplyContainer
      .append(urlModifiers.config.$autoApplyTitle)
      .append(urlModifiers.config.$autoApplyIcon);
    // urlModifiers.config.$autoApplyContainer.append(urlModifiers.config.$autoApplyIcon);
    urlModifiers.config.$autoApplyIcon
      .append(urlModifiers.config.$FAtoggle);
    urlModifiers.config.$urlModPanel
      .append(urlModifiers.config.$autoApplyContainer);

    // attach title and URL Mod panel to URL Mod container
    urlModifiers.config.$urlModContainer
      .append(urlModifiers.config.$urlModTitle)
      .append(urlModifiers.config.$urlModPanel);
    // urlModifiers.config.$urlModContainer.append(urlModifiers.config.$urlModPanel);
  },
  cacheDOM() {
    // DOM elements
    this.variableList = shared.programData();
    this.$toolBoxContainer = jQuery('.toolboxContainer');
    this.newURL = window.location.href;
  },
  setToggle() {
    // get value of custom variable and set toggles accordingly
    const currentToggle = shared.getValue('autoApplyParameters');

    if (currentToggle) {
      this.toggleOn();
      this.applyParameters();
    } else {
      this.toggleOff();
    }
  },
  addTool() {
    // add to main toolbox
    this.$toolBoxContainer
      .append(urlModifiers.config.$urlModContainer);
  },
  bindEvents() {
    // minimize
    urlModifiers.config.$urlModTitle
      .on('click', shared.toggleFeature)
      .on('click', shared.saveState);
    urlModifiers.config.$autoApplyContainer.on('click', this.flipTheSwitch
      .bind(this));
  },
  // ----------------------------------------
  // tier 2 functions
  // ----------------------------------------
  toggleOn() {
    // set toggle on image
    const $toggle = urlModifiers.config.$FAtoggle;
    $toggle
      .removeClass('fa-toggle-off')
      .addClass('fa-toggle-on');
  },
  toggleOff() {
    // set toggle off image
    const $toggle = urlModifiers.config.$FAtoggle;
    $toggle
      .removeClass('fa-toggle-on')
      .addClass('fa-toggle-off');
  },
  applyParameters() {
    const urlParameters2 = {
      'nextGen=': nextGenToggle.isToggleOn(),
      'relative=': m4Check.isToggleOn(),
      'disableAutofill=': autofillToggle.isToggleOn(),
    };
    let findThis = '';
    let key = '';
    const matchesFound = [];
    let hasKey;
    let isOn;

    for (key in urlParameters2) {
      if (urlParameters2.hasOwnProperty(key)) {
        findThis = key;

        this.checkQuestionMark();

        this.addImmobile();

        // determine search term is empty
        // this will mean that the toggle is turned off
        if (this.runTool(findThis)) {
          // search url for KEY
          hasKey = this.newURL.indexOf(findThis) >= 0;
          isOn = urlParameters2[key];

          // check URL for parameters
          matchesFound.push(this.modifyURL(hasKey, findThis, isOn));
        }
      }
    }
    // reloadPAge
    this.reloadPage(matchesFound);
  },
  flipTheSwitch() {
    // set saved variable to opposite of current value
    const toggle = shared.getValue('autoApplyParameters');
    shared.saveValue('autoApplyParameters', !toggle);

    // set toggle
    this.setToggle();
  },
  // ----------------------------------------
  // tier 3
  // ----------------------------------------
  checkQuestionMark() {
    // this works with current URL
    // will check to see if current URL has all the variables with it
    // ONE DOWNSIDE IS THAT IF THE URL DOESNT ALREADY HAVE A ? IN IT
    // AN ERROR WILL BE THROWN
    if (this.newURL.indexOf('?') === -1) {
      this.newURL += '?';
    }
  },
  addImmobile() {
    // force the page to reload in DESKTOP SITE
    // no downside to NEXT GEN SITES
    if (this.newURL.indexOf('device=immobile') === -1) {
      this.newURL += '&device=immobile';
    }
  },
  runTool(findThis) {
    // determine search term is empty
    // this will mean that the toggle is turned off
    if (typeof findThis === 'undefined' || findThis === '') {
      return false;
    }
    return true;
  },
  modifyURL(hasKey, findThis, isOn) {
    // --------------------------------------------------------
    // toggle functions
    // --------------------------------------------------------
    switch (findThis) {
      // --------------------------------------------------------
      // NEXTGEN PARAMETER
      // --------------------------------------------------------
      case 'nextGen=':
        // ----------------------------------------
        // parameter found in url
        // ----------------------------------------
        // if 'found parameter in url' AND 'toggle is ON'
        if (hasKey && isOn) {
          // if 'parameter is set to false'
          if (this.newURL.indexOf('nextGen=false') >= 0) {
            this.newURL = this.newURL.replace(
              'nextGen=false',
              'nextGen=true',
            );
            return false;
          }
          // if 'parameter is set to true'
          if (this.newURL.indexOf('nextGen=true') >= 0) {
            // do nothing
            return true;
          }
        }
        // ----------------------------------------
        // parameter found in url
        // ----------------------------------------
        // if 'found parameter in url' AND 'toggle is OFF'
        if (hasKey && !isOn) {
          // if 'parameter is set to true'
          if (this.newURL.indexOf('nextGen=true') >= 0) {
            this.newURL = this.newURL.replace(
              'nextGen=true',
              'nextGen=false',
            );
            return false;
          }
          // if 'parameter is set to false'
          if (this.newURL.indexOf('nextGen=false') >= 0) {
            // do nothing
            return true;
          }
        }
        // ----------------------------------------
        // parameter not found in url
        // ----------------------------------------
        // if 'parameter not found in url' AND 'toggle is ON'
        if (!hasKey && isOn) {
          // Add parameter to url string
          this.newURL += '&nextGen=true';
          return false;
        }
        // ----------------------------------------
        // parameter not found in url
        // ----------------------------------------
        // if 'parameter not found in url' AND 'toggle is OFF'
        if (!hasKey && !isOn) {
          // Add parameter to url string
          this.newURL += '&nextGen=false';
          return false;
        }
        break;
        // --------------------------------------------------------
        // DISABLE AUOTFILL PARAMETER
        // --------------------------------------------------------
      case 'disableAutofill=':
        // ----------------------------------------
        // parameter found in url
        // ----------------------------------------
        // if 'found parameter in url' AND 'toggle is ON'
        if (hasKey && isOn) {
          // if 'parameter is set to false'
          if (this.newURL.indexOf('disableAutofill=false') >= 0) {
            this.newURL = this.newURL.replace(
              'disableAutofill=false',
              'disableAutofill=true',
            );
            return false;
          }
          // if 'parameter is set to true'
          if (this.newURL.indexOf('disableAutofill=true') >= 0) {
            // do nothing
            return true;
          }
        }
        // ----------------------------------------
        // parameter found in url
        // ----------------------------------------
        // if 'found parameter in url' AND 'toggle is OFF'
        if (hasKey && !isOn) {
          // if 'parameter is set to true'
          if (this.newURL.indexOf('disableAutofill=true') >= 0) {
            this.newURL = this.newURL.replace(
              '&disableAutofill=true',
              '',
            );
            return false;
          }
          // if 'parameter is set to false'
          if (this.newURL.indexOf('disableAutofill=false') >= 0) {
            // remove parameter from url
            this.newURL = this.newURL.replace(
              '&disableAutofill=false',
              '',
            );
            return false;
          }
        }
        // ----------------------------------------
        // parameter not found in url
        // ----------------------------------------
        // if 'parameter not found in url' AND 'toggle is ON'
        if (!hasKey && isOn) {
          // Add parameter to url string
          this.newURL += '&disableAutofill=true';
          return false;
        }
        // ----------------------------------------
        // parameter not found in url
        // ----------------------------------------
        // if 'parameter not found in url' AND 'toggle is OFF'
        if (!hasKey && !isOn) {
          // do nothing
          return true;
        }
        break;
        // --------------------------------------------------------
        // MILESTONE 4 PARAMETERS (TETRA SITES)
        // --------------------------------------------------------
      case 'relative=':
        // ----------------------------------------
        // parameter found in url
        // ----------------------------------------
        // if 'found parameter in url' AND 'toggle is turned on'
        if (hasKey && isOn) {
          // do nothing
          return true;
        }
        // ----------------------------------------
        // parameter found in url
        // ----------------------------------------
        // if 'found parameter in url' AND 'toggle is off'
        if (hasKey && !isOn) {
          // remove ADDED parameter from URL
          this.newURL = this.newURL.replace(
            '&comments=true&relative=true', '');
          return false;
        }
        // ----------------------------------------
        // parameter not found in url
        // ----------------------------------------
        // if 'parameter not found in url' AND 'toggle is ON'
        if (!hasKey && isOn) {
          // Add parameter to url string
          this.newURL += '&comments=true&relative=true';
          return false;
        }
        // ----------------------------------------
        // parameter not found in url
        // ----------------------------------------
        // if 'parameter not found in url' AND 'toggle is OFF'
        if (!hasKey && !isOn) {
          // do nothing
          return true;
        }
        break;
      default:
    }
  },
  reloadPage(matchesFound) {
    // determine if all parameters are found in the URL
    // will stop the page from reloading after initial build.
    const matchLength = matchesFound.length;
    let reloadPage = false;

    // loop through array to determine if page should reload
    for (let q = 0; q < matchLength; q += 1) {
      // if a match isn't found, break out of loop and reload the page.
      if (matchesFound[q]) {
        reloadPage = false;
      } else {
        reloadPage = true;
        break;
      }
    }

    // if reloadPage is true reload page
    if (reloadPage) {
      window.location.href = this.newURL;
    }
  },
};
