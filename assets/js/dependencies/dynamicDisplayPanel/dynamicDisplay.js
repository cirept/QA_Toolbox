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
    this.config = {
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
        .text(`ver. ${GM_info.script.version}`), // eslint-disable-line camelcase
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
          '<span class="fa-stack fa-2x"><i class="fa fa-circle fa-stack-1x fa-inverse"></i><i class="fa fa-times-circle fa-stack-1x fa-lg"></i></span>'
        )
        .attr({
          title: 'Click to Hide Toolbox',
        }),
    };
  },
  buildPanel() {
    // attach panel elements to container
    this.config.$changeLog
      .append(this.config.$changeLogLink);

    this.config.$displayArea
      .append(this.config.$version)
      .append(this.config.$changeLog);

    this.config.$displayPanel.append(this.config.$displayArea);
    // attach icon to minimize tab
    this.config.$showToolbox.append(this.config.$icon);
    // attach icon to minimize tab
    this.config.$hideToolbox.append(this.config.$minimizeIcon);
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
    this.$toolBoxContainer.append(this.config.$displayPanel);
    this.$toolBoxContainer.before(this.config.$showToolbox);
    this.$toolBoxContainer.append(this.config.$hideToolbox);
  },
  modToolbar() {
    if (shared.nextGenCheck()) {
      this.toolbox.addClass('nextgen');
      this.$toolBoxContainer.addClass('nextgen');
      this.edoButts.addClass('nextgen');
      this.lenendContainer.addClass('nextgen');
      this.config.$hideToolbox.addClass('nextgen');
      this.config.$showToolbox.addClass('nextgen');
      this.config.$displayPanel.addClass('nextgen');
    } else {
      this.toolbox.addClass('tetra');
      this.edoButts.addClass('tetra');
      this.lenendContainer.addClass('tetra');
      this.config.$hideToolbox.addClass('tetra');
      this.config.$showToolbox.addClass('tetra');
      this.config.$displayPanel.addClass('tetra');
    }
  },
  bindEvents() {
    // click
    this.config.$hideToolbox
      .on('click', this.toggleTools.bind(this))
      .on('click', this.saveState);
    this.config.$showToolbox
      .on('click', this.toggleTools.bind(this))
      .on('click', this.saveState);
    this.config.$changeLog
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
          shared.setDisplayState(this.$toolBoxContainer, state);
          // set display of hide/show button to opposite of main toolbox
          this.config.$showToolbox.addClass(variables[key] ?
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
    this.config.$showToolbox.toggle('fade', 500);
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
