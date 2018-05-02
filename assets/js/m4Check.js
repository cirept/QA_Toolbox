const m4Check = {
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
    m4Check.config = {
      $m4Container: jQuery('<div>')
        .attr({
          id: 'm4Input',
          class: 'toggleTool',
          title: 'Apply relative and comments parameters',
        }),
      $m4CheckTitle: jQuery('<div>')
        .text('M4 Parameters?'),
      $m4Checkbox: jQuery('<div>')
        .attr({
          id: 'm4toggle',
        }),
      $FAtoggle: jQuery('<i class="fa fa-toggle-off fa-lg"></i>'),
    };
  },
  buildTool() {
    m4Check.config.$m4Checkbox
      .append(m4Check.config.$FAtoggle);
    m4Check.config.$m4Container
      .append(m4Check.config.$m4CheckTitle)
      .append(m4Check.config.$m4Checkbox);
  },
  setToggle() {
    if (shared.getValue('usingM4')) { // if 'usingM4 is turned on'
      // set toggle and apply parameters
      this.toggleOn();
    } else { // if 'site is not live'
      // set toggle and apply parameters
      this.toggleOff();
    }
  },
  cacheDOM(callingPanel) {
    this.$toolsPanel = jQuery(callingPanel);
  },
  addTool() {
    // add to main toolbox
    this.$toolsPanel
      .append(m4Check.config.$m4Container);
  },
  bindEvents() {
    // bind FA toggle with 'flipTheSwitch' action
    m4Check.config.$m4Container.on('click', this.flipTheSwitch.bind(this));
  },
  // ----------------------------------------
  // tier 2 functions
  // ----------------------------------------
  toggleOn() {
    // set toggle on image
    const $toggle = m4Check.config.$FAtoggle;
    $toggle
      .removeClass('fa-toggle-off')
      .addClass('fa-toggle-on');
  },
  toggleOff() {
    // set toggle off image
    const $toggle = m4Check.config.$FAtoggle;
    $toggle
      .removeClass('fa-toggle-on')
      .addClass('fa-toggle-off');
  },
  flipTheSwitch() {
    // set saved variable to opposite of current value
    const toggle = shared.getValue('usingM4');
    shared.saveValue('usingM4', !toggle);

    // set toggle
    this.setToggle();
  },
  // ----------------------------------------
  // tier 3 functions
  // ----------------------------------------
  hasParameters() {
    // determine if site URL already has custom parameters
    if (window.location.href.indexOf('&comments=true&relative=true') >=
      0) {
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
    return shared.getValue('usingM4');
  },
};

// ----------------------------------------
//  autofill toggle
// ----------------------------------------
const autofillToggle = {
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
    autofillToggle.config = {
      $autofillTogContainer: jQuery('<div>')
        .attr({
          id: 'autofillToggleInput',
          class: 'toggleTool',
          title: 'Show all autofill tags on page',
        }),
      $autofillTogTitle: jQuery('<div>')
        .text('show autofill tags?'),
      $autofillTogIcon: jQuery('<div>')
        .attr({
          id: 'autofillToggleIcon',
        }),
      $FAtoggle: jQuery('<i class="fa fa-toggle-off fa-lg"></i>'),
    };
  },
  buildTool() {
    autofillToggle.config.$autofillTogIcon
      .append(autofillToggle.config.$FAtoggle);
    autofillToggle.config.$autofillTogContainer
      .append(autofillToggle.config.$autofillTogTitle)
      .append(autofillToggle.config.$autofillTogIcon);
  },
  setToggle() {
    if (shared.getValue('applyAutofill')) { // if 'applyAutofill is turned on'
      // set toggle and apply parameters
      this.toggleOn();
    } else { // if 'site is not live'
      // set toggle and apply parameters
      this.toggleOff();
    }
  },
  cacheDOM(callingPanel) {
    this.$toolsPanel = jQuery(callingPanel);
  },
  addTool() {
    // add to main toolbox
    this.$toolsPanel
      .append(autofillToggle.config.$autofillTogContainer);
  },
  bindEvents() {
    // bind FA toggle with 'flipTheSwitch' action
    autofillToggle.config.$autofillTogContainer.on('click', this.flipTheSwitch
      .bind(this));
  },
  // ----------------------------------------
  // tier 2 functions
  // ----------------------------------------
  toggleOn() {
    // set toggle on image
    const $toggle = autofillToggle.config.$FAtoggle;
    $toggle
      .removeClass('fa-toggle-off')
      .addClass('fa-toggle-on');
  },
  toggleOff() {
    // set toggle off image
    const $toggle = autofillToggle.config.$FAtoggle;
    $toggle
      .removeClass('fa-toggle-on')
      .addClass('fa-toggle-off');
  },
  flipTheSwitch() {
    // set saved variable to opposite of current value
    const toggle = shared.getValue('applyAutofill');
    shared.saveValue('applyAutofill', !toggle);

    // set toggle
    this.setToggle();
  },
  // ----------------------------------------
  // tier 3 functions
  // ----------------------------------------
  hasParameters() {
    if (window.location.href.indexOf('disableAutofill=') >= 0) {
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
    return shared.getValue('applyAutofill');
  },
};
