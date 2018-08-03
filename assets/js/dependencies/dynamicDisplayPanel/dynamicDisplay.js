const dynamicDisplay = {
  init() {
    this.createElements();
    this.buildPanel();
    this.cacheDOM();
    this.addTool();
    this.modToolbar();
    this.bindEvents();
    this.displayPanel();
  },
  createElements() {
    // main panel container
    dynamicDisplay.config = {
      $displayPanel: jQuery('<div>')
        .attr({
          class: 'toolBox',
          id: 'displayPanel',
        }),
      // panel title
      $displayTitle: jQuery('<div>')
        .attr({
          class: 'panelTitle',
        }),
      // display area
      $displayArea: jQuery('<div>')
        .attr({
          id: 'displayArea',
        }),
      // toolbox version
      $version: jQuery('<div>')
        .attr({
          id: 'version',
        })
        .text(`version: ${GM_info.script.version}`), // eslint-disable-line camelcase
      $changeLog: jQuery('<div>')
        .attr({
          id: 'changeLog',
        }),
      $changeLogLink: jQuery('<a>')
        .attr({
          href: '#',
          title: 'View latest changes',
        })
        .text('Change Log'),
      // toolbox show button
      $showToolbox: jQuery('<div>')
        .attr({
          class: 'showToolbox',
          title: 'Show Toolbox',
        }),
      // font awesome icon
      $icon: jQuery('<i class="fa fa-power-off fa-2x"></i>'),
      $hideToolbox: jQuery('<div>')
        .attr({
          class: 'hideToolbox',
        }),
      $minimizeIcon: jQuery(
          '<span class="fa-stack fa-2x"><i class="fa fa-circle fa-stack-1x fa-inverse"></i><i class="fa fa-times-circle fa-stack-1x"></i></span>'
        )
        .attr({
          title: 'Click to Hide Toolbox',
        }),
    };
  },
  buildPanel() {
    // attach panel elements to container
    dynamicDisplay.config.$changeLog
      .append(dynamicDisplay.config.$changeLogLink);

    dynamicDisplay.config.$displayArea
      .append(dynamicDisplay.config.$version)
      .append(dynamicDisplay.config.$changeLog);

    dynamicDisplay.config.$displayPanel.append(dynamicDisplay.config.$displayArea);
    // attach icon to minimize tab
    dynamicDisplay.config.$showToolbox.append(dynamicDisplay.config.$icon);
    // attach icon to minimize tab
    dynamicDisplay.config.$hideToolbox.append(dynamicDisplay.config.$minimizeIcon);
  },
  cacheDOM() {
    // page info
    this.$toolBoxContainer = jQuery('#showToolbox');
    this.variableList = shared.programData();
    // additions
    this.toolbox = jQuery('.toolBox');
    this.toolboxContain = jQuery('.toolboxContainer');
    this.edoButts = jQuery('.myEDOBut');
    this.lenendContainer = jQuery('.legendContainer');
  },
  addTool() {
    // add to main toolbox
    this.$toolBoxContainer.append(dynamicDisplay.config.$displayPanel);
    this.$toolBoxContainer.before(dynamicDisplay.config.$showToolbox);
    this.$toolBoxContainer.append(dynamicDisplay.config.$hideToolbox);
  },
  modToolbar() {
    if (shared.nextGenCheck()) {
      this.toolbox.addClass('nextgen');
      this.$toolBoxContainer.addClass('nextgen');
      this.edoButts.addClass('nextgen');
      this.lenendContainer.addClass('nextgen');
      dynamicDisplay.config.$hideToolbox.addClass('nextgen');
      dynamicDisplay.config.$showToolbox.addClass('nextgen');
      dynamicDisplay.config.$displayPanel.addClass('nextgen');
    } else {
      this.toolbox.addClass('tetra');
      this.edoButts.addClass('tetra');
      this.lenendContainer.addClass('tetra');
      dynamicDisplay.config.$hideToolbox.addClass('tetra');
      dynamicDisplay.config.$showToolbox.addClass('tetra');
      dynamicDisplay.config.$displayPanel.addClass('tetra');
    }
  },
  bindEvents() {
    // click
    dynamicDisplay.config.$hideToolbox
      .on('click', this.toggleTools.bind(this))
      .on('click', this.saveState);
    dynamicDisplay.config.$showToolbox
      .on('click', this.toggleTools.bind(this))
      .on('click', this.saveState);
    dynamicDisplay.config.$changeLog
      .on('click', main.showChangeLog);
  },
  displayPanel() {
    // loop through variable list to find the panel title
    const variables = this.variableList;
    let state = '';
    let key = '';
    for (key in variables) {
      if (variables.hasOwnProperty(key)) {
        if (key === 'showToolbox') {
          state = variables[key] ? 'show' : 'hide';
          shared.setState(this.$toolBoxContainer, state);
          // set display of hide/show button to opposite of main toolbox
          dynamicDisplay.config.$showToolbox.addClass(variables[key] ?
            'disappear' : 'appear');
        }
      }
    }
  },
  // ----------------------------------------
  // tier 2
  // ----------------------------------------
  toggleTools() {
    // hide / show main tool box
    this.toggleBox();
    // hide / show toggle button
    dynamicDisplay.config.$showToolbox.toggle('fade', 500);
  },
  saveState() {
    // get current state
    const vName = 'showToolbox';
    const currState = shared.getValue(vName, false);

    // sets usingM4 value
    shared.saveValue(vName, !currState);
  },
  // ----------------------------------------
  // tier 3
  // ----------------------------------------
  toggleBox() {
    this.$toolBoxContainer.toggle('fade', 500);
  },
};
