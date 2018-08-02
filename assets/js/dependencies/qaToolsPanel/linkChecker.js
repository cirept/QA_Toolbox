const linkChecker = {
  init(callingPanel) {
    this.createElements(callingPanel);
    this.getData();
    this.buildLegend();
    this.addTool();
    this.bindEvents();
  },
  // ----------------------------------------
  // tier 1 functions
  // ----------------------------------------
  createElements(callingPanel) {
    linkChecker.config = {
      $activateButt: jQuery('<button>')
        .attr({
          class: 'myEDOBut',
          id: 'linkChecker',
          title: 'Check Links',
        })
        .text('Link Checker'),
      $legend: jQuery('<div>')
        .attr({
          class: 'tbLegend linkChecker',
        }),
      $legendTitle: jQuery('<div>')
        .attr({
          class: 'legendTitle',
        })
        .text('Link Checker Legend'),
      $legendList: jQuery('<ul>')
        .attr({
          class: 'legendList',
        }),
      $legendContent: {
        noTitle: 'No Title Text',
        hasTitle: 'Has Title Text',
        opensWindow: 'Opens In A New Window',
        // 'brokenURL': 'Empty URL',
        urlIssue: 'Check URL',
        absoluteURL: 'Absolute URL',
        unsupportedPageLink: 'Page Not Supported',
        buttonFlag: 'Button Element',
        linkChecked: 'Clicked Link',
      },
      $offButt: jQuery('<input>')
        .attr({
          type: 'button',
          class: 'myEDOBut offButt',
          value: 'Turn Off',
        }),
      $hint: jQuery('<div>')
        .attr({
          class: 'hint',
        })
        .text('ctrl+left click to open link in a new tab'),
      $toolsPanel: jQuery(callingPanel),
      $legendContainer: jQuery('.legendContainer'),
      datedPagesfileURL: 'https://cdn.rawgit.com/cirept/NextGen/a9b9d06f/resources/dated_pages.json',
      unsupportedPages: {},
    };
  },
  getData() {
    const datedPagesURL = linkChecker.config.datedPagesfileURL;
    jQuery.getJSON(datedPagesURL, (data) => {
      linkChecker.config.unsupportedPages = data.datedPages;
    });
  },
  buildLegend() {
    linkChecker.config.$legend
      // attach legend title
      .append(linkChecker.config.$legendTitle)
      // attach list
      .append(linkChecker.config.$legendList)
      // attach turn off button
      .append(linkChecker.config.$offButt)
      // attach hint
      .append(linkChecker.config.$hint);
    // fill list
    shared.buildLegendContent(
      linkChecker.config.$legendContent,
      linkChecker.config.$legendList,
    );
  },
  addTool() {
    linkChecker.config.$toolsPanel
      .append(linkChecker.config.$activateButt);
    linkChecker.config.$legendContainer
      .append(linkChecker.config.$legend);
  },
  bindEvents() {
    // main button
    linkChecker.config.$activateButt.on('click', () => {
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
          shared.flagButtons();
          linkChecker.checkLinks();
          linkChecker.showLegend();
          linkChecker.toggleDisable();
        });
    });
    // off button
    linkChecker.config.$offButt
      .on('click', this.removeHighlights.bind(this))
      .on('click', this.showLegend)
      .on('click', this.toggleDisable);
  },
  // ----------------------------------------
  // tier 2 functions
  // ----------------------------------------
  checkLinks() {
    // dynamic loading of cached elements
    // have to load here to compensate for lazy loaded widgets
    this.cacheDOM();

    // NEXT GEN SITE LOGIC
    // ----------------------------------------
    if (shared.nextGenCheck()) {
      this.nextGenSiteCheck();
    }

    // TETRA SITE LOGIC
    // ----------------------------------------
    if (!shared.nextGenCheck()) {
      this.tetraSiteCheck();
    }
  },
  showLegend() {
    linkChecker.config.$legend.slideToggle(500);
  },
  toggleDisable() {
    linkChecker.config.$activateButt
      .prop('disabled', (index, value) => !value);
  },
  removeHighlights() {
    let key;
    // removes special overlay class on images
    for (key in linkChecker.config.$legendContent) {
      if (linkChecker.config.$legendContent.hasOwnProperty(key)) {
        this.removeClass(this.$allLinks, key);
        this.removeClass(jQuery('body')
          .find('button'), key);
      }
    }
    // remove div overlay
    jQuery('.imgOverlay')
      .remove();
    // remove overlaid class
    this.removeClass(this.$allImageLinks, 'overlaid');
    // turn off custom link class
    this.removeClass(this.$allLinks, 'siteLink');
  },
  // ----------------------------------------
  // tier 3 functions
  // ----------------------------------------
  cacheDOM() {
    this.$allLinks = jQuery('body')
      .find('a');
    this.$allImageLinks = this.$allLinks.find('img');
    this.linksArrayLength = this.$allLinks.length;
    this.imageLinksArrayLength = this.$allImageLinks.length;
    //            this.$toolboxStyles = jQuery('#qa_toolbox');
    this.$sections = jQuery('main')
      .find('section');
    this.$otherLinks = jQuery('header, footer')
      .find('a');
  },
  nextGenSiteCheck() {
    const $sections = this.$sections;
    const len = $sections.length;
    // var a = 0;
    let isImageLink;
    let $currentCard;
    let cardClass;

    // TEST LINKS FOUND IN HEADER AND FOOTER OF SITE
    // TESTS TO BODY LINKS WILL BE HANDLED DIFFERENTLY
    // ----------------------------------------
    this.testHeaderFooter();

    // TEST BODY LINKS
    // ASSUMPTION THAT ALL BODY LINKS WILL BE LOCATED INSIDE CARDS
    // ----------------------------------------
    for (let a = 0; a < len; a += 1) {
      // reset variables
      isImageLink = false;
      $currentCard = jQuery($sections[a]);

      // save current card settings
      // if currentCard has a class save it, if no class make variable equal ''
      cardClass = $currentCard.attr('class') ? $currentCard.attr('class') : '';

      // test links inside cards
      this.testCard($currentCard, cardClass, isImageLink);
    }

  },
  tetraSiteCheck() {
    const length = this.linksArrayLength;
    // var a = 0;
    let $currentLink;
    let $image;
    let isImageLink;
    let isQLPlink;
    let dataCell;
    let $closestLi;
    // let height;
    // let width;

    // loop through all links on page
    for (let a = 0; a < length; a += 1) {
      // reset variables
      $image = null;
      isImageLink = false;
      isQLPlink = false;
      $currentLink = jQuery(this.$allLinks[a]);

      // skip main nav menu items
      if (typeof $currentLink.attr('class') !== 'undefined') {
        if ($currentLink.attr('class')
          .indexOf('main') > -1 &&
          $currentLink.attr('class')
          .indexOf('main') > -1) {
          continue;
        }
      }

      $image = $currentLink.find('img');
      isImageLink = this.isImageLink($image);
      // create check for links inside quick links widget
      if ($currentLink.closest('.cell')
        .attr('data-cell')) {
        dataCell = $currentLink.closest('.cell')
          .attr('data-cell');
        // check if link is within a quick links widget
        if (dataCell.indexOf('Quick_Links_Plus') > -1) {
          // checks if QLP is modified by modules

          // IF LINK IS INSIDE A QUICK LINKS WIDGET MARK IT AS NOT AN IMAGE LINK
          // PREPEND DIV OVERLAY INSIDE OF LINK.
          if ($currentLink.parent()
            .attr('class')) {
            $closestLi = $currentLink.closest('li');
            if ($closestLi.attr('class')
              .indexOf('co-card') > -1) {
              // if ($currentLink.closest('li').attr('class').indexOf('co-card') > -1) {
              isQLPlink = true;
              $currentLink.addClass('QLPLink');
              $currentLink = $closestLi.find('a:first');
              // $currentLink = $currentLink.closest('li').find('a:first');
              isImageLink = false;
            }
          }
        }
      }

      // if image link add div overlay
      if (isImageLink) {
        this.addDivOverlay($currentLink, $image);
      }

      // if QLP link add div overlay
      if (isQLPlink) {
        // Only apply the div overlay if the image contained inside the QLP card has a width and a height
        // if the width and height is 0 that means that there is no image
        const height = jQuery($image)
          .height();
        const width = jQuery($image)
          .width();

        if (height !== 0 && width !== 0) {
          this.addDivOverlay($currentLink, $image, isQLPlink);
          //  MIIGHT NEED CUSTOM LOGIC TO CHECK ALL QLP WIDGET LINKS
          // SETTING ISIMAGELINK TO TRUE TO SEE IF I CAN TRICK THE LOGIC TO STILL ADD CLASSES TO THE DIV OVERLAY
          isImageLink = true;
        }
      }

      // perform checks to link
      // add flag class, check target, check title, check url
      this.runTests($currentLink, isImageLink);

      // bind click event
      this.bindClickCallback($currentLink, isImageLink);
    }
  },
  removeClass(array, removeClass) {
    const arrlength = array.length;
    let $obj;
    for (let a = 0; a < arrlength; a += 1) {
      $obj = jQuery(array[a]);
      $obj.removeClass(removeClass);
    }
  },
  // ----------------------------------------
  // tier 4
  // ----------------------------------------
  testHeaderFooter() {
    // TEST LINKS FOUND IN HEADER AND FOOTER OF SITE
    const jLength = this.$otherLinks.length;
    let $currentLink;
    let isImageLink;

    // loop through array of links found in header and footer of site
    for (let j = 0; j < jLength; j += 1) {
      $currentLink = jQuery(this.$otherLinks[j]);
      $currentLink.addClass('siteLink');

      // checks if link is an image
      if ($currentLink.find('img') > 0) {
        isImageLink = true;
      }

      this.runTests($currentLink, isImageLink);
    }
  },
  testCard($currentCard, cardClass, isImageLink) {
    const $cardLinkContainer = $currentCard.find('div.link');
    const $cardSEOContainer = $currentCard.find('div.copy');
    const $cardImageContainer = $currentCard.find('div.media');
    let $cardLinks;
    let myLength;
    let $copyTextLinks;
    let youLength;
    let $currentLink;
    let $linkOverlay;

            // if there are no links found in the link container, return
            if ($cardLinkContainer.children().length === 0) {
              return;
            }

    if (cardClass.indexOf('link-clickable') > -1 ||
      cardClass.indexOf('none-clickable') > -1) {
      // THERE SHOULD BE NO NEED TO CHECK FOR IMAGES IN THIS STYLE OF CARD
      // THE IMAGE WILL NEVER BE A LINK THUS NOT NEEDING TO BE CHECKED

      // CHECK ALL LINKS DEFINED IN CARD SETTINGS
      // get all links defined in card
      // should include all primary, secondary, and tenary links
      $cardLinks = $cardLinkContainer.find('a'); // this is an array
      myLength = $cardLinks.length;
      // loop through links if there is any
      if (myLength > 0) {
        this.testLinks($cardLinks);
      }

      // CHECK ALL LINKS DEFINED IN SEO TEXT in COPY of RECORD
      // get all text links in copy text of card
      $copyTextLinks = $cardSEOContainer.find('a');
      youLength = $copyTextLinks.length;
      // loop through links if there is any
      if (youLength > 0) {
        this.testLinks($copyTextLinks);
      }
    } else if (cardClass.indexOf('card-clickable-v2') > -1 ||
      cardClass.indexOf('card-clickable') > -1) {
      // check if card has an image
      if ($cardImageContainer.is(':empty')) {
        // this shouldn't happen if the card is made to be clickable, it should mean that the card will have an image as a 'best practice'
        isImageLink = false;
      } else {
        // find image in the card and apply a div overlay
        isImageLink = true;

        // find FIRST PRIMARY text link
        $currentLink = $cardLinkContainer.find('a[class*="primary"]:first');

        // add div overlay to image
        // $linkOverlay = this.addDivOverlay(
        $linkOverlay = shared.addDivOverlay(
          true, $currentLink,
          $currentCard,
        );
        // perform checks to link
        // add flag class, check target, check title, check url
        this.nextgenRunTests($currentLink, $linkOverlay, isImageLink);

        // THERE IS NO NEED TO TEST OTHER LINKS AS THEY WON'T MATTER
        // THE CARD WILL ONLY LINK TO THE FIRST PRIMARY LINK IN THE CARD
        // BUT IT'LL CHECK ANYWAY

        // TEST other Links defined in card Settings
        $cardLinks = $cardLinkContainer.find('a'); // this is an array
        myLength = $cardLinks.length;

        if (myLength > 0) {
          this.testLinks($cardLinks);
        }

        // CHECK ALL LINKS DEFINED IN SEO TEXT in COPY of RECORD
        $copyTextLinks = $cardSEOContainer.find('a');
        youLength = $copyTextLinks.length;

        if (youLength > 0) {
          this.testLinks($copyTextLinks);
        }
      }
    }
  },
  isImageLink($image) {
    if ($image.length) {
      return true;
    }
    return false;
  },
  addDivOverlay($currentLink, $currentImage, isQLPlink) {
    this.cacheDOMOverlayElements($currentLink, $currentImage);
    this.createOverlayElements();
    this.buildOverlayElements();

    if (isQLPlink) {
      this.attachToImage($currentImage, $currentLink, isQLPlink);
    } else {
      this.attachToImage($currentImage);
    }
  },
  runTests($currentLink, isImageLink) {
    // check to see if isImageLink parameter was passed
    isImageLink =
      typeof isImageLink === 'undefined' ? false : isImageLink;
    // check target of link
    this.checkTarget($currentLink, isImageLink);
    // check title of link
    this.checkForTitleText($currentLink, isImageLink);
    // check url of link
    this.checkURL($currentLink, isImageLink);
  },
  bindClickCallback($currentLink, isImageLink) {
    // bind click event
    if (isImageLink) {
      return $currentLink.one('mousedown', this.linkChecked(this.$divOverlay));
    }
    return $currentLink.one('mousedown', this.linkChecked($currentLink));
  },
  // ----------------------------------------
  // Tier 5
  // ----------------------------------------
  testLinks($linkArray, isImageLink) {
    const myLength = $linkArray.length;
    let $currentLink;

    if (myLength > 1) {
      for (let q = 0; q < myLength; q += 1) {
        $currentLink = jQuery($linkArray[q]);
        // add tool custom class
        $currentLink.addClass('siteLink');

        // perform checks to link
        // add flag class, check target, check title, check url
        this.runTests($currentLink, isImageLink);

        // bind click event
        // will change the color of link when user clicks
        this.bindClickCallback($currentLink, isImageLink);
      }
    } else {
      $currentLink = $linkArray;
      $currentLink.addClass('siteLink');
      // perform checks to link
      // add flag class, check target, check title, check url
      this.runTests($currentLink, isImageLink);

      // bind click event
      // will change the color of link when user clicks
      this.bindClickCallback($currentLink, isImageLink);
    }
  },
  nextgenRunTests($currentLink, $linkOverlay, isImageLink) {
    // check to see if isImageLink parameter was passed
    if (typeof isImageLink === 'undefined') {
      isImageLink = false;
    }
    // TODO Remove this line if the tool still works after this modification
    // else {
    //     isImageLink = isImageLink;
    // }
    // check target of link
    this.checkTargetNextGen($currentLink, $linkOverlay);
    // check title of link
    this.checkForTitleTextNextGen(
      $currentLink, isImageLink,
      $linkOverlay,
    );
    // check url of link
    this.checkURLNextGen($currentLink, isImageLink, $linkOverlay);
  },
  cacheDOMOverlayElements($currentLink, $currentImage) {
    this.linkTitle = jQuery($currentLink)
      .find('a')
      .attr('title');
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
    this.$divOverlay.attr({
        class: 'imgOverlay',
      })
      .css({
        width: `${this.widthOfImage}px`,
        height: `${this.heightOfImage}px`,
      });

    // add content to div
    this.$divOverlay.append(this.linkTitle);
  },
  attachToImage($currentImage, $currentLink, isQLPlink) {
    // CUSTOM LOGIC FOR QLP WIDGET LINKS
    // IF QLP ATTACH DIV OVERLAY TO BEGINNING OF LINK CONTENTS
    if (isQLPlink) {
      $currentLink.prepend(this.$divOverlay);
      return;
    }

    if (shared.nextGenCheck()) {
      this.$divOverlay =
        shared.centerDiv($currentImage, this.$divOverlay);
    }

    // make parent image relative positionin
    this.apndClass($currentImage, 'overlaid');

    // place div overlay onto image
    jQuery($currentImage)
      .before(this.$divOverlay);
  },
  checkTarget($currentLink, isImageLink) {
    // check if link opens in a new window
    if (this.verifyTarget($currentLink)) {
      if (isImageLink) {
        this.apndClass(this.$divOverlay, 'opensWindow');
      } else {
        this.apndClass($currentLink, 'opensWindow');
      }
    }
  },
  checkForTitleText($currentLink, isImageLink) {
    // text links
    const $obj = isImageLink ? this.$divOverlay : $currentLink;

    if (typeof $currentLink.attr('title') === 'undefined' ||
      $currentLink.attr('title') === '') { // link has no title
      this.apndClass($obj, 'noTitle');
    } else if ($currentLink.attr('title') !== '') { // link has a title
      this.apndClass($obj, 'hasTitle');
    }
  },
  checkURL($currentLink, isImageLink) {
    const href = $currentLink.attr('href');
    const modElement = isImageLink ? this.$divOverlay : $currentLink;

    // regular text links
    if (typeof href === 'undefined') { // link is undefined
      this.apndClass(modElement, 'brokenURL');
    } else if (href === '') { // link has an empty url
      this.apndClass(modElement, 'brokenURL');
    } else if (this.checkHref(href)) { // link has a fishy url
      this.apndClass(modElement, 'urlIssue');
    } else if (this.datedURL(href) && shared.nextGenCheck()) { // link leads to an out dated page
      this.apndClass(modElement, 'unsupportedPageLink');
    } else if (this.checkAbsoluteURL(href)) { // link has a fishy url
      this.apndClass(modElement, 'absoluteURL');
    }
  },
  linkChecked($currentLink) {
    return function () {
      $currentLink.addClass('linkChecked');
    };
  },
  // ----------------------------------------
  // Tier 6
  // ----------------------------------------
  checkTargetNextGen($currentLink, $linkOverlay) {
    // check if link opens in a new window
    if (this.verifyTarget($currentLink)) {
      this.apndClass($linkOverlay, 'opensWindow');
    }
  },
  checkForTitleTextNextGen(
    $currentLink, isImageLink,
    $linkOverlay,
  ) {
    // text links
    if (typeof $currentLink.attr('title') === 'undefined' ||
      $currentLink.attr('title') === '') { // link has no title
      this.apndClass($linkOverlay, 'noTitle');
    } else if ($currentLink.attr('title') !== '') { // link has a title
      this.apndClass($linkOverlay, 'hasTitle');
    }
  },
  checkURLNextGen($currentLink, isImageLink, $linkOverlay) {
    const href = $currentLink.attr('href');

    if (typeof href === 'undefined') { // link is undefined
      this.apndClass($linkOverlay, 'brokenURL');
    } else if (href === '') { // link has an empty url
      this.apndClass($linkOverlay, 'brokenURL');
    } else if (this.checkHref(href)) { // link has a fishy url
      this.apndClass($linkOverlay, 'urlIssue');
    } else if (this.datedURL(href) && shared.nextGenCheck()) { // link leads to an out dated page
      this.apndClass($linkOverlay, 'unsupportedPageLink');
    } else if (this.checkAbsoluteURL(href)) { // link has a fishy url
      this.apndClass($linkOverlay, 'absoluteURL');
    }
  },
  apndClass($currentLink, addClass) {
    $currentLink.addClass(addClass);
  },
  verifyTarget($currentLink) {
    if ($currentLink.attr('target') === '_blank' ||
      $currentLink.attr('target') === '_new' ||
      $currentLink.attr('target') === 'custom') {
      return true;
    }
  },
  // ----------------------------------------
  // Tier 7
  // ----------------------------------------
  // checks URL if its 'special'
  checkHref(elem) {
    // # will mean that the link is more than likely a button that will be used for JS
    // f_ will only show the content of the page, removing the header and footer of the page
    if (elem.indexOf('#') === 0 || elem.indexOf('f_') === 0) {
      return true;
    }
    return false;
  },
  // check for absolute URL
  checkAbsoluteURL(elem) {
    if (elem.indexOf('www') >= 0 || elem.indexOf('http') >= 0 || elem.indexOf(
        '//') >= 0) {
      return true;
    }
    return false;
  },
  // check if leads to out dated page
  datedURL(elem) {
    const datedPages = linkChecker.config.unsupportedPages;
    const datedPagesLength = datedPages.length;
    let datedPage;

    for (let z = 0; z < datedPagesLength; z += 1) {
      datedPage = datedPages[z];

      // TODO create exception json for the specials pages on Hyundai.
      // exception for Tire Basic Page
      if (elem.indexOf('AboutSpecials?p=cca-tire-tips') > -1) {
        continue;
      }

      if (elem.indexOf(datedPage) > -1) {
        return true;
      }
    }
    return false;
  },
};
