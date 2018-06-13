const liveSiteURL = {
  /**
  * initialize the tool
  */
  init() {
    this.createElements();
    this.buildTool();
    this.cacheDOM();
    this.getInfo();
    // return finished tool
    return this.returnTool();
  },
  /**
  * Cache the tools DOM elements
  */
  createElements() {
    this.config = {
      $liveSiteURLContainer: jQuery('<div>')
        .attr({
          id: 'liveSiteURLContainer',
        }),
      // vanity URL title
      $liveSiteURLTitle: jQuery('<label>')
        .attr({
          class: 'tbLabel',
        })
        .text('Live Site URL'),
      // vanity URL display
      $liveSiteURL: jQuery('<div>')
        .attr({
          class: 'tbInfo',
          title: 'Copy URL',
          id: 'liveSiteURL',
        }),
    };
  },
  /**
  * Put the created tool elements together
  */
  buildTool() {
    const {
      $liveSiteURLContainer,
      $liveSiteURLTitle,
      $liveSiteURL
    } = this.config;

    $liveSiteURLContainer
      .append($liveSiteURLTitle)
      .append($liveSiteURL);
  },
  /**
  * Cache the DOM information that the tool will use
  */
  cacheDOM() {
    this.contextManager = unsafeWindow.ContextManager;
    this.webID = this.contextManager.getWebId();
    this.liveSiteURL = '';
  },
  /**
  * Sends a GET request to the CDK API to get the live site URL for the current
  * web ID
  */
  getInfo() {
    // base url
    const mURL =
      'http://tools.cdkagency.com/node/api/webIdToDomainName?webId=';

      // ajax options
    const options = {
      url: `${mURL}${this.webID}`,
      method: 'GET',
      dataType: 'json',
    };

    // Send get request to CDK API
    jQuery.ajax(options)
      .done((data, status, xhr) => {
        this.liveSiteURL = data.domainName ? data.domainName :
          'Site Not Live';
      })
      .fail((xhr, status, error) => {
        this.liveSiteURL = status;
      })
      .always((data, status, xhr) => {
        this.displayData();
      });
  },
  /**
  * Updates the DOM element to display the live site URL
  */
  displayData() {
    const {
      $liveSiteURL
    } = this.config;

    $liveSiteURL.html(this.liveSiteURL);
  },
  /**
  * Returns the cached DOM elements to the main Panel
  */
  returnTool() {
    const {
      $liveSiteURLContainer
    } = this.config;

    return $liveSiteURLContainer;
  },
};
