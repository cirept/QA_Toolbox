const refreshPage = {
  /**
   * initialize the tool
   * calls all the functions to build the tool
   */
  init(callingPanel) {
    this.createElements();
    this.cacheDOM(callingPanel);
    this.buildTool();
    this.addTool();
    this.bindEvents();
    this.setToggle();
  },
  // ----------------------------------------
  // tier 1 functions
  // ----------------------------------------
  /**
   * Creates all the DOM elements that the tool will use
   */
  createElements() {
    this.config = {
      $refreshContainer: jQuery('<div>')
        .attr({
          id: 'refreshMe',
          class: 'toggleTool',
          title: 'toggle to add a refresh button',
        }),
      $refreshButtContainer: jQuery('<div>')
        .attr({
          class: 'refreshPageContainer',
        }),
      $refreshButt: jQuery('<button>')
        .attr({
          class: 'myEDOBut refreshButt',
          title: 'Refresh Page',
        }),
      $refresh: jQuery(
        '<i class="fas fa-redo-alt fa-2x"></i>'),
      $refreshTitle: jQuery('<div>')
        .text('Refresh'),
      $refreshCheckbox: jQuery('<div>')
        .attr({
          id: 'refreshMetoggle',
          title: 'toggle refresh button',
        }),
      $FAtoggle: jQuery('<i class="fas toggle-off fa-lg"></i>'),
    };
  },
  /**
   * Caches things from the DOM that the tool will use.
   * @param {object} callingPanel - the panel that this tool is located in
   */
  cacheDOM(callingPanel) {
    this.$togglesPanel = jQuery(callingPanel);
    this.$togglesContainer = jQuery('.toolboxContainer');
  },
  /**
   * Builds the tools elements
   * Combines the cached DOM elements
   */
  buildTool() {
    const {
      $refreshButt,
      $refresh,
      $refreshButtContainer,
      $FAtoggle,
      $refreshCheckbox,
      $refreshContainer,
      $refreshTitle,
    } = this.config;

    $refreshButt.html($refresh);
    $refreshButtContainer.html($refreshButt);
    // add icon to mock button
    $refreshCheckbox.append($FAtoggle);

    // add mock button to container
    $refreshContainer
      .append($refreshCheckbox)
      .append($refreshTitle);
  },
  /**
   * Adds the combined tool elements to the tool container on the DOM
   */
  addTool() {
    const {
      $refreshContainer,
      $refreshButtContainer
    } = this.config;

    this.$togglesPanel.append($refreshContainer);
    this.$togglesContainer.append($refreshButtContainer);
  },
  /**
   * Attaches the event listeners that will provide the tools functionality
   */
  bindEvents() {
    const {
      $refreshButt,
      $refreshContainer,
      $refreshTitle,
    } = this.config;

    // bind click event to reload the page
    $refreshButt.on('click', this.reloadPage);

    // bind toggle event
    $refreshContainer.on('click', this.flipTheSwitch.bind(this));

    // apply mouse over hover effect for display text
    $refreshTitle.on('mouseover', () => {
      $refreshTitle.fadeOut(250, () => {
        $refreshTitle.text('Refresh Button')
          .fadeIn(500);
      })
    });

    // apply mouse out hover effect for display text
    $refreshTitle.on('mouseout', () => {
      $refreshTitle.fadeOut(250, () => {
        $refreshTitle.text('Refresh')
          .fadeIn(500);
      })
    });
  },
  /**
   * Sets the state of the toggle to the last saved state loaded from
   * local storage
   */
  setToggle() {
    const {
      $refreshButtContainer,
    } = this.config;

    // get value of custom variable and set toggles accordingly
    if (shared.getValue('useRefreshButton')) {
      this.toggleOn();
      $refreshButtContainer.show();
    } else {
      this.toggleOff();
      $refreshButtContainer.hide();
    }
  },
  // ----------------------------------------
  // tier 2 functions
  // ----------------------------------------
  /**
   * reloads the page
   */
  reloadPage() {
    window.location.reload(true);
  },
  /**
   * Sets the saved variable to the opposite of what it is currently
   * and updates the DOM toggle element
   */
  flipTheSwitch() {
    const toggle = shared.getValue('useRefreshButton');
    shared.saveValue('useRefreshButton', !toggle);

    // set toggle
    this.setToggle();
  },
  /**
   * Changed the DOM toggle to the ON state
   */
  toggleOn() {
    const {
      $FAtoggle
    } = this.config;

    const faPrefix = 'fa-';
    // set toggle on image
    const $toggle = $FAtoggle;
    $toggle.removeClass(`${faPrefix}toggle-off`);
    $toggle.addClass(`${faPrefix}toggle-on`);
  },
  /**
   * Changed the DOM toggle to the OFF state
   */
  toggleOff() {
    const {
      $FAtoggle
    } = this.config;

    const faPrefix = 'fa-';
    // set toggle off image
    const $toggle = $FAtoggle;
    $toggle.removeClass(`${faPrefix}toggle-on`);
    $toggle.addClass(`${faPrefix}toggle-off`);
  },
};
