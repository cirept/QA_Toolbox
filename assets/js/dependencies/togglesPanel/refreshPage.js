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
    refreshPage.config = {
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
          title: 'Refresh Page from Server ',
        }),
      $refresh: jQuery(
        '<i class="fa fa-undo fa-flip-horizontal fa-3x">&nbsp;</i>'),
      $refreshTitle: jQuery('<div>')
        .text('Refresh Button'),
      $refreshCheckbox: jQuery('<div>')
        .attr({
          id: 'refreshMetoggle',
          title: 'toggle refresh button',
        }),
      $FAtoggle: jQuery('<i class="fa fa-toggle-off fa-lg"></i>'),
    };
  },
  cacheDOM(callingPanel) {
    this.$togglesPanel = jQuery(callingPanel);
    this.$togglesContainer = jQuery('.toolboxContainer');
  },
  buildTool() {
    refreshPage.config.$refreshButt
      .html(refreshPage.config.$refresh);
    refreshPage.config.$refreshButtContainer
      .html(refreshPage.config.$refreshButt);
    // add icon to mock button
    refreshPage.config.$refreshCheckbox
      .append(refreshPage.config.$FAtoggle);
    // add mock button to container
    refreshPage.config.$refreshContainer
      .append(refreshPage.config.$refreshTitle)
      .append(refreshPage.config.$refreshCheckbox);
  },
  addTool() {
    this.$togglesPanel
      .append(refreshPage.config.$refreshContainer);
    this.$togglesContainer
      .append(refreshPage.config.$refreshButtContainer);
  },
  bindEvents() {
    refreshPage.config.$refreshButt.on('click', this.reloadPage);
    refreshPage.config.$refreshContainer.on('click', this.flipTheSwitch
      .bind(this));
  },
  setToggle() {
    // get value of custom variable and set toggles accordingly
    if (shared.getValue('useRefreshButton')) {
      this.toggleOn();
      refreshPage.config.$refreshButtContainer.show();
    } else {
      this.toggleOff();
      refreshPage.config.$refreshButtContainer.hide();
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
    // set toggle on image
    const $toggle = refreshPage.config.$FAtoggle;
    $toggle.removeClass('fa-toggle-off');
    $toggle.addClass('fa-toggle-on');
  },
  toggleOff() {
    // set toggle off image
    const $toggle = refreshPage.config.$FAtoggle;
    $toggle.removeClass('fa-toggle-on');
    $toggle.addClass('fa-toggle-off');
  },
};
