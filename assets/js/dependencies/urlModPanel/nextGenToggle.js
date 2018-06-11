const nextGenToggle = {
  /**
   * initialize the tool
   * calls all the functions to build the tool
   */
  init(callingPanel) {
    this.createElements();
    this.buildTool();
    this.cacheDOM(callingPanel);
    this.setToggle();
    this.addTool();
    this.bindEvents();
  },
  // ----------------------------------------
  // tier 1 functions
  // ----------------------------------------
  /**
   * Creates all the DOM elements that the tool will use
   */
  createElements() {
    this.config = {
      $nextGenTogContainer: jQuery('<div>')
        .attr({
          id: 'nextGenToggleInput',
          class: 'toggleTool myParameter',
          title: 'Apply NextGen=true',
        }),
      $nextGenTogTitle: jQuery('<div>')
        .text('nextGen?'),
      $nextGenTogIcon: jQuery('<div>')
        .attr({
          id: 'nextGenToggleIcon',
        }),
      $FAtoggle: jQuery('<i class="fa fa-toggle-off fa-lg"></i>'),
    };
  },
  /**
   * Builds the tools elements
   * Combines the cached DOM elements
   */
  buildTool() {
    const {} = this.config;

    this.config.$nextGenTogIcon
      .append(this.config.$FAtoggle);
    this.config.$nextGenTogContainer
      .append(this.config.$nextGenTogIcon)
      .append(this.config.$nextGenTogTitle);
  },
  /**
   * Caches things from the DOM that the tool will use.
   * @param {object} callingPanel - the panel that this tool is located in
   */
  cacheDOM(callingPanel) {
    this.$toolsPanel = jQuery(callingPanel);
  },
  /**
   * Sets the state of the toggle to the last saved state loaded from
   * local storage
   */
  setToggle() {
    if (shared.getValue('isNextGen')) {
      // if 'nextGen' value is true
      // set toggle and apply parameters
      this.toggleOn();
    } else {
      // if 'nextGen' value is false
      // set toggle and apply parameters
      this.toggleOff();
    }
  },
  /**
   * Adds the combined tool elements to the tool container on the DOM
   */
  addTool() {
    const {
      $nextGenTogContainer
    } = this.config;

    // add to main toolbox
    this.$toolsPanel.append($nextGenTogContainer);
  },
  /**
   * Attaches the event listeners that will provide the tools functionality
   */
  bindEvents() {
    const {
      $nextGenTogContainer,
      $nextGenTogTitle
    } = this.config;

    // bind FA toggle with 'flipTheSwitch' action
    $nextGenTogContainer.on('click', this.flipTheSwitch
      .bind(this));

    // apply mouse over hover effect for display text
    $nextGenTogTitle.on('mouseover', () => {
      $nextGenTogTitle.fadeOut(250, () => {
        $nextGenTogTitle.text('Add NextGen Parameter to URL?')
          .fadeIn(500);
      })
    });

    // apply mouse out hover effect for display text
    $nextGenTogTitle.on('mouseout', () => {
      $nextGenTogTitle.fadeOut(250, () => {
        $nextGenTogTitle.text('NextGen?')
          .fadeIn(500);
      })
    });
  },
  // ----------------------------------------
  // tier 2 functions
  // ----------------------------------------
  /**
   * Changed the DOM toggle to the ON state
   */
  toggleOn() {
    const {} = this.config;

    // set toggle on image
    const $toggle = this.config.$FAtoggle;
    $toggle
      .removeClass('fa-toggle-off')
      .addClass('fa-toggle-on');
  },
  /**
   * Changed the DOM toggle to the OFF state
   */
  toggleOff() {
    const {} = this.config;

    // set toggle off image
    const $toggle = this.config.$FAtoggle;
    $toggle
      .removeClass('fa-toggle-on')
      .addClass('fa-toggle-off');
  },
  /**
   * Sets the saved variable to the opposite of what it is currently
   * and updates the DOM toggle element
   */
  flipTheSwitch() {
    // set saved variable to opposite of current value
    const toggle = shared.getValue('isNextGen');
    shared.saveValue('isNextGen', !toggle);

    // set toggle
    this.setToggle();
  },
  // ----------------------------------------
  // tier 3 functions
  // ----------------------------------------
  hasParameters() {
    // determine if site URL already has custom parameters
    if (window.location.href.indexOf('nextGen=') >= 0) {
      return true;
    }
    return false;
  },
  siteState() {
    // return page variable
    return unsafeWindow.ContextManager.getVersion();
  },
  // ----------------------------------------
  // other functions
  // ----------------------------------------
  isToggleOn() {
    return shared.getValue('isNextGen');
  },
};
