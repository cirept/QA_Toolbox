const showNavigation = {
  /**
   * initializes the tool, calling the various sub-functions
   */
  init(callingPanel) {
    this.createElements();
    this.cacheDOM(callingPanel);
    this.buildLegend();
    this.addTool();
    this.bindEvents();
  },
  /**
   * Creates the tools elements
   */
  createElements() {
    showNavigation.config = {
      $activateButt: jQuery('<button>')
        .attr({
          class: 'myEDOBut',
          id: 'showNavigation',
          title: 'Show Navigation (Highlights Major Pages)',
        })
        .text('Show Navigation'),
      $offButt: jQuery('<input>')
        .attr({
          type: 'button',
          class: 'myEDOBut offButt',
          value: 'Turn Off',
        }),
      $legend: jQuery('<div>')
        .attr({
          class: 'tbLegend showNavigation',
        }),
      $legendTitle: jQuery('<div>')
        .attr({
          class: 'legendTitle',
        })
        .text('Show Navigation Legend'),
      $legendList: jQuery('<ul>')
        .attr({
          class: 'legendList',
        }),
      $legendContent: {
        majorPage: 'Major Page',
        customPage: 'Landing Page',
        linkChecked: 'Link Clicked',
        error: 'Tool Error with Link'
      },
      $hint: jQuery('<div>')
        .attr({
          class: 'hint',
        })
        .html('ctrl+left click to open link in a new tab.'),
    };
  },
  /**
   * Cache DOM elements that the tool will use
   */
  cacheDOM(callingPanel) {
    this.$toolsPanel = jQuery(callingPanel);
    this.$legendContainer = jQuery('.legendContainer');

    if (shared.nextGenCheck()) {
      this.$navTabs = jQuery('li[repeat*="mainNav"]');
      this.$subNavMenuContainer = this.$navTabs.find('ul[if="cards.length"]');
      this.$subNavItem = this.$subNavMenuContainer.find('li[repeat="cards"]');
      this.$navTabsLinks = this.$subNavItem.find('a');
    } else {
      this.$nav = jQuery('#pmenu');
      this.$navTabs = this.$nav.find('ul');
      this.$navTabsLinks = this.$navTabs.find('a');
    }
  },
  /**
   * Builds the tools legend
   */
  buildLegend() {
    showNavigation.config.$legend
      // attach legend title
      .append(showNavigation.config.$legendTitle)
      // attach list
      .append(showNavigation.config.$legendList)
      // attach turn off button
      .append(showNavigation.config.$offButt)
      // attach hint
      .append(showNavigation.config.$hint);
    // fill list
    shared.buildLegendContent(
      showNavigation.config.$legendContent,
      showNavigation.config.$legendList,
    );
  },
  /**
   * Add the tool to the Toolbox and add the legend to the legend panel
   */
  addTool() {
    this.$toolsPanel
      .append(showNavigation.config.$activateButt);
    this.$legendContainer
      .append(showNavigation.config.$legend);
  },
  /**
   * Attach the events to the main tool buttons
   */
  bindEvents() {
    showNavigation.config.$activateButt
      .on('click', this.discoverMajorPages.bind(this))
      .on('click', this.discoverLandingPages.bind(this))
      .on('click', this.toggleDisable)
      .on('click', this.toggleLegend)
      .on('click', this.toggleNavigation.bind(this))
      .on('click', this.bindClicks.bind(this))
      .on('click', this.bindLegendElements);
    showNavigation.config.$offButt
      .on('click', this.removeClasses.bind(this))
      .on('click', this.toggleLegend)
      .on('click', this.toggleNavigation.bind(this))
      .on('click', this.toggleDisable);
  },
  /**
   * Allows the legend elements to be clickable, allowing the user to
   * hide/show the highlights for the corresponding legend element that
   * was clicked
   */
  bindLegendElements() {
    const $myMenu = jQuery('nav');

    // loop through legend items
    showNavigation.config.$legendList.children().each((index, value) => {

      let findThis = jQuery(value).attr('class');
      let flaggedLinks;

      // bind legend element with onClick functionality
      jQuery(value).on('click', () => {
        // do something special for the 'linkChecked' legend item
        if (findThis === 'linkChecked') {
          flaggedLinks = $myMenu.find(`.${findThis}`);
        } else {
          // IF FLAGGEDLINKS is empty, set a value, otherwise set it euqal to itself.
          flaggedLinks = flaggedLinks ? flaggedLinks : $myMenu.find(
            `.${findThis}`);
        }
        // toggle all the classses off
        flaggedLinks.toggleClass(findThis);
      });
    });
  },
  /**
   * Removes all custom classes for this particular tool
   */
  removeClasses() {
    // get Keys from legend content
    // these are the classes that were added to the DOM elements
    const myClasses = Object.keys(showNavigation.config.$legendContent);

    // loop through the class array
    for (let y = 0; y < myClasses.length; y += 1) {
      // removed classes from elements that contain those classes
      this.$navTabs.find(`a[class*=${myClasses[y]}]`).removeClass(myClasses[y]);
    }
  },
  /**
   * Hide or show the legend
   */
  toggleLegend() {
    // show/hide navigation
    showNavigation.config.$legend.slideToggle(500);
  },
  /**
   * Will flag all navigation links that lead to a Landing Page
   * Checks links in two waves,
   * Wave 1 : checks URL for 'LandingPage' responseText
   * Wave 2 : if no LandingPage is found, start an xhr request and get the page info
   */
  discoverLandingPages() {
    // Add customPage class to links that have LandingPage in the URL
    this.$navTabs
      .find('a[href*=LandingPage]')
      .addClass('customPage');

    if (shared.nextGenCheck()) {
      // set active request count to total number of links found
      let activeRequests = 0;

      // loop through all sub navigation tabs
      for (let y = 0; y < this.$navTabs.length; y += 1) {
        let $linksInNav = jQuery(this.$navTabs[y]).find('a');

        // loop through each link in the sub nav
        for (let z = 0; z < $linksInNav.length; z += 1) {

          // increment counter for every link found
          activeRequests += 1;

          // if link URL already contains LandingPage, skip xhr check
          if ($linksInNav[z].href.includes('LandingPage')) {
            // reduce the link counter value
            activeRequests -= 1;
            // skip loop iteration
            break;
          }

          // run a xml http request to get the ContextManager on for each page.
          GM_xmlhttpRequest({
            method: 'GET',
            url: $linksInNav[z].href,
            timeout: 5000,
            onload: (data) => {
              // reduce the link counter value
              activeRequests -= 1;

              try {
                // check if Link Counter element exists, if exists update counter number, if doesn't exist create it.
                document.getElementById('linkCounter') ? document.getElementById(
                    'linkCounter').innerHTML =
                  `${activeRequests} links left to check` :
                  showNavigation.config.$legend
                  .prepend(
                    `<div id='linkCounter' style='display: block'>${activeRequests} links left to check</div>`
                  );

                if (activeRequests === 0) {
                  // change the text to an 'thumbs up' image
                  document.getElementById('linkCounter').innerHTML =
                    'Complete <i class="fas fa-thumbs-up"></i>';
                  // fade out the element
                  jQuery('#linkCounter').fadeToggle(3500, () => {
                    // remove counter element after the animation has ended
                    jQuery('#linkCounter').remove();
                  });
                }

                // set the returned data in an HTML element to perform search
                let myDiv = document.createElement('div');
                myDiv.innerHTML = data.responseText;
                // convert html collection (children) to array type to perform Array.filtering
                let childrenArray = Array.from(myDiv.children);
                // filter the array to only SCRIPT elements that start with ContextManager
                let filteredArray = childrenArray.filter((data) => {
                  return data.nodeName === 'SCRIPT' && data.innerHTML
                    .indexOf('ContextManager.init') > -1;
                });
                // these two lines of code is to remove any text that may appear before the context manager code   =]
                let start = filteredArray[0].innerHTML.indexOf(
                  'ContextManager.init({');
                filteredArray[0].innerHTML = filteredArray[0].innerHTML
                  .substring(
                    start);
                // find the start and end points of the ContextManager text
                start = filteredArray[0].innerHTML.indexOf('{');
                let end = filteredArray[0].innerHTML.indexOf('});');
                // grab the OBJECT text to convert into an object
                let myContextManager = filteredArray[0].innerHTML.substring(
                  start, end + 1);
                let myCM = JSON.parse(myContextManager);
                // find the pagename property and test if it is a LandingPage
                if (myCM.pageName.indexOf('LandingPage') > -1) {
                  $linksInNav[z].classList.add('customPage');
                }
              } catch (error) {
                console.log('error occured while checking links', error);
                $linksInNav[z].classList.add('error');
              }
            },
            onerror: (data) => {
              activeRequests -= 1;
              // console.log('activeRequests', activeRequests);
              console.log('error occured');
            }
          });
        }
      }
    }
  },
  /**
   * add custom classes to the navigation menu in order to show the sub nav
   */
  toggleNavigation() {
    // if NG site do this
    if (shared.nextGenCheck()) {
      this.$navTabs.toggleClass('showNav customAdd');
      this.$subNavItem.toggleClass('showNav customAdd');
      this.$subNavMenuContainer.toggleClass('showNav nextgenShowNav');
    } else {
      this.$navTabs.toggleClass('showNav');
    }
  },
  /**
   * Flags all navigation items that lead to a MajorPage
   * See 'majorPage' array for "Major Pages"
   */
  discoverMajorPages() {
    const majorPages =
      'a[href*=Form], a[href*=ContactUs], a[href=HoursAndDirections], a[href*=VehicleSearchResults]';

    // flag navigation links with custom class
    if (shared.nextGenCheck()) {
      // if NG site do this
      this.$navTabs.find(majorPages).toggleClass('majorPage');
    } else {
      // if NOT NG site, do this
      this.$navTabs
        .find(majorPages)
        .toggleClass('majorPage');
    }
  },
  /**
   * Toggles 'disable' the Toolbar button
   */
  toggleDisable() {
    showNavigation.config.$activateButt
      .prop(
        'disabled',
        (index, value) => !value,
      );
  },
  /**
   * Attach an onClick event that will add the 'linkChecked' class to the nav item
   */
  bindClicks() {
    const length = this.$navTabsLinks.length;

    for (let i = 0; i < length; i += 1) {
      jQuery(this.$navTabsLinks[i])
        .one('mousedown', this.linkChecked(this.$navTabsLinks[i]));
    }
  },
  /**
   * Callback function that will add the custom 'linkchecked' class to element
   */
  linkChecked(currentLink) {
    return function () {
      jQuery(currentLink)
        .addClass('linkChecked');
    };
  },
};
