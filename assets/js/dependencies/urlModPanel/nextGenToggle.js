const nextGenToggle = {
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
  buildTool() {
    this.config.$nextGenTogIcon
      .append(this.config.$FAtoggle);
    this.config.$nextGenTogContainer
      .append(this.config.$nextGenTogIcon)
      .append(this.config.$nextGenTogTitle);
  },
  cacheDOM(callingPanel) {
    this.$toolsPanel = jQuery(callingPanel);
  },
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
  addTool() {
    // add to main toolbox
    this.$toolsPanel.append(this.config.$nextGenTogContainer);
  },
  bindEvents() {
    // bind FA toggle with 'flipTheSwitch' action
    this.config.$nextGenTogContainer.on('click', this.flipTheSwitch
      .bind(this));
  },
  // ----------------------------------------
  // tier 2 functions
  // ----------------------------------------
  toggleOn() {
    // set toggle on image
    const $toggle = this.config.$FAtoggle;
    $toggle
      .removeClass('fa-toggle-off')
      .addClass('fa-toggle-on');
  },
  toggleOff() {
    // set toggle off image
    const $toggle = this.config.$FAtoggle;
    $toggle
      .removeClass('fa-toggle-on')
      .addClass('fa-toggle-off');
  },
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
