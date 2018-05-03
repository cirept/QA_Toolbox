const checkLinks = {
  init(callingPanel) {
    this.createElements();
    this.cacheDOM(callingPanel);
    this.buildLegend();
    this.addTool();
    this.bindEvents();
  },
  createElements() {
    checkLinks.config = {
      $activateButt: jQuery('<button>')
        .attr({
          class: 'myEDOBut',
          id: '404checker',
          title: '404 Checker',
        })
        .text('404 Link Checker'),
      $legend: jQuery('<div>')
        .attr({
          class: 'tbLegend checkLinks',
        }),
      $legendTitle: jQuery('<div>')
        .attr({
          class: 'legendTitle',
        })
        .text('404 Link Checker Legend'),
      $legendList: jQuery('<ul>')
        .attr({
          class: 'legendList',
        }),
      $legendContent: {
        otherDomain: 'Absolute URL*',
        opensWindow: 'Opens In A New Window',
        jumpLink: 'Jump Link or "#" URL',
        attention: 'URL Empty or Undefined',
        mobilePhoneLink: 'Mobile Link',
        buttonFlag: 'Button Element',
        success: 'Link is Real',
        error: '404 Link',
      },
      $offButt: jQuery('<input>')
        .attr({
          type: 'button',
          class: 'myEDOBut offButt',
          value: 'remove legend',
        }),
        $toggleButt: jQuery('<input>')
          .attr({
            type: 'button',
            class: 'myEDOBut feature',
            value: 'toggle URLs',
          }),
      $subText: jQuery('<div>')
        .attr({
          class: 'subText hint',
        })
        .text('* Manually Check Link'),
      $container: jQuery('<div>')
        .attr({
          class: 'checkContainer',
        }),
      $message: jQuery('<div>')
        .attr({
          class: 'checkMessage',
        }),
      $counter: jQuery('<div>')
        .attr({
          id: 'count404',
        }),
      $iconContainer: jQuery('<div>')
        .attr({
          id: 'iconContainer',
        }),
      $thinking: jQuery(
        '<i id="loading" class="fa fa-spinner fa-pulse fa-3x fa-fw"></i><span class="sr-only">Loading...</span>'
      ),
      $done: jQuery('<i class="fa fa-check-circle fa-3x fa-fw"></i>'),
      $hint: jQuery('<div>')
        .attr({
          class: 'hint',
        })
        .text('refresh page before running 404 checker again'),
      count: 1,
      totalTests: 0,
      totalLinks: 0, // for future error reporting
      errors: 0, // for future error reporting
    };
  },
  cacheDOM(callingPanel) {
    this.contextManager = unsafeWindow.ContextManager;
    this.webID = this.contextManager.getWebId();
    this.siteID = this.contextManager.getSiteId();
    this.baseURL = this.contextManager.getUrl();
    this.host = window.location.hostname;
    this.wid = this.separateID(this.webID);
    this.$toolsPanel = jQuery(callingPanel);
    this.$legendContainer = jQuery('.legendContainer');
    this.isNextGen = this.nextGenCheck;
    this.$otherLinks = jQuery('header, footer')
      .find('a');
  },
  buildLegend() {
    checkLinks.config.$legend
      .append(checkLinks.config.$toggleButt)
      .append(checkLinks.config.$legendTitle)
      .append(checkLinks.config.$legendList)
      .append(checkLinks.config.$subText)
      .append(checkLinks.config.$offButt)
      .append(checkLinks.config.$hint);
    // fill list
    shared.buildLegendContent(
      checkLinks.config.$legendContent,
      checkLinks.config.$legendList,
    );
    // attach filled list
    this.$legendContainer
      .append(checkLinks.config.$legend);
    checkLinks.config.$legend
      .prepend(checkLinks.config.$container);
  },
  addTool() {
    this.$toolsPanel
      .append(checkLinks.config.$activateButt);
  },
  bindEvents() {
    // main button
    checkLinks.config.$activateButt.on('click', () => {
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
          checkLinks.toggleDisable();
          checkLinks.showLegend();
          checkLinks.ajaxStart();
          checkLinks.ajaxStop();
          checkLinks.platformChooser();
        });
    });

    checkLinks.config.$offButt.on('click', () => {
      this.showLegend();
      jQuery('.tooltiptext.link_url').show();
    });

    checkLinks.config.$toggleButt.on('click', () => {
      jQuery('.tooltiptext.link_url').toggle();
    });
  },
  // Img Overlay Functions for Card-Clickable-V2
  addDivOverlay($currentImage) {
    this.cacheDOMOverlayElements($currentImage);
    this.createOverlayElements();
    this.buildOverlayElements();
    this.attachOverlayToImage($currentImage);
    return this.$divOverlay;
  },
  cacheDOMOverlayElements($currentImage) {
    this.imageAlt = jQuery($currentImage)[0].innerHtml;
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
  },
  attachOverlayToImage($currentImage) {
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
  toggleOverlayClass(currentImage) {
    jQuery(currentImage)
      .toggleClass('overlaid');
  },
  // ----------------------------------------
  // tier 1 functions
  // ----------------------------------------

  platformChooser() {
    const isNextGen = shared.nextGenCheck();
    if (isNextGen) {
      this.nextgenTestLinks();
    } else {
      this.tetraTestLinks();
    }
  },
  tetraTestLinks() {
    let $currentLink;
    let passedChecks = false;
    const $pageLinks = jQuery('a');
    const pageLinksLength = $pageLinks.length;

    // set total tests to number of links on page
    checkLinks.config.totalTests = pageLinksLength;

    for (let j = 0; j < pageLinksLength; j += 1) {
      $currentLink = jQuery($pageLinks[j]);
      $currentLink.addClass('siteLink'); // add default flag class to links

      // if URL's do not pass the checks skip iteration
      // do not send to ajax function for testing
      passedChecks = this.testURLs($currentLink);
      if (!passedChecks) {
        continue;
      }

      // test links
      //                this.tetraAjaxTest($currentLink);
      this.ajaxTest($currentLink);
    }
  },
  // checks current window URL and if it contains nextGen parameter
  // add the same URL parameters to the link before testing.
  addURLParameter($currentLink) {
    const curWindow = window.location.href;
    let linkURL = jQuery.trim($currentLink.attr('href'));
    // append nextGen
    if (curWindow.indexOf('nextGen=false') > -1) {
      // apply nextGen=false
      if (linkURL.indexOf('?') === -1) {
        linkURL += '?nextGen=false';
      } else {
        linkURL += '&nextGen=false';
      }
    } else if (curWindow.indexOf('nextGen=true') > -1) {
      // apply nextGen=true
      if (linkURL.indexOf('?') === -1) {
        linkURL += '?nextGen=true';
      } else {
        linkURL += '&nextGen=true';
      }
    }

    return linkURL;
  },
  /**
   * Test link URL.
   * Add classes to $currentLink if link url does not pass tests
   * @param {object} $currentLink - current link being tested
   */
  testURLs($currentLink) {
    const linkURL = jQuery.trim($currentLink.attr('href'));
    // set variable true or false, if image exists inside link
    let isImageLink = $currentLink.find('img') > 0;
    const isNextGen = shared.nextGenCheck();
    let $linkOverlay;
    let $image;

    // check if link contains an image
    $image = $currentLink.find('img');
    isImageLink = this.isImageLink($image);
    // check if link goes to another page
    if ($currentLink.attr('target') === '_blank' ||
      $currentLink.attr('target') === '_new' ||
      $currentLink.attr('target') === 'custom') {
      if (isImageLink) {
        $linkOverlay = shared.addDivOverlay(isNextGen, $currentLink);
        $linkOverlay.addClass('opensWindow');
      } else {
        $currentLink.addClass('opensWindow');
      }
    }
    if (linkURL.indexOf('tel:') >= 0) {
      if (isImageLink) {
        if ($linkOverlay === null) {
          $linkOverlay = shared.addDivOverlay(isNextGen, $currentLink);
        }
        $linkOverlay.addClass('mobilePhoneLink');
      } else {
        $currentLink.addClass('mobilePhoneLink');
      }
      checkLinks.config.totalTests -= 1; // minus this from the running total of links
      return false;
    } else if (linkURL.indexOf('javascript') >= 0 ||
      (linkURL.indexOf('#') === 0 || linkURL.indexOf('#') === 1)) { // test for javascript links or Jump Links
      $currentLink.addClass('jumpLink');
      checkLinks.config.totalTests -= 1; // minus this from the running total of links
      return false;
    } else if (typeof $currentLink === 'undefined' || linkURL === '') { // test for undefined or empty URLs
      $currentLink.addClass('attention');
      checkLinks.config.totalTests -= 1;
      return false;
    } else if (linkURL.indexOf('www') > -1 || linkURL.indexOf('://') >
      -1) { // test for absolute path URLs
      if (isImageLink) {
        if ($linkOverlay === null) {
          $linkOverlay = shared.addDivOverlay(isNextGen, $currentLink);
        }
        $linkOverlay.addClass('otherDomain');
      } else {
        $currentLink.addClass('otherDomain');
      }
      return true; // TEST THE ABSOLUTE URL REGARDLESS
    }
    return true;
  },
  nextgenTestLinks() {
    let $currentCard;
    const $sections = jQuery('main')
      .find('section');
    const len = $sections.length;

    this.testHeaderFooter();

    // TEST BODY LINKS
    // ASSUMPTION THAT ALL BODY LINKS WILL BE LOCATED INSIDE CARDS
    for (let a = 0; a < len; a += 1) {
      $currentCard = jQuery($sections[a]);

      // detect if the section element is a container
      // check if the div.deck contains content
      this.checkCard($currentCard);
    }
  },
  checkCard($currentCard) {
    let $cardLinkContainer = $currentCard.children('div.content')
      .find('div.link');
    let $cardSEOContainer = $currentCard.children('div.content')
      .find('div.copy');
    let $cardImageContainer = $currentCard.children('div.content')
      .find('div.media');
    const cardClass = $currentCard.attr('class') ? $currentCard.attr(
      'class') : '';
    let isImageLink = false;
    let $cardLinks;
    let $copyTextLinks;
    let meLength;
    let youLength;
    let $currentLink;

    if (cardClass.indexOf('link-clickable') > -1 || cardClass.indexOf(
        'none-clickable') > -1) {
      // CHECK ALL LINKS DEFINED IN CARD SETTINGS
      // ----------------------------------------
      // get all links defined in card
      // should include all primary, secondary, and tenary links
      // debugger;
      $cardLinks = $cardLinkContainer.find('a'); // this is an array
      meLength = $cardLinks.length;
      if (meLength > 0) {
        // set total tests to number of links on page
        checkLinks.config.totalTests += meLength;
        this.testLinks($cardLinks);
      }

      // CHECK ALL LINKS DEFINED IN SEO TEXT in COPY of RECORD
      // ----------------------------------------
      // get all text links in copy text of card
      $copyTextLinks = $cardSEOContainer.find('a');
      youLength = $copyTextLinks.length;
      if (youLength > 0) {
        // set total tests to number of links on page
        checkLinks.config.totalTests += youLength;
        this.testLinks($copyTextLinks);
      }
    } else if (cardClass.indexOf('card-clickable-v2') > -1 || cardClass
      .indexOf('card-clickable') > -1) {
      $cardLinkContainer = $currentCard.find('div.link');
      $cardSEOContainer = $currentCard.find('div.copy');
      $cardImageContainer = $currentCard.find('div.media');

      // check if card has an image
      if ($cardImageContainer.is(':empty')) {
        // this shouldn't happen; if the card is made to be clickable it should mean that the card will have an image as a 'best practice'
        isImageLink = false;
      } else {
        // find image in the card and apply a div overlay
        isImageLink = true;
        // find FIRST PRIMARY text link
        // This is because the card will be linked to the first primary link
        $currentLink = $cardLinkContainer.find(
          'a[class*="primary"]:first');
        $currentLink.addClass('siteLink'); // add default flag class to links
        //                    $image = $cardImageContainer.find('img');
        // add div overlay to image

        // send link to ajx testing
        // PASS $CURRENTCARD FOR OVERLAYING THE DIV PURPOSES.
        // set total tests to number of links on page
        checkLinks.config.totalTests += 1;
        this.ajaxTest($currentLink, isImageLink, $currentCard);
        //                    this.nextGenAjaxTest($currentLink, isImageLink, $currentCard);

        // TEST other Links defined in card Settings
        // check if other links exist, get all links defined in card
        // should include all primary, secondary, and tenary links
        $cardLinks = $cardLinkContainer.find('a'); // this is an array
        meLength = $cardLinks.length;
        if (meLength > 0) {
          // set total tests to number of links on page
          checkLinks.config.totalTests += meLength;
          this.testLinks($cardLinks);
        }

        // TEST TEXT LINKS IN THE COPY OF THE CARD
        // check copy container and grab all links
        $copyTextLinks = $cardSEOContainer.find('a');
        youLength = $copyTextLinks.length;
        if (youLength > 0) {
          // set total tests to number of links on page
          checkLinks.config.totalTests += youLength;
          this.testLinks($copyTextLinks);
        }
      }
    }
  },
  /**
   * TEST LINKS FOUND IN HEADER AND FOOTER OF SITE
   * TESTS TO BODY LINKS WILL BE HANDLED DIFFERENTLY
   */
  testHeaderFooter() {
    const jLength = this.$otherLinks.length;
    let $currentLink;

    // set total tests to number of links on page
    checkLinks.config.totalTests = jLength;

    for (let j = 0; j < jLength; j += 1) {
      $currentLink = jQuery(this.$otherLinks[j]);
      // add default flag class to links
      $currentLink.addClass('siteLink');

      if (!this.testURLs($currentLink)) {
        continue;
      }

      // USING TETRA AJAX TESTING BECAUSE ALL LINKS IN THE HEADER AND FOOTER EITHER TEXT LINKS or
      // FONT IMAGE LINKS
      // send link to ajx testing
      //                this.tetraAjaxTest($currentLink);
      this.ajaxTest($currentLink);
    }
  },
  testLinks($linkArray) {
    let $currentLink;

    if ($linkArray.length > 1) {
      // set limit to for loop
      const myLength = $linkArray.length;

      for (let q = 0; q < myLength; q += 1) {
        $currentLink = jQuery($linkArray[q]);
        // add default flag class to links
        $currentLink.addClass('siteLink');
        // skip check is link does not pass tests
        if (!this.testURLs($currentLink)) {
          continue;
        }
        // send link to ajax testing
        this.ajaxTest($currentLink);
        //                    this.nextGenAjaxTest($currentLink);
      }
    } else {
      // coverted variable name for easy reading
      $currentLink = $linkArray;
      // add default flag class to links
      $currentLink.addClass('siteLink');
      // skip check is link does not pass tests
      if (!this.testURLs($currentLink)) {
        return;
      }
      // send link to ajax testing
      this.ajaxTest($currentLink);
      //                this.nextGenAjaxTest($currentLink);
    }
  },
  // checks if $image has length
  // This is to verify that an image does exists inside the link
  isImageLink($image) {
    if ($image.length) {
      return true;
    }
    return false;
  },
  // checks the data returned for KEY 404 indentifiers
  // will return TRUE if a identifier is found
  // will return FALSE if no identifier is found
  checkFor404(data) {
    // checks the returned page for key 404 identifiers
    if (data.indexOf('pageNotFound') > -1 || data.indexOf(
        'not currently a functioning page') > -1) {
      return true;
    }
    return false;
  },
  // checks if the current link is within a QUICK LINKS PLUS WIDGET modified by EDO modules
  // Will return false if link is inside a QLP widget
  checkForQuickLinksWidget($currentLink) {
    // create check for links inside quick links widget
    if ($currentLink.closest('.cell')
      .attr('data-cell')) {
      // check if link is within a quick links widget
      if ($currentLink.closest('.cell')
        .attr('data-cell')
        .indexOf('Quick_Links_Plus') > -1) {
        // checks if QLP is modified by modules
        if ($currentLink.closest('section')
          .attr('class')
          .indexOf('customTemplate') === -1) {
          return false;
        }
      }
    }
  },
  // adds classes to DOM element that the user will be able to see
  // classes will make it clear to the user via CSS that is already added to the site
  addFlagsToElements($visualElement, pageError404) {
    switch (true) {
      // if internal page 404
      case pageError404:
        checkLinks.error($visualElement);
        checkLinks.config.errors += 1;
        break;

        // if link IS legit
      case !pageError404:
        checkLinks.success($visualElement);
        break;

      default:
        // do nothing
    }
  },
  ajaxTest($currentLink, isImageLink, $currentCard) {
    let hasImage = 0;
    let wrappedContents = false;
    let $linkOverlay;
    let pageError404;
    const linkURL = checkLinks.addURLParameter($currentLink);
    const isNextGen = shared.nextGenCheck();
    let cardClass;
    let $currentImg;
    let href;
    let currentURL;
    if (isImageLink) {
      isImageLink = isImageLink;
    } else {
      isImageLink = false;
    }
    // If card-clickable-v2, we want to only overlay the img, as the rest of the card could have links
    if (isNextGen && isImageLink) {
      cardClass = $currentCard.attr('class') ? $currentCard.attr('class') :
        '';
      if (cardClass.indexOf('card-clickable-v2') > -1) {
        $currentCard.remove('.imgOverlay');
        $currentImg = jQuery($currentCard.find('img')[0]);
        $linkOverlay = this.addDivOverlay($currentImg);
      } else {
        $linkOverlay = shared.addDivOverlay(isNextGen, $currentLink,
          $currentCard);
      }
      if ($currentLink.attr('target') === '_blank' ||
        $currentLink.attr('target') === '_new' ||
        $currentLink.attr('target') === 'custom') {
        $linkOverlay.addClass('opensWindow');
      }
      href = jQuery($currentLink)
        .attr('href');
      // try in case theres a problem with href
      try {
        currentURL = jQuery.trim(href);
        if (currentURL.indexOf('www') > -1 || currentURL.indexOf('://') >
          -1) {
          $linkOverlay.addClass('otherDomain');
        }
      } catch (e) {
        if (typeof $currentLink === 'undefined' || linkURL === '') {
          $currentLink.addClass('attention');
        }
      }
    }
    checkLinks.showURL($currentLink, isImageLink, $linkOverlay, linkURL);
    // NEXT GEN NEEDS LINK AND PARENT CARD TO OVERLAY IMAGE
    //            var $linkOverlay;
    //            var pageError404;
    //            var linkURL = checkLinks.addURLParameter($currentLink);
    //            var isNextGen = shared.nextGenCheck();
    // test each link
    jQuery.ajax({
      url: linkURL, // be sure to check the right attribute
      type: 'post',
      crossDomain: true,
      method: 'get',
      dataType: 'html',
      success(data) {
        if (!isNextGen) {
          // checks to see if link is an image link
          hasImage = $currentLink.has('img')
            .length;
          if (hasImage) {
            isImageLink = true;
            $linkOverlay = shared.addDivOverlay(
              isNextGen,
              $currentLink,
            );
          }
          // checks to see if the link has inline css
          // if it does wrap contents in in span tag and add classes to that
          wrappedContents = Boolean($currentLink.attr('style'));
          if (wrappedContents && !hasImage) {
            $currentLink.wrapInner('<span></span>');
            $linkOverlay = jQuery($currentLink.children('span'));
          }
          // If value is false all class modifications should be done to the link itself
          pageError404 = checkLinks.checkFor404(data);
          // if link is an image link
          // ADD CLASS FLAGS TO DIV OVERLAY
          // OTHERWISE ADD CLASS FLAGS TO LINK ELEMENT
          if (isImageLink || wrappedContents) {
            checkLinks.addFlagsToElements(
              $linkOverlay,
              pageError404,
            );
          } else {
            checkLinks.addFlagsToElements(
              $currentLink,
              pageError404,
            );
          }
        }
        if (isNextGen) {
          // check to see if the card has an image prior to startin the ajax testing
          /*
                      if (isImageLink) {
                          $linkOverlay = shared.addDivOverlay(isNextGen, $currentLink, $currentCard);

                      } */
          // If value is false all class modifications should be done to the link itself
          pageError404 = checkLinks.checkFor404(data);

          // if link is an image link
          // ADD CLASS FLAGS TO DIV OVERLAY
          // OTHERWISE ADD CLASS FLAGS TO LINK ELEMENT
          if (isImageLink) {
            checkLinks.addFlagsToElements(
              $linkOverlay,
              pageError404,
            );
          } else {
            checkLinks.addFlagsToElements(
              $currentLink,
              pageError404,
            );
          }
        }
      },
      error(jqXHR) {
        // set link in red if there is any errors with link
        checkLinks.config.errors += 1;
        if (jqXHR.status === 404) {
          if (isImageLink) {
            checkLinks.error($linkOverlay);
          } else {
            checkLinks.error($currentLink);
          }
        }
      },
      statusCode: {
        404() {
          $currentLink.addClass('fourOfour');

          if (isImageLink) {
            checkLinks.error($linkOverlay);
          } else {
            checkLinks.error($currentLink);
          }

          checkLinks.config.errors += 1;
        },
      },
      complete() {
        checkLinks.config.count += 1;
        checkLinks.config.$counter.text(
          `${checkLinks.config.count
        } of ${checkLinks.config.totalTests}`
        );
      },
    });
  },
  showURL($currentLink, isImageLink, $linkOverlay) {
    const linkURL = jQuery.trim($currentLink.attr('href'));

    // appending it to the link text for a cleaner look
    $currentLink.attr('title', linkURL);

    // attach a custom div element that contains the url text
    const toolTip =
      `<br><div class="tooltiptext link_url">${linkURL}</div>`;
    if (isImageLink) {
      if ($linkOverlay[0].innerHTML.indexOf(linkURL) === -1) {
        if ($linkOverlay !== null) {
          $linkOverlay.append(toolTip);
        }
      }
    } else if ($currentLink[0].innerHTML.indexOf(linkURL) === -1) {
      $currentLink.append(toolTip);
    }
  },

  toggleDisable() {
    checkLinks.config.$activateButt.prop('disabled', (
      index,
      value,
    ) => !value);
  },
  showLegend() {
    checkLinks.config.$legend.slideToggle(500);
  },
  separateID(myWebID) {
    const split = myWebID.split('-');
    return split[1];
  },
  ajaxStart() {
    jQuery(document)
      .ajaxStart(() => {
        checkLinks.config.$message
          .text('checking links')
          .append(checkLinks.config.$counter)
          .append(checkLinks.config.$iconContainer)
          .append(checkLinks.config.$thinking);
        checkLinks.config.$container
          .append(checkLinks.config.$message);
      });
  },
  ajaxStop() {
    jQuery(document)
      .ajaxStop(() => {
        checkLinks.config.$message
          .empty();
        checkLinks.config.$thinking
          .remove();
        checkLinks.config.$message
          .text('all links checked');
        checkLinks.config.$iconContainer
          .append(checkLinks.config.$done);
        checkLinks.config.$message
          .append(checkLinks.config.$iconContainer);
        checkLinks.config.$message
          .delay(7000)
          .fadeOut(
            2000,
            () => {
              checkLinks.config.$container
                .remove();
            },
          );
      });
  },
  error($this) {
    // ITS SUPPOSED TO ADD THE ERROR CLASS TO THE DIV OVERLAY IF THE LINK IS AN IMAGE LINK
    $this.addClass('error');
  },
  success($this) {
    $this.addClass('success');
  },
};
