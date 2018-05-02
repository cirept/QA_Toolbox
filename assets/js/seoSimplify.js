const seoSimplify = {
  init(callingPanel) {
    this.createElements();
    this.buildElements();
    this.loadData();
    this.cacheDOM(callingPanel);
    this.addTool();
    this.bindEvents();
  },
  // ----------------------------------------
  // tier 1 functions
  // ----------------------------------------
  createElements() {
    seoSimplify.config = {
      $activateButt: jQuery('<button>')
        .attr({
          class: 'myEDOBut',
          id: 'simpleSEO',
          title: 'Simplify My SEO Text',
        })
        .text('SEO Simplify'),
      $removeBut: jQuery('<input>')
        .attr({
          type: 'button',
          class: 'myEDOBut removeDiv',
          value: 'REMOVE',
        }),
      $seoDisplay: jQuery('<div>')
        .attr({
          class: 'inputDisplay',
        }),
      $seoContainer: jQuery('<div>')
        .attr({
          class: 'inputContainer',
        }),
      oems: ['Chevrolet', 'Buick', 'Cadillac', 'GMC', 'Hyundai',
        'Volkswagen',
      ],
      oemFiles: [
        'https://cdn.rawgit.com/cirept/NextGen/master/resources/Chevrolet.json',
        'https://cdn.rawgit.com/cirept/NextGen/master/resources/Buick.json',
        'https://cdn.rawgit.com/cirept/NextGen/master/resources/Cadillac.json',
        'https://cdn.rawgit.com/cirept/NextGen/master/resources/GMC.json',
        'https://cdn.rawgit.com/cirept/NextGen/master/resources/Hyundai.json',
        'https://cdn.rawgit.com/cirept/NextGen/master/resources/Volkswagen.json',
      ],
      vehicles: [],
    };
  },
  buildElements() {
    // attach seo display and remove button to container
    seoSimplify.config.$seoContainer
      .append(seoSimplify.config.$seoDisplay)
      .append(seoSimplify.config.$removeBut);
  },
  loadData() {
    const oems = seoSimplify.config.oemFiles;
    const vehicles = seoSimplify.config.vehicles;
    const xLength = oems.length;

    // load link URL information from oem files
    // and save it into local array
    for (let x = 0; x < xLength; x += 1) {
      this.loadArray(vehicles, oems[x]);
    }
  },
  cacheDOM(callingPanel) {
    this.$otherToolsPanel = jQuery(callingPanel);
    this.body = jQuery('body');
  },
  addTool() {
    this.$otherToolsPanel
      .append(seoSimplify.config.$activateButt);
  },
  bindEvents() {
    seoSimplify.config.$activateButt.on('click', this.simplifySEO.bind(
      this));
    seoSimplify.config.$removeBut.on('click', this.removeDisplay.bind(
      this));
    // add change to text area function
    seoSimplify.config.$seoDisplay.on('click', this.changeToTextarea.bind(
      this));
  },
  // ----------------------------------------
  // tier 2 functions
  // ----------------------------------------
  loadArray(array, filePath) {
    jQuery.getJSON(filePath, (data) => {
      array.push(data);
    });
  },
  simplifySEO() {
    const $input = this.getInput();

    // skip cleaning if input is empty
    if ($input === null || $input === '') {
      return;
    }

    $input = this.cleanUpTags($input);
    $input = this.cleanUpLinks($input);
    this.attachDisplayArea();
    this.displayText($input);
  },
  removeDisplay() {
    // remove display container
    seoSimplify.config.$seoContainer.detach();
    seoSimplify.config.$seoDisplay.empty();
  },
  changeToTextarea(event) {
    const $this = jQuery(event.currentTarget);
    const input = seoSimplify.config.$seoDisplay.html();
    const $seoTextArea = jQuery('<textarea>')
      .attr({
        class: 'inputDisplay',
      });
    $seoTextArea.html(input);
    jQuery($this)
      .replaceWith($seoTextArea);
    $seoTextArea.focus();
    $seoTextArea.blur(this.revertDiv.bind(this));
  },
  // ----------------------------------------
  // tier 3 functions
  // ----------------------------------------
  getInput() {
    const input = prompt('Enter Your SEO Text - HTML format'); // eslint-disable-line no-alert
    const $input = jQuery('<div>');

    // trim input
    input = jQuery.trim(input); // eslint-disable-line no-alert

    // checks if input is empty
    if (input === null || input === '') {
      return '';
    }

    $input.append(input);

    return $input;
  },
  cleanUpTags($input) {
    // remove all empty elements
    $input.find('*:empty')
      .remove();
    $input.find('*')
      .each((index, value) => {
        if (jQuery.trim(jQuery(value)
            .html()) === '') {
          jQuery(value)
            .remove();
        }
      });

    // remove all style attributes
    $input.find('style')
      .remove();
    $input.find('*')
      .removeAttr('style');

    // remove all br elements
    $input.find('br')
      .remove();

    // remove all &nbsp; with ' '
    $input.html($input.html()
      .replace(/&nbsp;/gi, ' '));

    // remove all elements from text
    $input.find('div, font, span, b, strong, i, center, u, p')
      .contents()
      .unwrap();

    // return cleaner input
    return $input;
  },
  cleanUpLinks($input) {
    const allLinks = $input.find('a');
    const len = allLinks.length;
    let linkURL;
    let $this;
    let titleText;

    for (let i = 0; i < len; i += 1) {
      $this = jQuery(allLinks[i]);
      // check if title is empty or undefined
      if (seoSimplify.isUndefined($this, 'title') ||
        seoSimplify.isEmpty($this, 'title')) {
        // sets title to link text
        titleText = $this.text()
          .toString()
          .trim();
        titleText = titleText.substr(0, 1)
          .toUpperCase() + titleText.substr(1);
        $this.attr('title', titleText);
      }
      // check if href is empty or undefined
      if (seoSimplify.isUndefined($this, 'href') ||
        seoSimplify.isEmpty($this, 'href')) {
        // sets href to # if none exists
        $this.attr('href', '#');
      }

      linkURL = $this.attr('href');
      $this.attr('href', seoSimplify.refineURL(linkURL));
      seoSimplify.emptyTarget($this);
    }
    // return cleaner input
    return $input;
  },
  attachDisplayArea() {
    this.body
      .append(seoSimplify.config.$seoContainer);
  },
  displayText($input) {
    // attach input to display
    seoSimplify.config.$seoDisplay
      .empty();
    seoSimplify.config.$seoDisplay
      .append($input.html());
  },
  revertDiv(event) {
    const $this = jQuery(event.target);
    const $thisText = jQuery(event.target)
      .text();
    const $replacementArea = seoSimplify.config.$seoDisplay;

    $replacementArea.html($thisText);

    jQuery($this)
      .replaceWith($replacementArea);

    $replacementArea.click(this.changeToTextarea.bind(this));
  },
  // ----------------------------------------
  // tier 4 functions
  // ----------------------------------------
  isUndefined(elem, attr) {
    if (typeof jQuery(elem)
      .attr(attr) !== 'undefined') {
      return false;
    }
    return true;
  },
  isEmpty(elem, attr) {
    if (jQuery(elem)
      .attr(attr) === '') {
      return true;
    }
    return false;
  },
  refineURL(url) {
    let ezURL = url.split('%');
    const removeThese = ['LINKCONTEXTNAME', 'LINKPAGENAME'];
    const findThis = 'ModelDetails';
    let actualURL;

    ezURL = ezURL.filter(Boolean);
    const nURL = ezURL[0].split('_');

    for (let i = 0; i < nURL.length; i += 1) {
      for (let j = 0; j < removeThese.length; j += 1) {
        if (nURL[i] === removeThese[j]) {
          nURL.splice(i, 1);
        }
      }
    }

    const len = nURL.length;

    for (let x = 0; x < len; x += 1) {
      if (nURL[x] === findThis) {
        actualURL = this.getURL(nURL[len - 1]);
        return actualURL;
      }
      actualURL = nURL[0];
      return actualURL;
    }
  },
  emptyTarget(elem) {
    const $this = elem;
    // if target is undefined or empty remove target attribute
    if (seoSimplify.isUndefined($this, 'target') || seoSimplify.isEmpty(
        $this, 'target')) {
      jQuery(elem)
        .removeAttr('target');
    }
  },
  // ----------------------------------------
  // tier 5 functions
  // ----------------------------------------
  getURL(vehicle) {
    const vehicleArray = vehicle.split(' ');
    let make = 'no match found';
    let model = '';
    const oems = seoSimplify.config.oems;
    const oemsLen = oems.length;
    // var x = 0;
    // var b = 1;
    let detailsURL = '';
    const vehiclesArr = seoSimplify.config.vehicles;

    if (vehicleArray.length >= 3) {
      for (let b = 0; b < vehicleArray.length; b += 1) {
        model += vehicleArray[b];
      }
    } else {
      model = vehicleArray[vehicleArray.length - 1];
    }

    for (let x = 0; x < oemsLen; x += 1) {
      if (vehicleArray[0].indexOf(oems[x]) >= 0) {
        make = oems[x];
        break;
      }
    }

    model = model.trim();
    make = make.toLowerCase();

    // fix this if possible
    jQuery.each(vehiclesArr, (index, oemArray) => {
      jQuery.each(oemArray, (oem, vehiclesArray) => {
        if (oem === make) {
          jQuery.each(vehiclesArray, (ind, vArray) => {
            //                        jQuery.each(vehiclesArray, function (index, vehicleArray) {
            if (model === vArray.name) {
              detailsURL = vArray.url;
              return false; // break out of loop
            }
          });
        }
      });
    });
    return detailsURL;
  },
};
