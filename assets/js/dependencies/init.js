const main = {
  init() {
    this.cacheDOM();
    this.checkEnvironment();
    this.createElements();
    this.attachResources();
    this.toolContainer();
    this.pageInfoPanel();
    this.qaToolsPanel();
    this.otherToolsPanel();
    this.togglesPanel();
    this.urlModPanel();
    this.dynamicPanel();
    this.stylePanels();
    this.jQueryUIedits();
  },
  cacheDOM() {
    this.contextManager = unsafeWindow.ContextManager;
    this.phoneWrapper = jQuery('body .phone-wrapper');
    this.head = jQuery('head');
  },
  checkEnvironment() {
    this.editMode();
    this.isCDKsite();
    this.isMobile();
  },
  createElements() {
    main.config = {
      $toolboxStyles: jQuery('<style></style>')
        .attr({
          id: 'qa_toolbox',
          type: 'text/css',
        }),
      $myFont: jQuery('<link>')
        .attr({
          id: 'toolFont',
          href: 'https://fonts.googleapis.com/css?family=Montserrat',
          rel: 'stylesheet',
        }),
      $fontAw: jQuery('<link>')
        .attr({
          id: 'fontAwe',
          href: 'https://cdn.rawgit.com/cirept/QA_Toolbox/master/resources/font-awesome-4.7.0/css/font-awesome.css',
          rel: 'stylesheet',
        }),
      $jQueryUIcss: jQuery('<link>')
        .attr({
          id: 'jqueryUI',
          href: 'https://cdn.rawgit.com/cirept/QA_Toolbox/master/resources/jquery-ui-1.12.1.custom/jquery-ui.min.css',
          rel: 'stylesheet',
        }),
      $toolStyles: jQuery('<link>')
        .attr({
          id: 'mycss',
          href: shared.getResourceUrl('toolStyles'), // eslint-disable-line camelcase
          rel: 'stylesheet',
          type: 'text/css',
        }),
      $animate: jQuery('<link>')
        .attr({
          id: 'animate',
          href: 'https://rawgit.com/cirept/animate.css/master/animate.css',
          rel: 'stylesheet',
        }),
    };
  },
  attachResources() {
    this.head
      .append(main.config.$toolboxStyles)
      .append(main.config.$myFont)
      .append(main.config.$jQueryUIcss)
      .append(main.config.$toolStyles)
      .append(main.config.$mycss)
      .append(main.config.$fontAw)
      .append(main.config.$animate);
  },
  toolContainer() {
    qaToolbox.init();
  },
  pageInfoPanel() {
    pageInformation.init();
  },
  qaToolsPanel() {
    const panelID = '#mainTools';
    qaTools.init();
    imageChecker.init(panelID);
    linkChecker.init(panelID);
    spellCheck.init(panelID);
    speedtestPage.init(panelID);
    checkLinks.init(panelID);
  },
  otherToolsPanel() {
    const panelID = '#otherTools';
    otherTools.init();
    showNavigation.init(panelID);
    seoSimplify.init(panelID);

    // add tetra specific tool to panel
    if (!shared.nextGenCheck()) {
      widgetOutlines.init(panelID);
      viewMobile.init(panelID);
    }
  },
  togglesPanel() {
    const panelID = '#toggleTools';
    toggles.init();
    refreshPage.init(panelID);
    previewBarToggle.init(panelID);
  },
  urlModPanel() {
    const panelID = '#urlModTools';
    urlModifiers.init();
    nextGenToggle.init(panelID);
    autofillToggle.init(panelID);

    // add tetra specific tool to panel
    if (!shared.nextGenCheck()) {
      m4Check.init(panelID);
    }
  },
  dynamicPanel() {
    dynamicDisplay.init();
  },
  stylePanels() {
    this.styleButtons(qaTools.config.$mainToolsPanel);
    this.styleButtons(otherTools.config.$otherToolsPanel);
    this.wrapText(qaToolbox.config.$toolboxContainer);
  },
  isCDKsite() {
    try {
      // get version of CDK site
      // if value does not exist, shut the toolbar down
      if (this.contextManager.getVersion()
        .length === 0) {
        throw new Error('Shutting toolbox down');
      }
    } catch (e) {
      // get version of site
      // if contextManager object does not exist, shut the toolbar down
      throw new Error('Shutting toolbox down');
    }
  },
  isMobile() {
    // determines if the page being viewed is meant for mobile
    if (this.phoneWrapper.length > 0) {
      throw new Error('Shutting toolbox down');
    }
  },
  editMode() {
    // determines if site is in edit mode in WSM (this variable should only exist on CDK sites)
    if (unsafeWindow.editMode === true) {
      throw new Error('Shutting toolbox down');
    }
  },
  styleButtons($toolPanel) {
    // add class to buttons for styling
    $toolPanel.children('.myEDOBut:even')
      .addClass('evenEDObutts');
    $toolPanel.children('.myEDOBut:odd')
      .addClass('oddEDObutts');
  },
  wrapText($toolPanel) {
    // wrapping interior text in order style text.
    // allows override of the !important tags used by CDK bundles.css
    $toolPanel.find('.myEDOBut')
      .wrapInner('<span></span>');
  },
  jQueryUIedits() {
    // should only show the changelog when the user first uses program
    // should also show when the user updates.
    if (!shared.getValue('hideChangeLog')) {
      this.showChangeLog();
    }
  },
  showChangeLog() {
    qaToolbox.config.$changeLogDisplay.dialog({
      width: 1000,
      title: 'Change Log',
      buttons: [{
        text: 'Close',
        icon: 'ui-icon-heart',
        click() {
          shared.saveValue('hideChangeLog', true);
          jQuery(this)
            .dialog('close');
        },
      }],
    });

    // set max height for TETRA sites
    if (!shared.nextGenCheck()) {
      qaToolbox.config.$changeLogDisplay.dialog('option', 'maxHeight', 800);
    }
  },
};
