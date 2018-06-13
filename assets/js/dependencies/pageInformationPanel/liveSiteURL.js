const liveSiteURL = function() {
  init() {
    this.createElements();
    this.buildTool();
    this.makeRequest();
    this.displayData();
    // return finished tool
    return this.returnTool();
  },
  createElements() {
    liveSiteURL.config = {
      $liveSiteURLContainer: jQuery('<div>')
        .attr({
          id: 'liveSiteURLContainer',
        }),
      // live site url title
      $liveSiteURLTitle: jQuery('<label>')
        .attr({
          class: 'tbLabel',
        })
        .text('live site url'),
      // live site url display
      $liveSiteURL: jQuery('<div>')
        .attr({
          class: 'tbInfo',
          title: 'live site url',
          id: 'liveSiteURL',
        }),
    };
  },
  buildTool() {
    const {
      $liveSiteURLContainer,
      $liveSiteURLTitle,
      $liveSiteURL
    } = this.config;

    $liveSiteURLContainer.append($liveSiteURLTitle);
    $liveSiteURLContainer.append($liveSiteURL);
  },
  makeRequest() {
    // TODO
    // this.contextManager = unsafeWindow.ContextManager;
    // this.liveSiteURL = this.contextManager.getliveSiteURL();
  },
  displayData() {
    this.config.$liveSiteURL.html(this.liveSiteURL);
  },
  returnTool() {
    return this.config.$liveSiteURLContainer;
  },
};
