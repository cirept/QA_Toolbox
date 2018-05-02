const speedtestPage = {
  init(callingPanel) {
    this.createElements();
    this.cacheDOM(callingPanel);
    this.buildOptions();
    this.buildPanel();
    this.addTool();
    this.bindEvents();
  },
  // ----------------------------------------
  // tier 1 functions
  // ----------------------------------------
  createElements() {
    speedtestPage.config = {
      $activateButt: jQuery('<button>')
        .attr({
          class: 'myEDOBut',
          id: 'testPage',
          title: 'Queue up a Page Test',
        })
        .text('Web Page Test'),
      'email': GM_getValue('email', 'your.name@cdk.com'), // eslint-disable-line
      $emailTitle: jQuery('<div>')
        .text('Enter your email'),
      $emailInput: jQuery('<input>')
        .attr({
          class: 'WPT email',
          id: 'WPTemail',
          type: 'text',
          placeholder: 'your.name@cdk.com',
        }),
      $panelContainer: jQuery('<div>')
        .attr({
          class: 'WPT input',
        }),
      browserOptions: {
        _IE11: 'IE11',
        ':Chrome': 'Chrome',
        ':FireFox': 'Firefox',
      },
      $browserSelect: jQuery('<select>')
        .attr({
          class: 'WPT bSelect',
          id: 'WPTbSelect',
        }),
      $browserTitle: jQuery('<div>')
        .text('Choose a Browser'),
      $keySelect: jQuery('<select>')
        .attr({
          class: 'WPT keySelect',
          id: 'WPTkeySelect',
        }),
      keyOptions: {
        key1: 'A.26fc3fe634ca1277825369f20eb25a90',
        key2: 'A.1b40e6dc41916bd77b0541187ac9e74b',
        key3: 'A.7389884c8e4af7e491458158a283dc7a',
        key4: 'A.ad231acf8f2888abaff310981eab805f',
        key5: 'A.50f3e84b941c37c0abf2132f3b989196',
        key6: 'A.d78638331b63ece0ee419964818f8e8d',
        key7: 'A.517503243d1253bf66ea52d153905c41',
        key8: 'A.7987f0cf2ec2ac0dc644ec9e6b54f883',
      },
      $keyTitle: jQuery('<div>')
        .text('Choose Key'),
      testURL: 'http://www.webpagetest.org/runtest.php?',
      $sendButt: jQuery('<input>')
        .attr({
          type: 'button',
          class: 'myEDOBut offButt',
          value: 'Send Test',
        }),
    };
  },
  cacheDOM(callingPanel) {
    this.contextManager = unsafeWindow.ContextManager;
    this.siteURL = this.contextManager.getUrl();
    this.pageName = this.contextManager.getPageName();
    this.$toolsPanel = jQuery(callingPanel);
  },
  buildOptions() {
    let $listItem;

    jQuery.each(speedtestPage.config.browserOptions, (
      key,
      text,
    ) => {
      $listItem = jQuery('<option>')
        .val(key)
        .html(text);
      speedtestPage.config.$browserSelect
        .append($listItem);
    });

    jQuery.each(speedtestPage.config.keyOptions, (key, text) => {
      $listItem = jQuery('<option>')
        .val(text)
        .html(key);
      speedtestPage.config.$keySelect
        .append($listItem);
    });
  },
  buildPanel() {
    speedtestPage.config.$panelContainer
      .append(speedtestPage.config.$emailTitle)
      .append(speedtestPage.config.$emailInput)
      .append(speedtestPage.config.$browserTitle)
      .append(speedtestPage.config.$browserSelect)
      .append(speedtestPage.config.$keyTitle)
      .append(speedtestPage.config.$keySelect)
      .append(speedtestPage.config.$sendButt);
    speedtestPage.config.$emailInput
      .val(speedtestPage.config.email);
  },
  addTool() {
    this.$toolsPanel
      .append(speedtestPage.config.$activateButt)
      .append(speedtestPage.config.$panelContainer);
  },
  bindEvents() {
    speedtestPage.config.$activateButt.on('click', () => {
      speedtestPage.config.$panelContainer.slideToggle(500);
    });

    speedtestPage.config.$sendButt
      .on('click', this.storeData)
      .on('click', this.sendPage.bind(this))
      .on('click', () => {
        speedtestPage.config.$panelContainer.slideToggle(500);
      });
  },
  // ----------------------------------------
  // tier 2 functions
  // ----------------------------------------
  storeData() {
    // save user input
    const userEmail = jQuery('#WPTemail')
      .val();
    shared.saveValue('email', userEmail);
  },
  sendPage() {
    const browser = jQuery('#WPTbSelect option:selected')
      .val();
    const selectedKey = jQuery('#WPTkeySelect option:selected')
      .val();
    const browserName = jQuery('#WPTbSelect option:selected')
      .text();
    const email = shared.getValue('email');
    const params = {
      k: selectedKey,
      runs: '3',
      fvonly: '1',
      notify: email,
      location: `Dulles${browser}`,
    };
    let desktopURL;
    let mobileURL;
    let testURL = speedtestPage.config.testURL;

    // build url
    jQuery.each(params, (index, value) => {
      testURL += `${index}=${value}&`;
    });

    // alert user
    if (shared.nextGenCheck()) {
      desktopURL =
        `${testURL}url=${this.siteURL
      }${this.pageName}?nextGen=true`;

      if (confirm(
          `${'----------------------------------------\n' + // eslint-disable-line no-alert
                      'Test the Desktop and Mobile site?\n' +
                      '----------------------------------------\n' +
                      'Browser : '}${browserName}\n` +
          `Send Results To : ${email}\n` +
          '----------------------------------------') === true) {
        shared.openNewTab(desktopURL);
      }
    } else {
      desktopURL =
        `${testURL}url=${this.siteURL
      }${this.pageName}?device=immobile`;

      mobileURL =
        `${testURL}url=${this.siteURL
      }${this.pageName}?device=mobile`;

      if (confirm(
          `${'----------------------------------------\n' + // eslint-disable-line no-alert
                      'Test the Desktop and Mobile site?\n' +
                      '----------------------------------------\n' +
                      'Browser : '}${browserName}\n` +
          `Send Results To : ${email}\n` +
          '----------------------------------------') === true) {
        shared.openNewTab(desktopURL);
        shared.openNewTab(mobileURL);
      }
    }
  },
};
