const refreshPage = {
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
  createElements() {
    this.config = {
      $refreshContainer: jQuery('<div>')
        .attr({
          id: 'refreshMe',
          class: 'toggleTool',
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
        '<i class="fas fa-redo-alt fa-3x"></i>'),
      $refreshTitle: jQuery('<div>')
        .text('Refresh Button'),
      $refreshCheckbox: jQuery('<div>')
        .attr({
          id: 'refreshMetoggle',
          title: 'toggle refresh button',
        }),
      $FAtoggle: jQuery('<i class="fas toggle-off fa-lg"></i>'),
    };
  },
  cacheDOM(callingPanel) {
    this.$togglesPanel = jQuery(callingPanel);
    this.$togglesContainer = jQuery('.toolboxContainer');
  },
  buildTool() {
    this.config.$refreshButt.html(this.config.$refresh);
    this.config.$refreshButtContainer.html(this.config.$refreshButt);
    // add icon to mock button
    this.config.$refreshCheckbox.append(this.config.$FAtoggle);
    // add mock button to container
    this.config.$refreshContainer
      .append(this.config.$refreshCheckbox)
      .append(this.config.$refreshTitle);
  },
  addTool() {
    this.$togglesPanel.append(this.config.$refreshContainer);
    this.$togglesContainer.append(this.config.$refreshButtContainer);
  },
  bindEvents() {
    this.config.$refreshButt.on('click', this.reloadPage);
    this.config.$refreshContainer.on('click', this.flipTheSwitch.bind(this));
  },
  setToggle() {
    // get value of custom variable and set toggles accordingly
    if (shared.getValue('useRefreshButton')) {
      this.toggleOn();
      this.config.$refreshButtContainer.show();
    } else {
      this.toggleOff();
      this.config.$refreshButtContainer.hide();
    }
  },
  // ----------------------------------------
  // tier 2 functions
  // ----------------------------------------
  reloadPage() {
    window.location.reload(true);
  },
  flipTheSwitch() {
    // set saved variable to opposite of current value
    const toggle = shared.getValue('useRefreshButton');
    shared.saveValue('useRefreshButton', !toggle);

    // set toggle
    this.setToggle();
  },
  toggleOn() {
    const faPrefix = 'fa-';
    // set toggle on image
    const $toggle = this.config.$FAtoggle;
    $toggle.removeClass(`${faPrefix}toggle-off`);
    $toggle.addClass(`${faPrefix}toggle-on`);
  },
  toggleOff() {
    const faPrefix = 'fa-';
    // set toggle off image
    const $toggle = this.config.$FAtoggle;
    $toggle.removeClass(`${faPrefix}toggle-on`);
    $toggle.addClass(`${faPrefix}toggle-off`);
  },
};
