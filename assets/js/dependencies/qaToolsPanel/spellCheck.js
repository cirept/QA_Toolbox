const spellCheck = {
  init(callingPanel) {
    this.createElements();
    // this.bannedWordsMap();
    this.buildLegend();
    this.cacheDOM(callingPanel);
    this.addTool();
    this.bindEvents();
  },
  // ----------------------------------------
  // tier 1 functions
  // ----------------------------------------
  /**
   * Create all the module DOM elements
   */
  createElements() {
    spellCheck.config = {
      $activateButt: jQuery('<button>')
        .attr({
          class: 'myEDOBut',
          id: 'spellCheck',
          title: 'Check Spelling',
        })
        .text('Spell check'),
      $offButt: jQuery('<input>')
        .attr({
          type: 'button',
          class: 'myEDOBut offButt',
          value: 'Turn Off',
        }),
      $legend: jQuery('<div>')
        .attr({
          class: 'tbLegend spellCheck',
        }),
      $legendTitle: jQuery('<div>')
        .attr({
          class: 'legendTitle',
        })
        .text('Spell Check Legend'),
      $legendList: jQuery('<ul>')
        .attr({
          class: 'legendList',
        }),
      $legendContent: {
        'spell-check misspelled': 'word misspelled',
        // 'spell-check banned': 'Banned by OEM',
      },
      // OEMBannedWordsFile: 'https://rawgit.com/cirept/QA_Toolbox/QuinnTest/resources/OEM_Banned_Words.json'
    };
  },
  /**
   * Build the legend for the tool
   */
  buildLegend() {
    spellCheck.config.$legend
      // attach legend title
      .append(spellCheck.config.$legendTitle)
      // attach list
      .append(spellCheck.config.$legendList)
      // attach turn off button
      .append(spellCheck.config.$offButt)
      // attach hint
      .append(spellCheck.config.$hint);

    // fill list
    shared.buildLegendContent(
      spellCheck.config.$legendContent,
      spellCheck.config.$legendList,
    );
  },
  /**
   * Grab all the information/element references from the DOM
   * that the tool needs to run.
   * @param {object} callingPanel - the main panel that is calling the function
   */
  cacheDOM(callingPanel) {
    this.$toolsPanel = jQuery(callingPanel);
    // DOM elements
    this.$legendContainer = jQuery('.legendContainer');
    // define OEMap
    this.OEMap = new Map();
  },
  /**
   * Add the tool to the QA toolbox
   * Will add the tool to the MAIN TOOLS panel
   */
  addTool() {
    this.$toolsPanel
      .append(spellCheck.config.$activateButt);
    this.$legendContainer
      .append(spellCheck.config.$legend);
  },
  /**
   * binds all the Activate and Off
   */
  bindEvents() {
    // activate button
    spellCheck.config.$activateButt
      .on('click', this.spellCheckPage.bind(this))
      .on('click', this.showLegend)
      .on('click', this.toggleDisable);

    // off button
    spellCheck.config.$offButt
      .on('click', this.removeHighlights.bind(this))
      .on('click', this.showLegend)
      .on('click', this.toggleDisable);
  },
  // ----------------------------------------
  // tier 2 functions
  // ----------------------------------------
  /**
   * traverses the DOM and grabs all visible text
   * @return {object} All the visible text on the page
   */
  treeWalk() {
    const treeWalker = document.createTreeWalker(document.body,
      NodeFilter.SHOW_TEXT, null, false);
    const wordArray = [];

    while (treeWalker.nextNode()) {
      if (treeWalker.currentNode.nodeType === 3) {
        wordArray.push(treeWalker.currentNode);
      }
    }
    return wordArray;
  },
  // bannedWordsMap() {
  //   const OEMBannedWordsFile = spellCheck.config.OEMBannedWordsFile;
  //   // get banned words JSON
  //   $.getJSON(OEMBannedWordsFile, (d) => {
  //     $.each(d, (key, value) => {
  //       // sort so that longer words get highlighted over shorter ones
  //       this.OEMap.set(key, value.sort((a, b) => b.length -
  //         a.length || a.localeCompare(b)));
  //     });
  //   });
  // },
  /**
   * Gets all text on page and tests words against custom dictionary
   */
  spellCheckPage() {
    const dictionary = new Typo('en_US', false, false, { // eslint-disable-line
      // dictionaryPath: 'https://raw.githubusercontent.com/cirept/Typo.js/addingAutofillTags/typo/dictionaries/',
      'dictionaryPath': 'https://raw.githubusercontent.com/cirept/Typo.js/master/typo/dictionaries/',
    });
    let wordList = [];
    const self = this;
    let pElm;
    let text;
    let words;
    let elm;
    let unmarked;

    // get all visible text on page
    wordList = this.treeWalk();
    wordList.forEach((n) => {
      // get all text on the page
      text = n.nodeValue;

      // create an array of seperated words from text string
      words = text.match(/[%’'\w]+/g);

      elm = n.parentElement;

      // skip iteration if no words are found
      if (!words) {
        return;
      }

      // search each word in array for dictionary match
      // flag word if not found in dictionary
      words.forEach((word) => {
        // is word NOT in the dictionary AND NOT a number
        if (!dictionary.check(self.clean(word)) && !(/^\d+$/)
          .test(word)) {
          // create regex expression to find word in string
          // Included (?!@~~) to skip already replaced word in string
          unmarked = new RegExp(`\(${word}\)(?!@~~)`, 'g');
          text = text.replace(unmarked, '~~@$&@~~');
        }
      });

      n.nodeValue = text;

      if (!pElm) {
        pElm = elm;
      } else if (!pElm.contains(elm)) {
        self.replaceMarkers(pElm, true);
        pElm = elm;
      }
    });
    // spellCheck.bannedWords();
  },
  /**
   * Highlight all banned words associated with this OEM
   */
  // bannedWords() {
  //   const wordList = this.treeWalk();
  //   let bannedWords = [];
  //   let text;
  //   let pElm;
  //   let elm;
  //   let unmarked;
  //   const self = this;
  //   const franchises = unsafeWindow.ContextManager.getFranchises();
  //
  //   // highlight banned words for every OEM related to this
  //   for (let f = 0, len = franchises.length; f < len; f++) {
  //     // get banned phrases from OEM franchise
  //     bannedWords = self.OEMap.get(franchises[f]);
  //
  //     if (!bannedWords) {
  //       return;
  //     }
  //
  //     // Check page for banned words
  //     wordList.forEach((n) => {
  //       text = n.nodeValue;
  //
  //       elm = n.parentElement;
  //
  //       // skip iteration if no words are found
  //       if (!text.match(/[%’'\w]+/g)) {
  //         return;
  //       }
  //       // test text against banned words
  //       for (let w = 0, length = bannedWords.length; w < length; w++) {
  //         const words = bannedWords[w];
  //         // unmarked = new RegExp('\(^|[^~~@])(' + words + '\)(?!@~~)', 'gi');
  //         // find and replace banned words
  //         unmarked = new RegExp(`\(${words}\)(?!@~~)`, 'gi');
  //         text = text.replace(unmarked, '~~@$&@~~');
  //       }
  //
  //       n.nodeValue = text;
  //       // replace when the whole area has been searched
  //       if (!pElm) {
  //         pElm = elm;
  //       } else if (!pElm.contains(elm)) {
  //         self.replaceMarkers(pElm, false);
  //         pElm = elm;
  //       }
  //     });
  //   }
  // },
  /**
   * Toggle the tools legend
   */
  showLegend() {
    spellCheck.config.$legend.slideToggle(500);
  },
  /**
   * Toggle the 'activate' button from being clicked multiple time
   */
  toggleDisable() {
    /**
     * Sets the 'activate' button to the opposite of its current value
     * @return {boolean} return the opposite of what the current state is
     */
    spellCheck.config.$activateButt.prop('disabled', (index, value) => !
      value);
  },
  // ----------------------------------------
  // tier 3 functions
  // ----------------------------------------
  clean(word) {
    return word.replace('’', '\'')
      .replace(/^'*(.*?)'*$/, '$1')
      .replace('%', '\%');
  },
  replaceMarkers(elm, spelling) {
    if (elm) {
      if (spelling) {
        elm.innerHTML = elm.innerHTML
          .replace(/~~@(.*?)@~~/g,
            '<span class="spell-check misspelled">$1</span>');
      } else {
        elm.innerHTML = elm.innerHTML
          .replace(/~~@(.*?)@~~/g,
            '<span class="spell-check banned">$1</span>');
        if (elm.innerHTML.indexOf('~~@') > -1) {
          elm.innerHTML = elm.innerHTML
            .replace(/~~@(.*?)@~~/g,
              '<span class="spell-check banned">$1</span>');
        }
      }
    }
  },
  removeHighlights() {
    // remove highlight overlay
    jQuery('span.spell-check').each((index, value) => {
      jQuery(value).replaceWith(() => {
        let string = '';
        for (let x = 0; x < value.childNodes.length; x++) {
          // debugger;
          if (value.childNodes[x].nodeValue == null) {
            string += value.childNodes[x].childNodes[0].nodeValue;
          } else {
            string += value.childNodes[x].nodeValue;
          }
        }
        return string;
      });
    });
  },
};
