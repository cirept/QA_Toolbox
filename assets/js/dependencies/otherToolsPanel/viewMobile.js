  const viewMobile = {
    init(callingPanel) {
      this.createElements();
      this.cacheDOM(callingPanel);
      this.addTool();
      this.bindEvents();
    },
    // ----------------------------------------
    // tier 1 functions
    // ----------------------------------------
    createElements() {
      viewMobile.config = {
        $activateButt: jQuery('<button>')
          .attr({
            class: 'myEDOBut',
            id: 'viewMobile',
            title: 'View Mobile Site',
          })
          .text('View Mobile Site'),
      };
    },
    cacheDOM(callingPanel) {
      this.$otherToolsPanel = jQuery(callingPanel);
      this.contextManager = unsafeWindow.ContextManager;
      this.siteURL = this.contextManager.getUrl();
      this.pageName = this.contextManager.getPageName();
    },
    addTool() {
      this.$otherToolsPanel
        .append(viewMobile.config.$activateButt);
    },
    bindEvents() {
      viewMobile.config.$activateButt.on('click', this.viewMobile.bind(this));
    },
    // ----------------------------------------
    // tier 2 functions
    // ----------------------------------------
    viewMobile() {
      const auto = '?device=mobile&nextGen=false';
      const openThis = this.siteURL + this.pageName + auto;
      shared.openNewTab(openThis);
    },
  };
