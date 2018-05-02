const imageChecker = {
  init(callingPanel) {
    this.createElements(callingPanel);
    this.buildLegend();
    this.addTool();
    this.bindEvents();
  },
  // ----------------------------------------
  // tier 1
  // ----------------------------------------
  createElements(callingPanel) {
    imageChecker.config = {
      $activateButt: jQuery('<button>')
        .attr({
          class: 'myEDOBut',
          id: 'imageChecker',
          title: 'Image Alt Checker',
        })
        .text('Image Alt Checker'),
      $legend: jQuery('<div>')
        .attr({
          class: 'tbLegend imageChecker',
        }),
      $legendTitle: jQuery('<div>')
        .attr({
          class: 'legendTitle',
        })
        .text('Image Checker Legend'),
      $legendList: jQuery('<ul>')
        .attr({
          class: 'legendList',
        }),
      $legendContent: {
        noAlt: 'No Alt Text',
        hasAlt: 'Has Alt Text',
      },
      $offButt: jQuery('<input>')
        .attr({
          type: 'button',
          class: 'myEDOBut offButt',
          value: 'Turn Off',
        }),
      $toolsPanel: jQuery(callingPanel),
      $legendContainer: jQuery('.legendContainer'),
    };
  },
  buildLegend() {
    imageChecker.config.$legend
      // attach legend title
      .append(imageChecker.config.$legendTitle)
      // attach list
      .append(imageChecker.config.$legendList)
      // attach turn off button
      .append(imageChecker.config.$offButt);
    // fill list
    shared.buildLegendContent(
      imageChecker.config.$legendContent,
      imageChecker.config.$legendList,
    );
  },
  addTool() {
    imageChecker.config.$toolsPanel
      .append(imageChecker.config.$activateButt);
    imageChecker.config.$legendContainer
      .append(imageChecker.config.$legend);
  },
  bindEvents() {
    // main button
    imageChecker.config.$activateButt.on('click', () => {
      jQuery('html, body')
        .scrollTop(0);
      jQuery('html, body')
        .animate({
          scrollTop: jQuery(document)
            .height(),
        }, 4000)
        .delay(1750)
        .promise()
        .done(() => {
          jQuery('html, body')
            .scrollTop(0);
          imageChecker.highlightImages();
          imageChecker.showLegend();
          imageChecker.toggleDisable();
        });
    });
    // off button
    imageChecker.config.$offButt
      .on('click', this.removeHighlights.bind(this))
      .on('click', this.showLegend)
      .on('click', this.toggleDisable);
  },
  // ----------------------------------------
  // tier 2
  // ----------------------------------------
  highlightImages() {
    // add tool styles
    let $this;
    let iaLength;

    // cache data from page
    this.cacheDOM();

    iaLength = this.imageArrayLength;

    // loop through allImages and check for alt text
    for (let a = 0; a < iaLength; a += 1) {
      $this = jQuery(this.$allImages[a]);
      // applies div overlay with same size as image
      this.addDivOverlay($this);
      // check for alt text
      this.checkForAltText($this);
    }
  },
  showLegend() {
    imageChecker.config.$legend.slideToggle(500);
  },
  toggleDisable() {
    imageChecker.config.$activateButt
      .prop('disabled', (index, value) => !value);
  },
  removeHighlights() {
    const iaLength = this.imageArrayLength;
    // removes special overlay class on images
    for (let a = 0; a < iaLength; a += 1) {
      this.toggleOverlayClass(this.$allImages[a]);
    }
    // remove highlight overlay
    jQuery('.imgOverlay')
      .remove();
  },
  // ----------------------------------------
  // tier 3
  // ----------------------------------------
  cacheDOM() {
    this.$allImages = jQuery('body')
      .find('img');
    this.imageArrayLength = this.$allImages.length;
  },
  addDivOverlay($currentImage) {
    this.cacheDOMOverlayElements($currentImage);
    this.createOverlayElements();
    this.buildOverlayElements();
    this.attachToImage($currentImage);
  },
  checkForAltText(currentImage) {
    const $image = jQuery(currentImage);
    // find first case that returns true

    if (typeof $image.attr('alt') === 'undefined') { // if alt is undefined
      this.togClass($image, 'noAlt');
    } else if ($image.attr('alt') === '') { // if alt is empty
      this.togClass($image, 'emptyAlt');
    } else if ($image.attr('alt') !== '') { // if alt IS NOT empty
      this.togClass($image, 'hasAlt');
    }
  },
  // ----------------------------------------
  // tier 4
  // ----------------------------------------
  cacheDOMOverlayElements($currentImage) {
    this.imageAlt = jQuery($currentImage)
      .attr('alt');
    // gets sizing of images
    this.widthOfImage = jQuery($currentImage)
      .width();
    this.heightOfImage = jQuery($currentImage)
      .height();
  },
  createOverlayElements() {
    // create div overlay
    this.$divOverlay = jQuery('<div>')
      .attr({
        class: 'imgOverlay',
      });
  },
  buildOverlayElements() {
    // make the div overlay the same dimensions as the image
    this.$divOverlay.css({
      width: `${this.widthOfImage}px`,
      height: `${this.heightOfImage}px`,
    });
    // add image alt as text to div
    this.$divOverlay
      .append(this.imageAlt);
  },
  attachToImage($currentImage) {
    // make parent image relative positioning
    this.toggleOverlayClass($currentImage);
    // place div overlay onto image
    $currentImage
      .before(this.$divOverlay);

    if (shared.nextGenCheck()) {
      this.$divOverlay =
        shared.centerDiv($currentImage, this.$divOverlay);
    }
  },
  togClass($image, addClass) {
    $image.siblings('.imgOverlay')
      .toggleClass(addClass);
  },
  // ----------------------------------------
  // tier 5
  // ----------------------------------------
  toggleOverlayClass(currentImage) {
    jQuery(currentImage)
      .toggleClass('overlaid');
  },
};
