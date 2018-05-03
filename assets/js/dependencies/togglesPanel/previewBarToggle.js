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
  createElements() {
    previewBarToggle.config = {
      $previewBarToggleContainer: jQuery('<div>')
        .attr({
          id: 'previewBarToggleInput',
          class: 'toggleTool',
          title: 'hides PCE toolbar',
        }),
      $previewBarToggleTitle: jQuery('<div>')
        .text('hide preview toolbar?'),
      $previewBarToggleIcon: jQuery('<div>')
        .attr({
          id: 'previewBarToggleIcon',
        }),
      $FAtoggle: jQuery('<i class="fa fa-toggle-off fa-lg"></i>'),
      varName: 'hidePreviewToolbar',
    };
  },
  buildTool() {
    previewBarToggle.config.$previewBarToggleIcon
      .append(previewBarToggle.config.$FAtoggle);
    previewBarToggle.config.$previewBarToggleContainer
      .append(previewBarToggle.config.$previewBarToggleTitle)
      .append(previewBarToggle.config.$previewBarToggleIcon);
  },
  setToggle() {
    // get value of custom variable and set toggles accordingly
    const varName = previewBarToggle.config.varName;
    const storedValue = shared.getValue(varName);

    if (storedValue) {
      this.toggleOn();
      this.togglePreviewToolbar();
    } else {
      this.toggleOff();
      this.togglePreviewToolbar();
    }
  },
  cacheDOM(callingPanel) {
    this.$toolsPanel = jQuery(callingPanel);
    this.$toolboxStyles = jQuery('#qa_toolbox');
  },
  addTool() {
    // add to main toolbox
    this.$toolsPanel
      .append(previewBarToggle.config.$previewBarToggleContainer);
  },
  bindEvents() {
    // bind FA toggle with 'flipTheSwitch' action
    previewBarToggle.config.$previewBarToggleContainer
      .on('click', this.flipTheSwitch.bind(this))
      .on('click', '#previewToolBarFrame', this.togglePreviewToolbar);
  },
  hideFeature() {
    // hides feature if viewing live site
    if (this.siteState() === 'LIVE') {
      previewBarToggle.config.$previewBarToggleContainer.toggle();
    }
  },
  // ----------------------------------------
  // tier 2 functions
  // ----------------------------------------
  toggleOn() {
    // set toggle on image
    const $toggle = previewBarToggle.config.$FAtoggle;
    $toggle
      .removeClass('fa-toggle-off')
      .addClass('fa-toggle-on');
  },
  togglePreviewToolbar() {
    const varName = previewBarToggle.config.varName;
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
  toggleOff() {
    // set toggle off image
    const $toggle = previewBarToggle.config.$FAtoggle;
    $toggle.removeClass('fa-toggle-on');
    $toggle.addClass('fa-toggle-off');
  },
  flipTheSwitch() {
    const varName = previewBarToggle.config.varName;
    const storedValue = shared.getValue(varName);
    // set saved variable to opposite of current value
    shared.saveValue(varName, !storedValue);
    // set toggle
    this.setToggle();
  },
};
