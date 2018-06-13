const pageInformation = {
  init() {
    // initialize module
    this.createElements();
    this.buildPanel();
    this.cacheDOM();
    this.addTool();
    this.bindEvents();
    shared.displayPanel(pageInformation.config.$pageInfo);
  },
  // ----------------------------------------
  // tier 1 functions
  // ----------------------------------------
  createElements() {
    // main panel container
    pageInformation.config = {
      $pageInfoContainer: jQuery('<div>')
        .attr({
          class: 'toolBox',
          id: 'pageInfoContainer',
        }),
      // panel title
      $pageInfoTitle: jQuery('<div>')
        .attr({
          class: 'panelTitle',
          id: 'pageInfoTitle',
          title: 'Click to Minimize/Maximize',
        })
        .text('Page Information'),
      // tool panel
      $pageInfo: jQuery('<div>')
        .attr({
          class: 'toolsPanel',
          id: 'pageInfo',
        }),
    };
  },
  buildPanel() {
    // attach panel elements to container
    pageInformation.config.$pageInfo
      .append(dealerName.init())
      .append(liveSiteURL.init())
      .append(webID.init())
      .append(pageName.init())
      .append(hTags.init());
    // attach to continer
    pageInformation.config.$pageInfoContainer
      .append(pageInformation.config.$pageInfoTitle)
      .append(pageInformation.config.$pageInfo);
  },
  cacheDOM() {
    // DOM elements
    this.$toolBoxContainer = jQuery('.toolboxContainer');
    this.variableList = shared.programData();
  },
  addTool() {
    // add to main toolbox
    this.$toolBoxContainer
      .prepend(pageInformation.config.$pageInfoContainer);
  },
  bindEvents() {
    // minimize
    pageInformation.config.$pageInfoTitle
      .on('click', shared.toggleFeature)
      .on('click', shared.saveState);
    // hover effect & click
    pageInformation.config.$pageInfo
      .on('mouseover mouseleave', '.tbInfo', this.hoverEffect)
      .on('click', '.tbInfo', this.copyToClipboard);
  },
  // ----------------------------------------
  // tier 2 functions
  // ----------------------------------------
  hoverEffect(event) {
    // apply hover effects
    const element = event.currentTarget;
    jQuery(element)
      .toggleClass('highlight');
  },
  copyToClipboard(event) {
    // copy page info
    const copyThisText = event.currentTarget.innerHTML;
    shared.clipboardCopy(copyThisText);
  },
};
