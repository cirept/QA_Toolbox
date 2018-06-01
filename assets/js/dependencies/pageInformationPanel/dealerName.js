const dealerName = {
  init() {
    this.createElements();
    this.buildTool();
    this.cacheDOM();
    this.displayData();
    // return finished tool
    return this.returnTool();
  },
  createElements() {
    dealerName.config = {
      $dealerNameContainer: jQuery('<div>')
        .attr({
          id: 'dealerNameContainer',
        }),
      // dealership name title
      $dealerNameTitle: jQuery('<label>')
        .attr({
          class: 'tbLabel',
        })
        .text('Dealer Name'),
      // dealership name display
      $dealerName: jQuery('<div>')
        .attr({
          class: 'tbInfo',
          title: 'Copy Dealership Name',
          id: 'dealerName',
        }),
    };
  },
  buildTool() {
    dealerName.config.$dealerNameContainer
      .append(dealerName.config.$dealerNameTitle)
      .append(dealerName.config.$dealerName);
  },
  cacheDOM() {
    this.contextManager = unsafeWindow.ContextManager;
    this.dealerName = this.contextManager.getDealershipName();
  },
  displayData() {
    dealerName.config.$dealerName.html(this.dealerName);
  },
  returnTool() {
    return dealerName.config.$dealerNameContainer;
  },
};
