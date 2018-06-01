const bannedWords = {
  init(callingPanel) {
    this.createElements();
    this.bannedWordsMap();
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
    bannedWords.config = {
      $activateButt: jQuery('<button>')
        .attr({
          class: 'myEDOBut',
          id: 'bannedWords',
          title: 'Check Banned Words',
        })
        .text('banned words'),
      $offButt: jQuery('<input>')
        .attr({
          type: 'button',
          class: 'myEDOBut offButt',
          value: 'Turn Off',
        }),
      $legend: jQuery('<div>')
        .attr({
          class: 'tbLegend bannedWords',
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
        'spell-check banned': 'Banned by OEM',
      },
      OEMBannedWordsFile: 'https://rawgit.com/cirept/QA_Toolbox/QuinnTest/resources/OEM_Banned_Words.json',
      OEMap: new Map()
    };
  },
  /**
   * Build the legend for the tool
   */
  buildLegend() {
    bannedWords.config.$legend
      // attach legend title
      .append(bannedWords.config.$legendTitle)
      // attach list
      .append(bannedWords.config.$legendList)
      // attach turn off button
      .append(bannedWords.config.$offButt)
      // attach hint
      .append(bannedWords.config.$hint);

    // fill list
    shared.buildLegendContent(
      bannedWords.config.$legendContent,
      bannedWords.config.$legendList,
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
  },
  /**
   * Add the tool to the QA toolbox
   * Will add the tool to the MAIN TOOLS panel
   */
  addTool() {
    this.$toolsPanel
      .append(bannedWords.config.$activateButt);
    this.$legendContainer
      .append(bannedWords.config.$legend);
  },
  /**
   * binds all the Activate and Off
   */
  bindEvents() {
    // activate button
    bannedWords.config.$activateButt
      .on('click', this.bannedWordsCheckPage.bind(this))
      .on('click', this.toggleLegend)
      .on('click', this.toggleDisable);

    // off button
    bannedWords.config.$offButt
      .on('click', this.removeHighlights.bind(this))
      .on('click', this.toggleLegend)
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
  bannedWordsMap() {
    const OEMBannedWordsFile = bannedWords.config.OEMBannedWordsFile;
    // get banned words JSON
    $.getJSON(OEMBannedWordsFile, (d) => {
      $.each(d, (key, value) => {
        // sort so that longer words get highlighted over shorter ones
        bannedWords.config.OEMap.set(key, value.sort((a, b) => b.length -
          a.length || a.localeCompare(b)));
      });
    });
  },
  /**
   * Highlight all banned words associated with this OEM
   */
  bannedWordsCheckPage() {
    // console.log('bannedWordsCheckPage');
    const wordList = this.treeWalk();
    let bannedWords = [];
    let text;
    let pElm;
    let elm;
    let unmarked;
    const self = this;
    const franchises = ContextManager.getFranchises();

    // highlight banned words for every OEM related to this
    for (let f = 0, len = franchises.length; f < len; f++) {
      // get banned phrases from OEM franchise
      bannedWords = this.config.OEMap.get(franchises[f]);

      console.log(bannedWords);

      // if the OEM has not been configured let the user know and do not show the legend
      if (!bannedWords) {
        window.alert('this OEM does not have any banned words configured in the tool.');
        self.toggleLegend();
        self.toggleDisable();
        return;
      }

      // Check page for banned words
      wordList.forEach((n) => {
        text = n.nodeValue;

        elm = n.parentElement;

        // skip iteration if no words are found
        if (!text.match(/[%’'\w]+/g)) {
          return;
        }
        // test text against banned words
        for (let w = 0, length = bannedWords.length; w < length; w++) {
          const words = bannedWords[w];
          // find and replace banned words
          unmarked = new RegExp(`\(${words}\)(?!@~~)`, 'gi');
          text = text.replace(unmarked, '~~@$&@~~');
        }

        n.nodeValue = text;
        // replace when the whole area has been searched
        if (!pElm) {
          pElm = elm;
        } else if (!pElm.contains(elm)) {
          self.replaceMarkers(pElm, false);
          pElm = elm;
        }
      });
    }
  },
  /**
   * Toggle the tools legend
   */
  toggleLegend() {
    bannedWords.config.$legend.slideToggle(500);
  },
  /**
   * Toggle the 'activate' button from being clicked multiple time
   */
  toggleDisable() {
    /**
     * Sets the 'activate' button to the opposite of its current value
     * @return {boolean} return the opposite of what the current state is
     */
    bannedWords.config.$activateButt.prop('disabled', (index, value) => !
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
