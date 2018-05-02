const otherTools = {
  init() {
    // initialize module
    this.createElements();
    this.buildPanel();
    this.cacheDOM();
    this.addTool();
    this.bindEvents();
    shared.displayPanel(otherTools.config.$otherToolsPanel);
  },
  createElements() {
    otherTools.config = {
      // ----------------------------------------
      // QA Tools Panel
      // ----------------------------------------
      $otherToolsContainer: jQuery('<div>')
        .attr({
          class: 'toolBox',
          id: 'otherToolsContainer',
        }),
      $otherToolsPanel: jQuery('<div>')
        .attr({
          class: 'toolsPanel',
          id: 'otherTools',
        }),
      $otherToolsTitle: jQuery('<div>')
        .attr({
          class: 'panelTitle',
          id: 'otherToolsTitle',
          title: 'Click to Minimize/Maximize',
        })
        .text('Other Tools'),
    };
  },
  buildPanel() {
    // attach to continer
    otherTools.config.$otherToolsContainer
      .append(otherTools.config.$otherToolsTitle)
      .append(otherTools.config.$otherToolsPanel);
  },
  cacheDOM() {
    // DOM elements
    this.$toolBoxContainer = jQuery('.toolboxContainer');
    this.variableList = shared.programData();
  },
  addTool() {
    // add to main toolbox
    this.$toolBoxContainer
      .append(otherTools.config.$otherToolsContainer);
  },
  bindEvents() {
    // minimize
    otherTools.config.$otherToolsTitle
      .on('click', shared.toggleFeature)
      .on('click', shared.saveState);
  },
};
