const previewBarToggle = {
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
      $previewBarToggleContainer: jQuery('<div>')
        .attr({
          id: 'previewBarToggleInput',
          class: 'toggleTool',
          title: 'toggles PCE toolbar',
        }),
      $previewBarToggleTitle: jQuery('<div>')
        .text('hide toolbar?'),
      $previewBarToggleIcon: jQuery('<div>')
        .attr({
          id: 'previewBarToggleIcon',
        }),
      $FAtoggle: jQuery('<i class="fa fa-toggle-off fa-lg"></i>'),
      varName: 'hidePreviewToolbar',
    };
  },
  /**
   * Builds the tools elements
   * Combines the cached DOM elements
   */
  buildTool() {
    const {
      $previewBarToggleIcon,
      $FAtoggle,
      $previewBarToggleContainer,
      $previewBarToggleTitle,
    } = this.config;

    $previewBarToggleIcon
      .append($FAtoggle);
    $previewBarToggleContainer
      .append($previewBarToggleIcon)
      .append($previewBarToggleTitle);
  },
  /**
   * Sets the state of the toggle to the last saved state loaded from
   * local storage
   */
  setToggle() {
    // get value of custom variable and set toggles accordingly
    const varName = this.config.varName;
    const storedValue = shared.getValue(varName);

    if (storedValue) {
      this.toggleOn();
      this.togglePreviewToolbar();
    } else {
      this.toggleOff();
      this.togglePreviewToolbar();
    }
  },
  /**
   * Caches things from the DOM that the tool will use.
   * @param {object} callingPanel - the panel that this tool is located in
   */
  cacheDOM(callingPanel) {
    this.$toolsPanel = jQuery(callingPanel);
    this.$toolboxStyles = jQuery('#qa_toolbox');
  },
  /**
   * Adds the combined tool elements to the tool container on the DOM
   */
  addTool() {
    // add to main toolbox
    this.$toolsPanel
      .append(this.config.$previewBarToggleContainer);
  },
  /**
   * Attaches the event listeners that will provide the tools functionality
   */
  bindEvents() {
    const {
      $previewBarToggleContainer,
      $previewBarToggleTitle,
    } = this.config;

    // bind FA toggle with 'flipTheSwitch' action
    $previewBarToggleContainer
      .on('click', this.flipTheSwitch.bind(this))
      .on('click', '#previewToolBarFrame', this.togglePreviewToolbar);

    // apply mouse over hover effect for display text
    $previewBarToggleTitle.on('mouseover', () => {
      $previewBarToggleTitle.fadeOut(250, () => {
        $previewBarToggleTitle.text('Hide Preview Toolbar?')
          .fadeIn(500);
      })
    });
    // apply mouse out hover effect for display text
    $previewBarToggleTitle.on('mouseout', () => {
      $previewBarToggleTitle.fadeOut(250, () => {
        $previewBarToggleTitle.text('Hide Toolbar?')
          .fadeIn(500);
      })
    });
  },
  hideFeature() {
    // hides feature if viewing live site
    if (this.siteState() === 'LIVE') {
      this.config.$previewBarToggleContainer.toggle();
    }
  },
  // ----------------------------------------
  // tier 2 functions
  // ----------------------------------------
  /**
   * Changed the DOM toggle to the ON state
   */
  toggleOn() {
    // set toggle on image
    const $toggle = this.config.$FAtoggle;
    $toggle
      .removeClass('fa-toggle-off')
      .addClass('fa-toggle-on');
  },
  /**
   * Toggles the CDK preview toolbar by adding or removing CSS values from
   * the DOM
   */
  togglePreviewToolbar() {
    const varName = this.config.varName;
    const hidePreviewToolbar = shared.getValue(varName);

    // if 'hidePreviewToolbar is toggled ON'
    if (hidePreviewToolbar) {
      this.$toolboxStyles
        .append(' #previewToolBarFrame { display: none; }') // ;
        // this.$toolboxStyles
        .append(' .preview-wrapper { display: none; }');
    } else {
      this.$toolboxStyles
        .append(' #previewToolBarFrame { display: block; }') // ;
        // this.$toolboxStyles
        .append(' .preview-wrapper { display: block; }');
    }
  },
  /**
   * Changed the DOM toggle to the OFF state
   */
  toggleOff() {
    // set toggle off image
    const $toggle = this.config.$FAtoggle;
    $toggle.removeClass('fa-toggle-on');
    $toggle.addClass('fa-toggle-off');
  },
  /**
   * Sets the saved variable to the opposite of what it is currently
   * and updates the DOM toggle element
   */
  flipTheSwitch() {
    const varName = this.config.varName;
    const storedValue = shared.getValue(varName);
    // set saved variable to opposite of current value
    shared.saveValue(varName, !storedValue);
    // set toggle
    this.setToggle();
  },
};
