const qaTools = {
  init() {
    // initialize module
    this.createElements();
    this.buildPanel();
    this.cacheDOM();
    this.addTool();
    this.bindEvents();
    shared.displayPanel(qaTools.config.$mainToolsPanel);
  },
  createElements() {
    qaTools.config = {
      // ----------------------------------------
      // QA Tools Panel
      // ----------------------------------------
      $mainToolsContainer: jQuery('<div>')
        .attr({
          class: 'toolBox',
          id: 'mainToolsContainer',
        }),
      $mainToolsPanel: jQuery('<div>')
        .attr({
          class: 'toolsPanel',
          id: 'mainTools',
        }),
      $mainToolsTitle: jQuery('<div>')
        .attr({
          class: 'panelTitle',
          id: 'mainToolsTitle',
          title: 'Click to Minimize/Maximize',
        })
        .text('QA Tools'),
    };
  },
  buildPanel() {
    // attach to continer
    qaTools.config.$mainToolsContainer
      .append(qaTools.config.$mainToolsTitle)
      .append(qaTools.config.$mainToolsPanel);
  },
  cacheDOM() {
    // DOM elements
    this.$toolBoxContainer = jQuery('.toolboxContainer');
    this.variableList = shared.programData();
  },
  addTool() {
    // add to main toolbox
    this.$toolBoxContainer
      .append(qaTools.config.$mainToolsContainer);
  },
  bindEvents() {
    // minimize
    qaTools.config.$mainToolsTitle
      .on('click', shared.toggleFeature)
      .on('click', shared.saveState);
  },
};
