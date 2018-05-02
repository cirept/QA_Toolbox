const qaToolbox = {
  init() {
    this.createElements();
    this.cacheDOM();
    this.buildElements();
    this.attachTools();
  },
  // ----------------------------------------
  // tier 1 functions
  // ----------------------------------------
  createElements() {
    qaToolbox.config = {
      $legendContainer: jQuery('<div>')
        .attr({
          class: 'legendContainer',
        }),
      $toolboxContainer: jQuery('<div>')
        .attr({
          class: 'toolboxContainer',
          id: 'showToolbox',
        }),
      $changeLogUpdateContainer: jQuery('<div>')
        .attr({
          id: 'overlayContainer',
        }),
      $changeLogDisplay: jQuery('<div>')
        .attr({
          id: 'changeLog',
        }),
    };
  },
  cacheDOM() {
    this.body = jQuery('body');
    this.phoneWrapper = jQuery('body .phone-wrapper');
  },
  buildElements() {
    qaToolbox.config.$changeLogUpdateContainer
      .append(qaToolbox.config.$changeLogDisplay);

    // load change log details
    qaToolbox.config.$changeLogDisplay.load(
      'https://cirept.github.io/QA_Toolbox/ChangeLog section');

    // make legend container draggable
    qaToolbox.config.$legendContainer.draggable();
  },
  attachTools() {
    this.body
      .after(qaToolbox.config.$toolboxContainer)
      .after(qaToolbox.config.$legendContainer);
  },
};
