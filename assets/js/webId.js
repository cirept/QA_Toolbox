const webID = {
  init() {
    this.createElements();
    this.buildTool();
    this.cacheDOM();
    this.displayData();
    // return finished tool
    return this.returnTool();
  },
  createElements() {
    webID.config = {
      $webIDContainer: jQuery('<div>')
        .attr({
          id: 'webIDContainer',
        }),
      // web id title
      $webIDTitle: jQuery('<label>')
        .attr({
          class: 'tbLabel',
        })
        .text('Web-Id'),
      // web is display
      $webID: jQuery('<div>')
        .attr({
          class: 'tbInfo',
          title: 'Copy web-id',
          id: 'webID',
        }),
    };
  },
  buildTool() {
    webID.config.$webIDContainer
      .append(webID.config.$webIDTitle);
    webID.config.$webIDContainer
      .append(webID.config.$webID);
  },
  cacheDOM() {
    this.contextManager = unsafeWindow.ContextManager;
    this.webID = this.contextManager.getWebId();
  },
  displayData() {
    webID.config.$webID.html(this.webID);
  },
  returnTool() {
    const panel = webID.config.$webIDContainer;
    return panel;
  },
};
