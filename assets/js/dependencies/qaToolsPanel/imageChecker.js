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
          title: 'Image Checker',
        })
        .text('Image Checker'),
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
          imageChecker.loopThroughImages();
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
  loopThroughImages() {
    // add tool styles
    let $this;
    let iaLength;

    // cache data from page
    this.cacheDOM();

    iaLength = this.imageArrayLength;

    // loop through allImages and check for alt text
    for (let a = 0; a < iaLength; a += 1) {
      $this = jQuery(this.$allImages[a]);
      // set parent positioning to relative
      $this.parent().css({position: 'relative', display: 'flex', 'justify-content': 'center', 'align-items': 'center'});
      // applies div overlay with same size as image
      this.addDivOverlay($this);
      // check for alt text
      this.checkForAltText($this);
      // get files size
      this.getFileSize($this);
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
  /**
  * Gets the images file size using ajax requests
  * @param {object} currentImage - the html element of the current [img] element to check for file size
  */
  getFileSize(currentImage) {
    let imageOverlay = jQuery(currentImage).prev(); // get previous sibling
    let imageURL = currentImage["0"].attributes['src'].value.includes('data:image') ?
      currentImage["0"].attributes['data-src'].value :
      currentImage["0"].attributes['src'].value; // get current image href url

    // using tampermonkey built in xmlhttprequest function to GET response headers
    GM_xmlhttpRequest({
        overrideMimeType: 'text/xml',
        method: 'HEAD',
        url: imageURL,
        onload: (data) => {
            // format response text to something usuable...
            const myResponse = data.responseHeaders.replace(/[\r]/g, ';');
            const myRegexp = /content-length:(.*);/g;
            let match = myRegexp.exec(myResponse);
            // convert content length to a number type
            let byteSize = Number(match[1]);
            // calculate file size
            let fileSize = this.bytesToSize(byteSize);
            // add file size to the div overlay
            imageOverlay.html(imageOverlay.text() + '<br>image file size: ' + fileSize);
        }
    });
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
      // width: `${this.widthOfImage}px`,
      width: '100%',
      // height: `${this.heightOfImage}px`,
      // height: '100%',
      position: 'absolute',
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

    // center overlay div
    // if (shared.nextGenCheck()) {
    //   this.$divOverlay =
    //     shared.centerDiv($currentImage, this.$divOverlay);
    // }
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
  bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  },
};
