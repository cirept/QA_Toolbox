const showNavigation = {
  init(callingPanel) {
    this.createElements();
    this.cacheDOM(callingPanel);
    this.buildLegend();
    this.addTool();
    this.bindEvents();
  },
  // ----------------------------------------
  // tier 1 functions
  // ----------------------------------------
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
      },
      $hint: jQuery('<div>')
        .attr({
          class: 'hint',
        })
        .html('ctrl+left click to open link in a new tab.'),
    };
  },
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
  addTool() {
    this.$toolsPanel
      .append(showNavigation.config.$activateButt);
    this.$legendContainer
      .append(showNavigation.config.$legend);
  },
  bindEvents() {
    //            showNavigation.config.$activateButt.on('click', this.toggleFeatures.bind(this));
    //            showNavigation.config.$activateButt.on('click', this.toggleDisable);
    //            showNavigation.config.$activateButt.on('click', this.bindClicks.bind(this));
    //            showNavigation.config.$offButt.on('click', this.toggleFeatures.bind(this));
    //            showNavigation.config.$offButt.on('click', this.toggleDisable);

    showNavigation.config.$activateButt
      .on('click', this.toggleFeatures.bind(this))
      .on('click', this.toggleDisable)
      .on('click', this.bindClicks.bind(this))
      .on('click', this.bindLegendElements); // test function
    showNavigation.config.$offButt
      .on('click', this.toggleFeatures.bind(this))
      .on('click', this.toggleDisable);
  },
  bindLegendElements() {
    const $myMenu = jQuery('nav');
    let findThis;
    let flaggedMajorPages;
    let flaggedCustomPages;
    let flaggedCheckedLinks;

    showNavigation.config.$legendList.children().each((index, value) => {
      findThis = jQuery(value).attr('class');
      switch (findThis) {
        case 'majorPage':
        // find all navigation links with majorPage class
          flaggedMajorPages = $myMenu.find(`.${findThis}`);
          jQuery(value).on('click', () => {
            flaggedMajorPages.toggleClass('majorPage');
          });
          break;
        case 'customPage':
        // find all navigation links with customPage class
          flaggedCustomPages = $myMenu.find(`.${findThis}`);
          jQuery(value).on('click', () => {
            flaggedCustomPages.toggleClass('customPage');
          });
          break;
        case 'linkChecked':
          flaggedCheckedLinks = $myMenu.find(`.${findThis}`);
          jQuery(value).on('click', () => {
            flaggedCheckedLinks.toggleClass('linkChecked');
          });
          break;
        default:
          // do nothing
      }
    });
  },
  // ----------------------------------------
  // tier 2 functions
  // ----------------------------------------
  toggleFeatures() {
    const majorPages =
      'a[href*=Form], a[href*=ContactUs], a[href=HoursAndDirections], a[href*=VehicleSearchResults]';

    if (shared.nextGenCheck()) {
      this.$navTabs
        .toggleClass('showNav customAdd');
      this.$subNavItem
        .toggleClass('showNav customAdd');
      this.$subNavMenuContainer
        .toggleClass('showNav nextgenShowNav');
      // this.$navTabs.find('a[href*=LandingPage]')
      //   .toggleClass('customPage');
      this.$navTabs
        .find(majorPages)
        .toggleClass('majorPage');

        // loop through all sub navigation tabs
        for (let y=0; y<this.$navTabs.length; y+=1){
          let $linksInNav = jQuery(this.$navTabs[y]).find('a');

          // loop through each link in the sub nav
            for(let z = 0; z < $linksInNav.length; z += 1){

              // run a xml http request to get the ContextManager on for each page.
              GM_xmlhttpRequest({
                method: 'GET',
                url: $linksInNav[z].href,
                onload: (data) => {
                  // set the returned data in an HTML element to perform search
                  let myDiv = document.createElement('div');
                  myDiv.innerHTML = data.responseText;
                  // convert html collection (children) to array type to perform Array.filtering
                  let childrenArray = Array.from(myDiv.children);
                  // filter the array to only SCRIPT elements that start with ContextManager
                  let filteredArray = childrenArray.filter((data) => {
                    return data.nodeName === 'SCRIPT' && data.innerHTML.indexOf('ContextManager.init') > -1;
                  });
                  // these two lines of code is to remove any text that may appear before the context manager code   =]
                  let start = filteredArray[0].innerHTML.indexOf('ContextManager.init({');
                  filteredArray[0].innerHTML = filteredArray[0].innerHTML.substring(start);
                  // find the start and end points of the ContextManager text
                  start = filteredArray[0].innerHTML.indexOf('{');
                  let end = filteredArray[0].innerHTML.indexOf('});');
                  // grab the OBJECT text to convert into an object
                  let myContextManager = filteredArray[0].innerHTML.substring(start, end + 1);
                  let myCM = JSON.parse(myContextManager);
                  // find the pagename property and test if it is a LandingPage
                  if (myCM.pageName.indexOf('LandingPage') > -1) {
                    $linksInNav[z].classList.add('customPage');
                  }
                }
              });
            }
        }
    }
    if (!shared.nextGenCheck()) {
      this.$navTabs
        .find(majorPages)
        .toggleClass('majorPage');
      this.$navTabs
        .find('a[href*=LandingPage]')
        .toggleClass('customPage');
      this.$navTabs.toggleClass('showNav');
    }
    showNavigation.config.$legend.slideToggle(500);
    this.$navTabs.find('.linkChecked')
      .removeClass('linkChecked');
  },
  toggleDisable() {
    showNavigation.config.$activateButt
      .prop(
        'disabled',
        (index, value) => !value,
      );
  },
  bindClicks() {
    const length = this.$navTabsLinks.length;

    for (let i = 0; i < length; i += 1) {
      jQuery(this.$navTabsLinks[i])
        .one('mousedown', this.linkChecked(this.$navTabsLinks[i]));
    }
  },
  // ----------------------------------------
  // tier 3 functions
  // ----------------------------------------
  linkChecked(currentLink) {
    return function () {
      jQuery(currentLink)
        .addClass('linkChecked');
    };
  },
};
