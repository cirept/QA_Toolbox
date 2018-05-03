const toggles = {
  init() {
    // initialize module
    this.createElements();
    this.buildPanel();
    this.cacheDOM();
    this.addTool();
    this.bindEvents();
    shared.displayPanel(toggles.config.$togglesPanel);
  },
  createElements() {
    toggles.config = {
      // ----------------------------------------
      // Toggle Tools Panel
      // ----------------------------------------
      $togglesContainer: jQuery('<div>')
        .attr({
          class: 'toolBox',
          id: 'togglesContainer',
        }),
      $togglesPanel: jQuery('<div>')
        .attr({
          class: 'toolsPanel',
          id: 'toggleTools',
        }),
      $togglesTitle: jQuery('<div>')
        .attr({
          class: 'panelTitle',
          id: 'togglesTitle',
          title: 'Click to Minimize/Maximize',
        })
        .text('Toggles'),
    };
  },
  buildPanel() {
    // attach to continer
    toggles.config.$togglesContainer
      .append(toggles.config.$togglesTitle)
      .append(toggles.config.$togglesPanel);
  },
  cacheDOM() {
    // DOM elements
    this.$toolBoxContainer = jQuery('.toolboxContainer');
    this.variableList = shared.programData();
  },
  addTool() {
    // add to main toolbox
    this.$toolBoxContainer
      .append(toggles.config.$togglesContainer);
  },
  bindEvents() {
    // minimize
    toggles.config.$togglesTitle
      .on('click', shared.toggleFeature)
      .on('click', shared.saveState);
  },
};
