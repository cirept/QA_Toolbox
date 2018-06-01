const pageName = {
  init() {
    this.createElements();
    this.buildTool();
    this.cacheDOM();
    this.displayData();
    this.toggleVisibility();
    // return finished tool
    return this.returnTool();
  },
  createElements() {
    pageName.config = {
      $pageNameContainer: jQuery('<div>')
        .attr({
          id: 'pageNameContainer',
        }),
      // page name title
      $pageNameTitle: jQuery('<label>')
        .attr({
          class: 'tbLabel',
        })
        .text('Page Name'),
      // pange name display
      $pageName: jQuery('<div>')
        .attr({
          class: 'tbInfo',
          title: 'Copy Page Name',
          id: 'pageName',
        }),
      // page label title
      $pageLabelTitle: jQuery('<label>')
        .attr({
          class: 'tbLabel',
        })
        .text('Custom Page Name'),
      // page label display
      $pageLabel: jQuery('<div>')
        .attr({
          class: 'tbInfo',
          title: 'Copy Page Label',
          id: 'pageLabel',
        }),
    };
  },
  buildTool() {
    pageName.config.$pageNameContainer
      .append(pageName.config.$pageNameTitle)
      .append(pageName.config.$pageName)
      .append(pageName.config.$pageLabelTitle)
      .append(pageName.config.$pageLabel);
  },
  cacheDOM() {
    this.contextManager = unsafeWindow.ContextManager;
    this.pageName = this.contextManager.getPageName();
    this.pageLabel = this.contextManager.getPageLabel();
  },
  displayData() {
    pageName.config.$pageName.html(this.pageName);
    pageName.config.$pageLabel.html(this.pageLabel);
  },
  toggleVisibility() {
    // hide pagel label elements if name
    // is same as page name
    if (this.pageName === this.pageLabel) {
      pageName.config.$pageLabelTitle.addClass('disappear');
      pageName.config.$pageLabel.addClass('disappear');
    }
  },
  returnTool() {
    const panel = pageName.config.$pageNameContainer;
    return panel;
  },
};
