const hTags = {
  init() {
    this.createElements();
    this.cacheDOM();
    this.buildTool();
    this.displayData();
    this.tagDetails();
    this.bindEvents();
    // return finished tool
    return this.returnTool();
  },
  // ----------------------------------------
  // tier 1 functions
  // ----------------------------------------
  createElements() {
    hTags.config = {
      $hTagsContainer: jQuery('<div>')
        .attr({
          id: 'hTagsContainer',
        }),
      $hTagsTitle: jQuery('<label>')
        .attr({
          class: 'tbLabel',
        })
        .text('h tags'),
      $hTags: jQuery('<div>')
        .attr({
          title: 'Click to show hTags on page',
          class: 'hTags',
        }),
      hTagsTotal: {
        h1: 0,
        h2: 0,
        h3: 0,
        h4: 0,
      },
      hTags: {},
      $removeBut: jQuery('<input>')
        .attr({
          type: 'button',
          class: 'myEDOBut removeDiv',
          value: 'REMOVE',
        }),
      $hTagDisplay: jQuery('<div>')
        .attr({
          class: 'hTagDisplay',
        }),
      $hTagDisplayContainer: jQuery('<div>')
        .attr({
          class: 'hTagDisplayContainer',
        }),
    };
  },
  cacheDOM() {
    let key;
    let total;
    let tags;
    for (key in hTags.config.hTagsTotal) {
      if (hTags.config.hTagsTotal.hasOwnProperty(key)) {
        // takes key from hTagsTotal and
        // does a jquery search on the page for element
        tags = jQuery(key);
        // saves the returned array for the display feature
        hTags.config.hTags[key] = tags;
        // display the amount of h tags
        total = tags.length;
        hTags.config.hTagsTotal[key] = total;
      }
    }
    this.$body = jQuery('body');
  },
  buildTool() {
    // fill htag elements container with content
    hTags.config.$hTagsContainer
      .append(hTags.config.$hTagsTitle)
      .append(hTags.config.$hTags);
    // fill display container with h tag elements
    hTags.config.$hTagDisplayContainer
      .append(hTags.config.$hTagDisplay)
      .append(hTags.config.$removeBut);
  },
  displayData() {
    let html = '';
    let key;
    let $hContainer;
    const $hCount = jQuery('<span>')
      .attr({
        class: 'count',
      });

    for (key in hTags.config.hTagsTotal) {
      if (hTags.config.hTagsTotal.hasOwnProperty(key)) {
        $hContainer = jQuery('<div>')
          .attr({
            class: 'hCount',
            id: `${key}Count`,
          })
          .text(`${key} : `);

        $hCount.text(hTags.config.hTagsTotal[key]);

        this.highlightZero($hContainer, $hCount);

        $hContainer.append($hCount);

        html += $hContainer.prop('outerHTML');
      }
    }
    hTags.config.$hTags.html(html);
  },
  tagDetails() {
    let key;
    let length;
    let html = '';

    for (key in hTags.config.hTags) {
      if (hTags.config.hTags.hasOwnProperty(key)) {
        length = hTags.config.hTags[key].length;
        html += `- ${key} -<br>`;

        for (let a = 0; a < length; a += 1) {
          html += `${hTags.config.hTags[key][a].innerHTML}<br>`;
        }
      }
    }
    hTags.config.$hTagDisplay.html(html);
  },
  bindEvents() {
    hTags.config.$hTagsContainer.on('click', this.showDetails.bind(this));
    hTags.config.$removeBut.on('click', this.removeDisplay);
  },
  returnTool() {
    const panel = hTags.config.$hTagsContainer;
    return panel;
  },
  // ----------------------------------------
  // tier 2 functions
  // ----------------------------------------
  highlightZero($hContainer, hCount) {
    const count = jQuery(hCount)
      .text();

    if (count === '0') {
      $hContainer.attr({
        class: 'zeroTotal',
      });
    }
  },
  showDetails() {
    this.$body
      .append(hTags.config.$hTagDisplayContainer);
  },
  removeDisplay() {
    // remove display container
    hTags.config.$hTagDisplayContainer.detach();
  },
};
