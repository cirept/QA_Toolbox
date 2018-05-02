/* global jQuery, unsafeWindow, GM_getValue, GM_setValue, GM_setClipboard, GM_openInTab, GM_info, GM_listValues, window, document, NodeFilter */

(function () {
    // ********************************************************************************
    // **************************************** Toolbox Shared Functions ****************************************
    // ********************************************************************************
    const shared = {
        /**
         * Tampermonkey function.
         * Save value to local storage for program to use.
         * @param {string} variable The variable that will be looked up.
         * @param {bool} val The value that the variable will be set too.
         */
        'saveValue': function (variable, val) {
            GM_setValue(variable, val); // eslint-disable-line new-cap
        },
        /**
         * Tampermonkey function.
         * Copy text to the clipboard.
         * @param {string} variable The variable that will be copied to the clipboard.
         */
        'clipboardCopy': function (variable) {
            GM_setClipboard(variable, 'text'); // eslint-disable-line new-cap
        },
        /**
         * Tampermonkey function.
         * Get value to local storage for program to use.
         * @param {string} variable The variable that will be looked up.
         * @return {bool} The saved value of current variable.
         */
        'getValue': function (variable) {
            return GM_getValue(variable, false); // eslint-disable-line new-cap
        },
        /**
         * Tampermonkey function.
         * to retrieve all the program variables from local storage.
         * @return {object} The list of saved values.
         */
        'programVariables': function () {
            return GM_listValues(); // eslint-disable-line new-cap
        },
        /**
         * Tampermonkey function.
         * to open URL in a new tab.
         * @param {string} openThis A URL that will be opened in a new window.
         */
        'openNewTab': function (openThis) {
            GM_openInTab(openThis); // eslint-disable-line
        },
        'nextGenCheck': function () {
            const childNodes = document.childNodes;

            // loop through document child nodes to check if next gen comment exists
            for (let x = 0; x < childNodes.length; x += 1) {
                if (childNodes[x].nodeName.endsWith('comment') && childNodes[x].data.indexOf('Next Gen') > 0) {
                    return true;
                }
            }
            return false;
        },
        'toggleFeature': (e) => {
            const $callingElement = jQuery(e.target).siblings('.toolsPanel');
            return $callingElement.slideToggle(500);
        },
        getResourceUrl: (name) => {
            return GM_getResourceURL(name); // eslint-disable-line
        },
        'saveState': (e) => {
            // get current state
            const vName = jQuery(e.target).siblings('.toolsPanel').attr('id');
            const currState = shared.getValue(vName);
            // sets usingM4 value
            shared.saveValue(vName, !currState);
        },
        setState: function ($panel, state) {
            if (state === 'show') {
                $panel.addClass('appear');
            }

            if (state === 'hide') {
                $panel.addClass('disappear');
            }
        },
        programData: () => {
            const allVariables = shared.programVariables(); // global function
            const length = allVariables.length;
            const varList = {};
            let key = '';
            let value = '';
            // add variables to list
            for (let a = 0; a < length; a += 1) {
                key = allVariables[a];
                value = shared.getValue(key);
                varList[key] = value;
            }
            return varList;
        },
        'buildLegendContent': function ($legendContent, $legendListContainer) {
            let key = '';
            let value = '';
            // loop through Legend Content list
            for (key in $legendContent) {
                if ($legendContent.hasOwnProperty(key)) {
                    if (key === 'unsupportedPageLink' && !shared.nextGenCheck()) {
                        continue;
                    }

                    value = $legendContent[key];
                    // build listing element
                    this.$listItem = jQuery('<li>').attr({
                        'class': key,
                    }).append(value);
                    // attach to legend list
                    $legendListContainer.append(this.$listItem);
                }
            }
        },
        'displayPanel': function ($toolPanel) {
            const variables = this.programData();
            const panelId = $toolPanel.attr('id');
            let state = '';
            let key = '';

            // loop through variable list to find the panel title
            for (key in variables) {
                if (variables.hasOwnProperty(key)) {
                    if (key === panelId) {
                        state = variables[key] ? 'show' : 'hide';
                        shared.setState($toolPanel, state);
                    }
                }
            }
        },
        'addDivOverlay': function (isNextGen, $currentLink, $currentCard) {
            // sets $currentCard to null for tetra site checks
            $currentCard = $currentCard ? $currentCard : null;
            this.cacheDOMOverlayElements($currentLink);
            this.createOverlayElements(isNextGen);
            this.buildOverlayElements(isNextGen);
            this.attachToImage(isNextGen, $currentLink, $currentCard);
            return this.$divOverlay;
        },
        'cacheDOMOverlayElements': function ($currentLink /* , isNextGen*/ ) {
            // IF NEXTGEN SITE
            this.widthOfImage = $currentLink.find('img').width();
            this.heightOfImage = $currentLink.find('img').height();
            this.linkTitle = jQuery($currentLink)[0].innerHTML;
        },
        'createOverlayElements': function (isNextGen) {
            // create div overlay
            if (isNextGen) {
                this.$divOverlay = jQuery('<div>').attr({
                    'class': 'cardOverlay',
                });
            } else {
                this.$divOverlay = jQuery('<div>').attr({
                    'class': 'siteLink imgOverlay',
                });
            }
        },
        'buildOverlayElements': function (isNextGen) {
            if (!isNextGen) {
                // make the div overlay the same dimensions as the image
                this.$divOverlay.css({
                    'width': this.widthOfImage + 'px',
                    'height': this.heightOfImage + 'px',
                });
            }
            // add content to div
            // ADD THE LINK TITLE
            this.$divOverlay.append(this.linkTitle);
        },
        'attachToImage': function (isNextGen, $currentLink, $currentCard) {
            // center div overlay
            try {
                if (isNextGen) {
                    this.$divOverlay.attr({
                        'class': 'imgOverlay myNextGen',
                    });
                    $currentCard.prepend(this.$divOverlay);
                } else {
                    $currentLink.prepend(this.$divOverlay);
                }
            } catch (e) {
                // console.log(e);
                // console.log($currentCard);
                // console.log($currentLink);
            }
        },
        'toggleOverlayClass': function ($currentImage) {
            jQuery($currentImage).toggleClass('overlaid');
        },
        'centerDiv': function ($currentImage, $divOverlay) {
            const parent = $currentImage.closest('figure');
            $divOverlay.css({
                'left': parent.width() / 2 - $divOverlay.width() / 2 + 'px',
            });
            return $divOverlay;
        },
        // FLAG ALL BUTTONS AS A BUTTON ELEMENT
        'flagButtons': function () {
            const buttons = jQuery('body').find(':button');
            const length = buttons.length;

            for (let a = 0; a < length; a += 1) {
                jQuery(buttons[a]).addClass('buttonFlag');
            }
        },
    };

    // ********************************************************************************
    // **************************************** Build container for toolbox ****************************************
    // ********************************************************************************
    const qaToolbox = {
        'init': function () {
            this.createElements();
            this.cacheDOM();
            this.buildElements();
            this.attachTools();
        },
        // ----------------------------------------
        // tier 1 functions
        // ----------------------------------------
        'createElements': function () {
            qaToolbox.config = {
                '$legendContainer': jQuery('<div>').attr({
                    'class': 'legendContainer',
                }),
                '$toolboxContainer': jQuery('<div>').attr({
                    'class': 'toolboxContainer',
                    'id': 'showToolbox',
                }),
                '$changeLogUpdateContainer': jQuery('<div>').attr({
                    'id': 'overlayContainer',
                }),
                '$changeLogDisplay': jQuery('<div>').attr({
                    'id': 'changeLog',
                }),
            };
        },
        'cacheDOM': function () {
            this.body = jQuery('body');
            this.phoneWrapper = jQuery('body .phone-wrapper');
        },
        'buildElements': function () {
            qaToolbox.config.$changeLogUpdateContainer
                .append(qaToolbox.config.$changeLogDisplay);

            // load change log details
            qaToolbox.config.$changeLogDisplay.load('https://cirept.github.io/QA_Toolbox/ChangeLog section');

            // make legend container draggable
            qaToolbox.config.$legendContainer.draggable();
        },
        'attachTools': function () {
            this.body
                .after(qaToolbox.config.$toolboxContainer)
                .after(qaToolbox.config.$legendContainer);
        },
    };

    /* ************************************************************************************************************************ */
    /* **************************************** PAGE INFO TOOLS **************************************** */
    /* ************************************************************************************************************************ */

    // ********************************************************************************
    // **************************************** Dealership Name ****************************************
    // ********************************************************************************
    const dealerName = {
        'init': function () {
            this.createElements();
            this.buildTool();
            this.cacheDOM();
            this.displayData();
            // return finished tool
            return this.returnTool();
        },
        'createElements': function () {
            dealerName.config = {
                '$dealerNameContainer': jQuery('<div>').attr({
                    'id': 'dealerNameContainer',
                }),
                // dealership name title
                '$dealerNameTitle': jQuery('<label>').attr({
                    'class': 'tbLabel',
                }).text('Dealer Name'),
                // dealership name display
                '$dealerName': jQuery('<div>').attr({
                    'class': 'tbInfo',
                    'title': 'Copy Dealership Name',
                    'id': 'dealerName',
                }),
            };
        },
        'buildTool': function () {
            dealerName.config.$dealerNameContainer
                .append(dealerName.config.$dealerNameTitle)
                .append(dealerName.config.$dealerName);
        },
        'cacheDOM': function () {
            this.contextManager = unsafeWindow.ContextManager;
            this.dealerName = this.contextManager.getDealershipName();
        },
        'displayData': function () {
            dealerName.config.$dealerName.html(this.dealerName);
        },
        'returnTool': function () {
            return dealerName.config.$dealerNameContainer;
        },
    };

    // ********************************************************************************
    // **************************************** Web Id ****************************************
    // ********************************************************************************
    const webID = {
        'init': function () {
            this.createElements();
            this.buildTool();
            this.cacheDOM();
            this.displayData();
            // return finished tool
            return this.returnTool();
        },
        'createElements': function () {
            webID.config = {
                '$webIDContainer': jQuery('<div>').attr({
                    'id': 'webIDContainer',
                }),
                // web id title
                '$webIDTitle': jQuery('<label>').attr({
                    'class': 'tbLabel',
                }).text('Web-Id'),
                // web is display
                '$webID': jQuery('<div>').attr({
                    'class': 'tbInfo',
                    'title': 'Copy web-id',
                    'id': 'webID',
                }),
            };
        },
        'buildTool': function () {
            webID.config.$webIDContainer
                .append(webID.config.$webIDTitle);
            webID.config.$webIDContainer
                .append(webID.config.$webID);
        },
        'cacheDOM': function () {
            this.contextManager = unsafeWindow.ContextManager;
            this.webID = this.contextManager.getWebId();
        },
        'displayData': function () {
            webID.config.$webID.html(this.webID);
        },
        'returnTool': function () {
            const panel = webID.config.$webIDContainer;
            return panel;
        },
    };

    // ********************************************************************************
    // **************************************** Page Name ****************************************
    // ********************************************************************************
    const pageName = {
        'init': function () {
            this.createElements();
            this.buildTool();
            this.cacheDOM();
            this.displayData();
            this.toggleVisibility();
            // return finished tool
            return this.returnTool();
        },
        'createElements': function () {
            pageName.config = {
                '$pageNameContainer': jQuery('<div>').attr({
                    'id': 'pageNameContainer',
                }),
                // page name title
                '$pageNameTitle': jQuery('<label>').attr({
                    'class': 'tbLabel',
                }).text('Page Name'),
                // pange name display
                '$pageName': jQuery('<div>').attr({
                    'class': 'tbInfo',
                    'title': 'Copy Page Name',
                    'id': 'pageName',
                }),
                // page label title
                '$pageLabelTitle': jQuery('<label>').attr({
                    'class': 'tbLabel',
                }).text('Custom Page Name'),
                // page label display
                '$pageLabel': jQuery('<div>').attr({
                    'class': 'tbInfo',
                    'title': 'Copy Page Label',
                    'id': 'pageLabel',
                }),
            };
        },
        'buildTool': function () {
            pageName.config.$pageNameContainer
                .append(pageName.config.$pageNameTitle)
                .append(pageName.config.$pageName)
                .append(pageName.config.$pageLabelTitle)
                .append(pageName.config.$pageLabel);
        },
        'cacheDOM': function () {
            this.contextManager = unsafeWindow.ContextManager;
            this.pageName = this.contextManager.getPageName();
            this.pageLabel = this.contextManager.getPageLabel();
        },
        'displayData': function () {
            pageName.config.$pageName.html(this.pageName);
            pageName.config.$pageLabel.html(this.pageLabel);
        },
        'toggleVisibility': function () {
            // hide pagel label elements if name
            // is same as page name
            if (this.pageName === this.pageLabel) {
                pageName.config.$pageLabelTitle.addClass('disappear');
                pageName.config.$pageLabel.addClass('disappear');
            }
        },
        'returnTool': function () {
            const panel = pageName.config.$pageNameContainer;
            return panel;
        },
    };

    // ********************************************************************************
    // **************************************** H Tags ****************************************
    // ********************************************************************************
    const hTags = {
        'init': function () {
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
        'createElements': function () {
            hTags.config = {
                '$hTagsContainer': jQuery('<div>').attr({
                    'id': 'hTagsContainer',
                }),
                '$hTagsTitle': jQuery('<label>').attr({
                    'class': 'tbLabel',
                }).text('h tags'),
                '$hTags': jQuery('<div>').attr({
                    'title': 'Click to show hTags on page',
                    'class': 'hTags',
                }),
                'hTagsTotal': {
                    'h1': 0,
                    'h2': 0,
                    'h3': 0,
                    'h4': 0,
                },
                'hTags': {},
                '$removeBut': jQuery('<input>').attr({
                    'type': 'button',
                    'class': 'myEDOBut removeDiv',
                    'value': 'REMOVE',
                }),
                '$hTagDisplay': jQuery('<div>').attr({
                    'class': 'hTagDisplay',
                }),
                '$hTagDisplayContainer': jQuery('<div>').attr({
                    'class': 'hTagDisplayContainer',
                }),
            };
        },
        'cacheDOM': function () {
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
        'buildTool': function () {
            // fill htag elements container with content
            hTags.config.$hTagsContainer
                .append(hTags.config.$hTagsTitle)
                .append(hTags.config.$hTags);
            // fill display container with h tag elements
            hTags.config.$hTagDisplayContainer
                .append(hTags.config.$hTagDisplay)
                .append(hTags.config.$removeBut);
        },
        'displayData': function () {
            let html = '';
            let key;
            let $hContainer;
            const $hCount = jQuery('<span>').attr({
                'class': 'count',
            });

            for (key in hTags.config.hTagsTotal) {
                if (hTags.config.hTagsTotal.hasOwnProperty(key)) {
                    $hContainer = jQuery('<div>').attr({
                        'class': 'hCount',
                        'id': key + 'Count',
                    }).text(key + ' : ');

                    $hCount.text(hTags.config.hTagsTotal[key]);

                    this.highlightZero($hContainer, $hCount);

                    $hContainer.append($hCount);

                    html += $hContainer.prop('outerHTML');
                }
            }
            hTags.config.$hTags.html(html);
        },
        'tagDetails': function () {
            let key;
            let length;
            let html = '';

            for (key in hTags.config.hTags) {
                if (hTags.config.hTags.hasOwnProperty(key)) {
                    length = hTags.config.hTags[key].length;
                    html += '- ' + key + ' -<br>';

                    for (let a = 0; a < length; a += 1) {
                        html += hTags.config.hTags[key][a].innerHTML + '<br>';
                    }
                }
            }
            hTags.config.$hTagDisplay.html(html);
        },
        'bindEvents': function () {
            hTags.config.$hTagsContainer.on('click', this.showDetails.bind(this));
            hTags.config.$removeBut.on('click', this.removeDisplay);
        },
        'returnTool': function () {
            const panel = hTags.config.$hTagsContainer;
            return panel;
        },
        // ----------------------------------------
        // tier 2 functions
        // ----------------------------------------
        'highlightZero': function ($hContainer, hCount) {
            const count = jQuery(hCount).text();

            if (count === '0') {
                $hContainer.attr({
                    'class': 'zeroTotal',
                });
            }
        },
        'showDetails': function () {
            this.$body
                .append(hTags.config.$hTagDisplayContainer);
        },
        'removeDisplay': function () {
            // remove display container
            hTags.config.$hTagDisplayContainer.detach();
        },
    };

    // ********************************************************************************
    // **************************************** Page Information Panel ****************************************
    // ********************************************************************************
    const pageInformation = {
        'init': function () {
            // initialize module
            this.createElements();
            this.buildPanel();
            this.cacheDOM();
            this.addTool();
            this.bindEvents();
            shared.displayPanel(pageInformation.config.$pageInfo);
        },
        // ----------------------------------------
        // tier 1 functions
        // ----------------------------------------
        'createElements': function () {
            // main panel container
            pageInformation.config = {
                '$pageInfoContainer': jQuery('<div>').attr({
                    'class': 'toolBox',
                    'id': 'pageInfoContainer',
                }),
                // panel title
                '$pageInfoTitle': jQuery('<div>').attr({
                    'class': 'panelTitle',
                    'id': 'pageInfoTitle',
                    'title': 'Click to Minimize/Maximize',
                }).text('Page Information'),
                // tool panel
                '$pageInfo': jQuery('<div>').attr({
                    'class': 'toolsPanel',
                    'id': 'pageInfo',
                }),
            };
        },
        'buildPanel': function () {
            // attach panel elements to container
            pageInformation.config.$pageInfo
                .append(dealerName.init())
                .append(webID.init())
                .append(pageName.init())
                .append(hTags.init());
            // attach to continer
            pageInformation.config.$pageInfoContainer
                .append(pageInformation.config.$pageInfoTitle)
                .append(pageInformation.config.$pageInfo);
        },
        'cacheDOM': function () {
            // DOM elements
            this.$toolBoxContainer = jQuery('.toolboxContainer');
            this.variableList = shared.programData();
        },
        'addTool': function () {
            // add to main toolbox
            this.$toolBoxContainer
                .prepend(pageInformation.config.$pageInfoContainer);
        },
        'bindEvents': function () {
            // minimize
            pageInformation.config.$pageInfoTitle
                .on('click', shared.toggleFeature)
                .on('click', shared.saveState);
            // hover effect & click
            pageInformation.config.$pageInfo
                .on('mouseover mouseleave', '.tbInfo', this.hoverEffect)
                .on('click', '.tbInfo', this.copyToClipboard);
        },
        // ----------------------------------------
        // tier 2 functions
        // ----------------------------------------
        'hoverEffect': function (event) {
            // apply hover effects
            const element = event.currentTarget;
            jQuery(element).toggleClass('highlight');
        },
        'copyToClipboard': function (event) {
            // copy page info
            const copyThisText = event.currentTarget.innerHTML;
            shared.clipboardCopy(copyThisText);
        },
    };

    /* ************************************************************************************************************************ */
    /* **************************************** QA TOOLS **************************************** */
    /* ************************************************************************************************************************ */

    // ********************************************************************************
    // **************************************** QA Tools Panel ****************************************
    // ********************************************************************************
    const qaTools = {
        'init': function () {
            // initialize module
            this.createElements();
            this.buildPanel();
            this.cacheDOM();
            this.addTool();
            this.bindEvents();
            shared.displayPanel(qaTools.config.$mainToolsPanel);
        },
        'createElements': function () {
            qaTools.config = {
                // ----------------------------------------
                // QA Tools Panel
                // ----------------------------------------
                '$mainToolsContainer': jQuery('<div>').attr({
                    'class': 'toolBox',
                    'id': 'mainToolsContainer',
                }),
                '$mainToolsPanel': jQuery('<div>').attr({
                    'class': 'toolsPanel',
                    'id': 'mainTools',
                }),
                '$mainToolsTitle': jQuery('<div>').attr({
                    'class': 'panelTitle',
                    'id': 'mainToolsTitle',
                    'title': 'Click to Minimize/Maximize',
                }).text('QA Tools'),
            };
        },
        'buildPanel': function () {
            // attach to continer
            qaTools.config.$mainToolsContainer
                .append(qaTools.config.$mainToolsTitle)
                .append(qaTools.config.$mainToolsPanel);
        },
        'cacheDOM': function () {
            // DOM elements
            this.$toolBoxContainer = jQuery('.toolboxContainer');
            this.variableList = shared.programData();
        },
        'addTool': function () {
            // add to main toolbox
            this.$toolBoxContainer
                .append(qaTools.config.$mainToolsContainer);
        },
        'bindEvents': function () {
            // minimize
            qaTools.config.$mainToolsTitle
                .on('click', shared.toggleFeature)
                .on('click', shared.saveState);
        },
    };

    // ********************************************************************************
    // **************************************** image checker ****************************************
    // ********************************************************************************
    const imageChecker = {
        'init': function (callingPanel) {
            this.createElements(callingPanel);
            this.buildLegend();
            this.addTool();
            this.bindEvents();
        },
        // ----------------------------------------
        // tier 1
        // ----------------------------------------
        'createElements': function (callingPanel) {
            imageChecker.config = {
                '$activateButt': jQuery('<button>').attr({
                    'class': 'myEDOBut',
                    'id': 'imageChecker',
                    'title': 'Image Alt Checker',
                }).text('Image Alt Checker'),
                '$legend': jQuery('<div>').attr({
                    'class': 'tbLegend imageChecker',
                }),
                '$legendTitle': jQuery('<div>').attr({
                    'class': 'legendTitle',
                }).text('Image Checker Legend'),
                '$legendList': jQuery('<ul>').attr({
                    'class': 'legendList',
                }),
                '$legendContent': {
                    'noAlt': 'No Alt Text',
                    'hasAlt': 'Has Alt Text',
                },
                '$offButt': jQuery('<input>').attr({
                    'type': 'button',
                    'class': 'myEDOBut offButt',
                    'value': 'Turn Off',
                }),
                '$toolsPanel': jQuery(callingPanel),
                '$legendContainer': jQuery('.legendContainer'),
            };
        },
        'buildLegend': function () {
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
                imageChecker.config.$legendList);
        },
        'addTool': function () {
            imageChecker.config.$toolsPanel
                .append(imageChecker.config.$activateButt);
            imageChecker.config.$legendContainer
                .append(imageChecker.config.$legend);
        },
        'bindEvents': function () {
            // main button
            imageChecker.config.$activateButt.on('click', function () {
                jQuery('html, body').scrollTop(0);
                jQuery('html, body').animate({
                    'scrollTop': jQuery(document).height(),
                }, 4000).delay(1750).promise().done(function () {
                    jQuery('html, body').scrollTop(0);
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
        'highlightImages': function () {
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
        'showLegend': function () {
            imageChecker.config.$legend.slideToggle(500);
        },
        'toggleDisable': function () {
            imageChecker.config.$activateButt
                .prop('disabled', function (index, value) {
                    return !value;
                });
        },
        'removeHighlights': function () {
            const iaLength = this.imageArrayLength;
            // removes special overlay class on images
            for (let a = 0; a < iaLength; a += 1) {
                this.toggleOverlayClass(this.$allImages[a]);
            }
            // remove highlight overlay
            jQuery('.imgOverlay').remove();
        },
        // ----------------------------------------
        // tier 3
        // ----------------------------------------
        'cacheDOM': function () {
            this.$allImages = jQuery('body').find('img');
            this.imageArrayLength = this.$allImages.length;
        },
        'addDivOverlay': function ($currentImage) {
            this.cacheDOMOverlayElements($currentImage);
            this.createOverlayElements();
            this.buildOverlayElements();
            this.attachToImage($currentImage);
        },
        'checkForAltText': function (currentImage) {
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
        'cacheDOMOverlayElements': function ($currentImage) {
            this.imageAlt = jQuery($currentImage).attr('alt');
            // gets sizing of images
            this.widthOfImage = jQuery($currentImage).width();
            this.heightOfImage = jQuery($currentImage).height();
        },
        'createOverlayElements': function () {
            // create div overlay
            this.$divOverlay = jQuery('<div>').attr({
                'class': 'imgOverlay',
            });
        },
        'buildOverlayElements': function () {
            // make the div overlay the same dimensions as the image
            this.$divOverlay.css({
                'width': this.widthOfImage + 'px',
                'height': this.heightOfImage + 'px',
            });
            // add image alt as text to div
            this.$divOverlay
                .append(this.imageAlt);
        },
        'attachToImage': function ($currentImage) {
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
        'togClass': function ($image, addClass) {
            $image.siblings('.imgOverlay')
                .toggleClass(addClass);
        },
        // ----------------------------------------
        // tier 5
        // ----------------------------------------
        'toggleOverlayClass': function (currentImage) {
            jQuery(currentImage).toggleClass('overlaid');
        },
    };

    // ********************************************************************************
    // **************************************** link checker ****************************************
    // ********************************************************************************
    const linkChecker = {
        'init': function (callingPanel) {
            this.createElements(callingPanel);
            this.getData();
            this.buildLegend();
            this.addTool();
            this.bindEvents();
        },
        // ----------------------------------------
        // tier 1 functions
        // ----------------------------------------
        'createElements': function (callingPanel) {
            linkChecker.config = {
                '$activateButt': jQuery('<button>').attr({
                    'class': 'myEDOBut',
                    'id': 'linkChecker',
                    'title': 'Check Links',
                }).text('Link Checker'),
                '$legend': jQuery('<div>').attr({
                    'class': 'tbLegend linkChecker',
                }),
                '$legendTitle': jQuery('<div>').attr({
                    'class': 'legendTitle',
                }).text('Link Checker Legend'),
                '$legendList': jQuery('<ul>').attr({
                    'class': 'legendList',
                }),
                '$legendContent': {
                    'noTitle': 'No Title Text',
                    'hasTitle': 'Has Title Text',
                    'opensWindow': 'Opens In A New Window',
                    // 'brokenURL': 'Empty URL',
                    'urlIssue': 'Check URL',
                    'absoluteURL': 'Absolute URL',
                    'unsupportedPageLink': 'Page Not Supported',
                    'buttonFlag': 'Button Element',
                    'linkChecked': 'Clicked Link',
                },
                '$offButt': jQuery('<input>').attr({
                    'type': 'button',
                    'class': 'myEDOBut offButt',
                    'value': 'Turn Off',
                }),
                '$hint': jQuery('<div>').attr({
                    'class': 'hint',
                }).text('ctrl+left click to open link in a new tab'),
                '$toolsPanel': jQuery(callingPanel),
                '$legendContainer': jQuery('.legendContainer'),
                'datedPagesfileURL': 'https://cdn.rawgit.com/cirept/NextGen/a9b9d06f/resources/dated_pages.json',
                'unsupportedPages': {},
            };
        },
        'getData': function () {
            const datedPagesURL = linkChecker.config.datedPagesfileURL;
            jQuery.getJSON(datedPagesURL, function (data) {
                linkChecker.config.unsupportedPages = data.datedPages;
            });
        },
        'buildLegend': function () {
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
                linkChecker.config.$legendList);
        },
        'addTool': function () {
            linkChecker.config.$toolsPanel
                .append(linkChecker.config.$activateButt);
            linkChecker.config.$legendContainer
                .append(linkChecker.config.$legend);
        },
        'bindEvents': function () {
            // main button
            linkChecker.config.$activateButt.on('click', function () {
                jQuery('html, body').scrollTop(0);
                jQuery('html, body').animate({
                    'scrollTop': jQuery(document).height(),
                }, 4000).delay(1750).promise().done(function () {
                    jQuery('html, body').scrollTop(0);
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
        'checkLinks': function () {
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
        'showLegend': function () {
            linkChecker.config.$legend.slideToggle(500);
        },
        'toggleDisable': function () {
            linkChecker.config.$activateButt
                .prop('disabled', function (index, value) {
                    return !value;
                });
        },
        'removeHighlights': function () {
            let key;
            // removes special overlay class on images
            for (key in linkChecker.config.$legendContent) {
                if (linkChecker.config.$legendContent.hasOwnProperty(key)) {
                    this.removeClass(this.$allLinks, key);
                    this.removeClass(jQuery('body').find('button'), key);
                }
            }
            // remove div overlay
            jQuery('.imgOverlay').remove();
            // remove overlaid class
            this.removeClass(this.$allImageLinks, 'overlaid');
            // turn off custom link class
            this.removeClass(this.$allLinks, 'siteLink');
        },
        // ----------------------------------------
        // tier 3 functions
        // ----------------------------------------
        'cacheDOM': function () {
            this.$allLinks = jQuery('body').find('a');
            this.$allImageLinks = this.$allLinks.find('img');
            this.linksArrayLength = this.$allLinks.length;
            this.imageLinksArrayLength = this.$allImageLinks.length;
            //            this.$toolboxStyles = jQuery('#qa_toolbox');
            this.$sections = jQuery('main').find('section');
            this.$otherLinks = jQuery('header, footer').find('a');
        },
        'nextGenSiteCheck': function () {
            const $sections = this.$sections;
            const len = $sections.length;
            //var a = 0;
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
        'tetraSiteCheck': function () {
            const length = this.linksArrayLength;
            //var a = 0;
            let $currentLink;
            let $image;
            let isImageLink;
            let isQLPlink;
            let dataCell;
            let $closestLi;
            //let height;
            //let width;

            // loop through all links on page
            for (let a = 0; a < length; a += 1) {
                // reset variables
                $image = null;
                isImageLink = false;
                isQLPlink = false;
                $currentLink = jQuery(this.$allLinks[a]);

                // skip main nav menu items
                if (typeof $currentLink.attr('class') !== 'undefined') {
                    if ($currentLink.attr('class').indexOf('main') > -1 &&
                        $currentLink.attr('class').indexOf('main') > -1) {
                        continue;
                    }
                }

                $image = $currentLink.find('img');
                isImageLink = this.isImageLink($image);
                // create check for links inside quick links widget
                if ($currentLink.closest('.cell').attr('data-cell')) {
                    dataCell = $currentLink.closest('.cell').attr('data-cell');
                    // check if link is within a quick links widget
                    if (dataCell.indexOf('Quick_Links_Plus') > -1) {
                        // checks if QLP is modified by modules

                        // IF LINK IS INSIDE A QUICK LINKS WIDGET MARK IT AS NOT AN IMAGE LINK
                        // PREPEND DIV OVERLAY INSIDE OF LINK.
                        if ($currentLink.parent().attr('class')) {
                            $closestLi = $currentLink.closest('li');
                            if ($closestLi.attr('class').indexOf('co-card') > -1) {
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
                    let height = jQuery($image).height();
                    let width = jQuery($image).width();

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
        'removeClass': function (array, removeClass) {
            let arrlength = array.length;
            let $obj;
            for (let a = 0; a < arrlength; a += 1) {
                $obj = jQuery(array[a]);
                $obj.removeClass(removeClass);
            }
        },
        // ----------------------------------------
        // tier 4
        // ----------------------------------------
        'testHeaderFooter': function () {
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
        'testCard': function ($currentCard, cardClass, isImageLink) {
            const $cardLinkContainer = $currentCard.find('div.link');
            const $cardSEOContainer = $currentCard.find('div.copy');
            const $cardImageContainer = $currentCard.find('div.media');
            let $cardLinks;
            let myLength;
            let $copyTextLinks;
            let youLength;
            let $currentLink;
            let $linkOverlay;

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
                    $linkOverlay = shared.addDivOverlay(true, $currentLink, $currentCard);
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
        'isImageLink': function ($image) {
            if ($image.length) {
                return true;
            }
            return false;
        },
        'addDivOverlay': function ($currentLink, $currentImage, isQLPlink) {
            this.cacheDOMOverlayElements($currentLink, $currentImage);
            this.createOverlayElements();
            this.buildOverlayElements();

            if (isQLPlink) {
                this.attachToImage($currentImage, $currentLink, isQLPlink);
            } else {
                this.attachToImage($currentImage);
            }
        },
        'runTests': function ($currentLink, isImageLink) {
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
        'bindClickCallback': function ($currentLink, isImageLink) {
            // bind click event
            if (isImageLink) {
                return $currentLink.one('mousedown', this.linkChecked(this.$divOverlay));
            } else {
                return $currentLink.one('mousedown', this.linkChecked($currentLink));
            }
        },
        // ----------------------------------------
        // Tier 5
        // ----------------------------------------
        'testLinks': function ($linkArray, isImageLink) {
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
        'nextgenRunTests': function ($currentLink, $linkOverlay, isImageLink) {
            // check to see if isImageLink parameter was passed
            if (typeof isImageLink === 'undefined') {
                isImageLink = false;
            } else {
                isImageLink = isImageLink;
            }
            // check target of link
            this.checkTargetNextGen($currentLink, $linkOverlay);
            // check title of link
            this.checkForTitleTextNextGen($currentLink, isImageLink, $linkOverlay);
            // check url of link
            this.checkURLNextGen($currentLink, isImageLink, $linkOverlay);
        },
        'cacheDOMOverlayElements': function ($currentLink, $currentImage) {
            this.linkTitle = jQuery($currentLink).find('a').attr('title');
            // gets sizing of images
            this.widthOfImage = jQuery($currentImage).width();
            this.heightOfImage = jQuery($currentImage).height();
        },
        'createOverlayElements': function () {
            // create div overlay
            this.$divOverlay = jQuery('<div>').attr({
                'class': 'imgOverlay',
            });
        },
        'buildOverlayElements': function () {
            // make the div overlay the same dimensions as the image
            this.$divOverlay.attr({
                'class': 'imgOverlay',
            }).css({
                'width': this.widthOfImage + 'px',
                'height': this.heightOfImage + 'px',
            });

            // add content to div
            this.$divOverlay.append(this.linkTitle);
        },
        'attachToImage': function ($currentImage, $currentLink, isQLPlink) {
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
            jQuery($currentImage).before(this.$divOverlay);
        },
        'checkTarget': function ($currentLink, isImageLink) {
            // check if link opens in a new window
            if (this.verifyTarget($currentLink)) {
                if (isImageLink) {
                    this.apndClass(this.$divOverlay, 'opensWindow');
                } else {
                    this.apndClass($currentLink, 'opensWindow');
                }
            }
        },
        'checkForTitleText': function ($currentLink, isImageLink) {
            // text links
            const $obj = isImageLink ? this.$divOverlay : $currentLink;

            if (typeof $currentLink.attr('title') === 'undefined' ||
                $currentLink.attr('title') === '') { // link has no title
                this.apndClass($obj, 'noTitle');
            } else if ($currentLink.attr('title') !== '') { // link has a title
                this.apndClass($obj, 'hasTitle');
            }
        },
        'checkURL': function ($currentLink, isImageLink) {
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
        'linkChecked': function ($currentLink) {
            return function () {
                $currentLink.addClass('linkChecked');
            };
        },
        // ----------------------------------------
        // Tier 6
        // ----------------------------------------
        'checkTargetNextGen': function ($currentLink, $linkOverlay) {
            // check if link opens in a new window
            if (this.verifyTarget($currentLink)) {
                this.apndClass($linkOverlay, 'opensWindow');
            }
        },
        'checkForTitleTextNextGen': function ($currentLink, isImageLink, $linkOverlay) {
            // text links
            if (typeof $currentLink.attr('title') === 'undefined' ||
                $currentLink.attr('title') === '') { // link has no title
                this.apndClass($linkOverlay, 'noTitle');
            } else if ($currentLink.attr('title') !== '') { // link has a title
                this.apndClass($linkOverlay, 'hasTitle');
            }
        },
        'checkURLNextGen': function ($currentLink, isImageLink, $linkOverlay) {
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
        'apndClass': function ($currentLink, addClass) {
            $currentLink.addClass(addClass);
        },
        'verifyTarget': function ($currentLink) {
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
        'checkHref': function (elem) {
            // # will mean that the link is more than likely a button that will be used for JS
            // f_ will only show the content of the page, removing the header and footer of the page
            if (elem.indexOf('#') === 0 || elem.indexOf('f_') === 0) {
                return true;
            }
            return false;
        },
        // check for absolute URL
        'checkAbsoluteURL': function (elem) {
            if (elem.indexOf('www') >= 0 || elem.indexOf('http') >= 0 || elem.indexOf('//') >= 0) {
                return true;
            }
            return false;
        },
        // check if leads to out dated page
        'datedURL': function (elem) {
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

    // ********************************************************************************
    // **************************************** Spell Check ****************************************
    // ********************************************************************************
    const spellCheck = {

        'init': function (callingPanel) {
            this.createElements();
            this.bannedWordsMap();
            this.buildLegend();
            this.cacheDOM(callingPanel);
            this.addTool();
            this.bindEvents();
        },
        // ----------------------------------------
        // tier 1 functions
        // ----------------------------------------
        /**
         * Create all the module DOM elements
         */
        'createElements': function () {
            spellCheck.config = {
                '$activateButt': jQuery('<button>').attr({
                    'class': 'myEDOBut',
                    'id': 'spellCheck',
                    'title': 'Check Spelling',
                }).text('Spellcheck Page'),
                '$offButt': jQuery('<input>').attr({
                    'type': 'button',
                    'class': 'myEDOBut offButt',
                    'value': 'Turn Off',
                }),
                '$legend': jQuery('<div>').attr({
                    'class': 'tbLegend spellCheck',
                }),
                '$legendTitle': jQuery('<div>').attr({
                    'class': 'legendTitle',
                }).text('Spell Check Legend'),
                '$legendList': jQuery('<ul>').attr({
                    'class': 'legendList',
                }),
                '$legendContent': {
                    'spell-check misspelled': 'word misspelled',
                    'spell-check banned': 'Banned by OEM',
                },
                'OEMBannedWordsFile': 'https://rawgit.com/cirept/QA_Toolbox/QuinnTest/resources/OEM_Banned_Words.json',
            };
        },
        /**
         * Build the legend for the tool
         */
        'buildLegend': function () {
            spellCheck.config.$legend
                // attach legend title
                .append(spellCheck.config.$legendTitle)
                // attach list
                .append(spellCheck.config.$legendList)
                // attach turn off button
                .append(spellCheck.config.$offButt)
                // attach hint
                .append(spellCheck.config.$hint);

            // fill list
            shared.buildLegendContent(
                spellCheck.config.$legendContent,
                spellCheck.config.$legendList);
        },
        /**
         * Grab all the information/element references from the DOM
         * that the tool needs to run.
         * @param {object} callingPanel - the main panel that is calling the function
         */
        'cacheDOM': function (callingPanel) {
            this.$toolsPanel = jQuery(callingPanel);
            // DOM elements
            this.$legendContainer = jQuery('.legendContainer');
        },
        /**
         * Add the tool to the QA toolbox
         * Will add the tool to the MAIN TOOLS panel
         */
        'addTool': function () {
            this.$toolsPanel
                .append(spellCheck.config.$activateButt);
            this.$legendContainer
                .append(spellCheck.config.$legend);
        },
        /**
         * binds all the Activate and Off
         */
        'bindEvents': function () {
            // activate button
            spellCheck.config.$activateButt
                .on('click', this.spellCheckPage.bind(this))
                .on('click', this.showLegend)
                .on('click', this.toggleDisable);

            // off button
            spellCheck.config.$offButt
                .on('click', this.removeHighlights.bind(this))
                .on('click', this.showLegend)
                .on('click', this.toggleDisable);
        },
        // ----------------------------------------
        // tier 2 functions
        // ----------------------------------------
        /**
         * traverses the DOM and grabs all visible text
         * @return {object} All the visible text on the page
         */
        'treeWalk': function () {
            let treeWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
            let wordArray = [];

            while (treeWalker.nextNode()) {
                if (treeWalker.currentNode.nodeType === 3) {
                    wordArray.push(treeWalker.currentNode);
                }
            }
            return wordArray;
        },
        'bannedWordsMap': function () {
            const OEMBannedWordsFile = spellCheck.config.OEMBannedWordsFile;
            spellCheck.OEMap = new Map();
            // get banned words JSON
            $.getJSON(OEMBannedWordsFile, function (d) {
                $.each(d, function (key, value) {
                    // sort so that longer words get highlighted over shorter ones
                    spellCheck.OEMap.set(key, value.sort(function (a, b) {
                        return b.length - a.length || a.localeCompare(b);
                    }));
                });
            });
        },
        /**
         * Gets all text on page and tests words against custom dictionary
         */
        'spellCheckPage': function () {
            const dictionary = new Typo('en_US', false, false, { // eslint-disable-line
                'dictionaryPath': 'https://raw.githubusercontent.com/cirept/Typo.js/addingAutofillTags/typo/dictionaries/',
                //                'dictionaryPath': 'https://raw.githubusercontent.com/cirept/Typo.js/master/typo/dictionaries/',
            });
            let wordList = [];
            const self = this;
            let pElm;
            let text;
            let words;
            let elm;
            let unmarked;

            // get all visible text on page
            wordList = this.treeWalk();
            wordList.forEach(function (n) {
                // get all text on the page
                text = n.nodeValue;

                // create an array of seperated words from text string
                words = text.match(/[%’'\w]+/g);

                elm = n.parentElement;

                // skip iteration if no words are found
                if (!words) {
                    return;
                }

                // search each word in array for dictionary match
                // flag word if not found in dictionary
                words.forEach(function (word) {
                    // is word NOT in the dictionary AND NOT a number
                    if (!dictionary.check(self.clean(word)) && !(/^\d+$/).test(word)) {
                        // create regex expression to find word in string
                        // Included (?!@~~) to skip already replaced word in string
                        unmarked = new RegExp('\(' + word + '\)(?!@~~)', 'g');
                        text = text.replace(unmarked, '~~@$&@~~');
                    }
                });

                n.nodeValue = text;

                if (!pElm) {
                    pElm = elm;
                } else if (!pElm.contains(elm)) {
                    self.replaceMarkers(pElm, true);
                    pElm = elm;
                }
            });
            spellCheck.bannedWords();
        },
        /**
         * Highlight all banned words associated with this OEM
         */
        'bannedWords': function () {
            const wordList = this.treeWalk();
            let bannedWords = [];
            let text;
            let pElm;
            let elm;
            let unmarked;
            const self = this;
            const franchises = unsafeWindow.ContextManager.getFranchises();

            // highlight banned words for every OEM related to this
            for (let f = 0, len = franchises.length; f < len; f++) {
                // get banned phrases from OEM franchise
                bannedWords = self.OEMap.get(franchises[f]);

                if (!bannedWords) {
                    return;
                }

                // Check page for banned words
                wordList.forEach(function (n) {
                    text = n.nodeValue;

                    elm = n.parentElement;

                    // skip iteration if no words are found
                    if (!text.match(/[%’'\w]+/g)) {
                        return;
                    }
                    // test text against banned words
                    for (let w = 0, length = bannedWords.length; w < length; w++) {
                        let words = bannedWords[w];
                        // unmarked = new RegExp('\(^|[^~~@])(' + words + '\)(?!@~~)', 'gi');
                        // find and replace banned words
                        unmarked = new RegExp('\(' + words + '\)(?!@~~)', 'gi');
                        text = text.replace(unmarked, '~~@$&@~~');
                    }

                    n.nodeValue = text;
                    // replace when the whole area has been searched
                    if (!pElm) {
                        pElm = elm;
                    } else if (!pElm.contains(elm)) {
                        self.replaceMarkers(pElm, false);
                        pElm = elm;
                    }
                });
            }
        },
        /**
         * Toggle the tools legend
         */
        'showLegend': function () {
            spellCheck.config.$legend.slideToggle(500);
        },
        /**
         * Toggle the 'activate' button from being clicked multiple time
         */
        'toggleDisable': function () {
            /**
            * Sets the 'activate' button to the opposite of its current value
            * @return {boolean} return the opposite of what the current state is
            */
            spellCheck.config.$activateButt.prop('disabled', function (index, value) {
                return !value;
            });
        },
        // ----------------------------------------
        // tier 3 functions
        // ----------------------------------------
        'clean': function (word) {
            return word.replace('’', '\'')
                .replace(/^'*(.*?)'*$/, '$1')
                .replace('%', '\%');
        },
        'replaceMarkers': function (elm, spelling) {
            if (elm) {
                if (spelling) {
                    elm.innerHTML = elm.innerHTML
                        .replace(/~~@(.*?)@~~/g, '<span class="spell-check misspelled">$1</span>');
                } else {
                    elm.innerHTML = elm.innerHTML
                        .replace(/~~@(.*?)@~~/g, '<span class="spell-check banned">$1</span>');
                    if (elm.innerHTML.indexOf('~~@') > -1) {
                        elm.innerHTML = elm.innerHTML
                            .replace(/~~@(.*?)@~~/g, '<span class="spell-check banned">$1</span>');
                    }
                }
            }
        },
        'removeHighlights': function () {
            // remove highlight overlay
            jQuery('span.spell-check').each(function (index, value) {
                jQuery(value).replaceWith(function () {
                    let string = '';
                    for (let x = 0; x < value.childNodes.length; x++) {
                        // debugger;
                        if (value.childNodes[x].nodeValue == null) {
                            string += value.childNodes[x].childNodes[0].nodeValue;
                        } else {
                            string += value.childNodes[x].nodeValue;
                        }
                    }
                    return string;
                });
            });
        },
    };

    // ********************************************************************************
    // **************************************** Test WebPage ****************************************
    // ********************************************************************************
    const speedtestPage = {
        'init': function (callingPanel) {
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
        'createElements': function () {
            speedtestPage.config = {
                '$activateButt': jQuery('<button>').attr({
                    'class': 'myEDOBut',
                    'id': 'testPage',
                    'title': 'Queue up a Page Test',
                }).text('Web Page Test'),
                'email': GM_getValue('email', 'your.name@cdk.com'), // eslint-disable-line
                '$emailTitle': jQuery('<div>').text('Enter your email'),
                '$emailInput': jQuery('<input>').attr({
                    'class': 'WPT email',
                    'id': 'WPTemail',
                    'type': 'text',
                    'placeholder': 'your.name@cdk.com',
                }),
                '$panelContainer': jQuery('<div>').attr({
                    'class': 'WPT input',
                }),
                'browserOptions': {
                    '_IE11': 'IE11',
                    ':Chrome': 'Chrome',
                    ':FireFox': 'Firefox',
                },
                '$browserSelect': jQuery('<select>').attr({
                    'class': 'WPT bSelect',
                    'id': 'WPTbSelect',
                }),
                '$browserTitle': jQuery('<div>').text('Choose a Browser'),
                '$keySelect': jQuery('<select>').attr({
                    'class': 'WPT keySelect',
                    'id': 'WPTkeySelect',
                }),
                'keyOptions': {
                    'key1': 'A.26fc3fe634ca1277825369f20eb25a90',
                    'key2': 'A.1b40e6dc41916bd77b0541187ac9e74b',
                    'key3': 'A.7389884c8e4af7e491458158a283dc7a',
                    'key4': 'A.ad231acf8f2888abaff310981eab805f',
                    'key5': 'A.50f3e84b941c37c0abf2132f3b989196',
                    'key6': 'A.d78638331b63ece0ee419964818f8e8d',
                    'key7': 'A.517503243d1253bf66ea52d153905c41',
                    'key8': 'A.7987f0cf2ec2ac0dc644ec9e6b54f883',
                },
                '$keyTitle': jQuery('<div>').text('Choose Key'),
                'testURL': 'http://www.webpagetest.org/runtest.php?',
                '$sendButt': jQuery('<input>').attr({
                    'type': 'button',
                    'class': 'myEDOBut offButt',
                    'value': 'Send Test',
                }),
            };
        },
        'cacheDOM': function (callingPanel) {
            this.contextManager = unsafeWindow.ContextManager;
            this.siteURL = this.contextManager.getUrl();
            this.pageName = this.contextManager.getPageName();
            this.$toolsPanel = jQuery(callingPanel);
        },
        'buildOptions': function () {
            let $listItem;

            jQuery.each(speedtestPage.config.browserOptions, function (key, text) {
                $listItem = jQuery('<option>').val(key).html(text);
                speedtestPage.config.$browserSelect
                    .append($listItem);
            });

            jQuery.each(speedtestPage.config.keyOptions, function (key, text) {
                $listItem = jQuery('<option>').val(text).html(key);
                speedtestPage.config.$keySelect
                    .append($listItem);
            });
        },
        'buildPanel': function () {
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
        'addTool': function () {
            this.$toolsPanel
                .append(speedtestPage.config.$activateButt)
                .append(speedtestPage.config.$panelContainer);
        },
        'bindEvents': function () {
            speedtestPage.config.$activateButt.on('click', function () {
                speedtestPage.config.$panelContainer.slideToggle(500);
            });

            speedtestPage.config.$sendButt
                .on('click', this.storeData)
                .on('click', this.sendPage.bind(this))
                .on('click', function () {
                    speedtestPage.config.$panelContainer.slideToggle(500);
                });
        },
        // ----------------------------------------
        // tier 2 functions
        // ----------------------------------------
        'storeData': function () {
            // save user input
            const userEmail = jQuery('#WPTemail').val();
            shared.saveValue('email', userEmail);
        },
        'sendPage': function () {
            const browser = jQuery('#WPTbSelect option:selected').val();
            const selectedKey = jQuery('#WPTkeySelect option:selected').val();
            const browserName = jQuery('#WPTbSelect option:selected').text();
            const email = shared.getValue('email');
            const params = {
                'k': selectedKey,
                'runs': '3',
                'fvonly': '1',
                'notify': email,
                'location': 'Dulles' + browser,
            };
            let desktopURL;
            let mobileURL;
            let testURL = speedtestPage.config.testURL;

            // build url
            jQuery.each(params, function (index, value) {
                testURL += index + '=' + value + '&';
            });

            // alert user
            if (shared.nextGenCheck()) {
                desktopURL = testURL + 'url=' + this.siteURL +
                    this.pageName + '?nextGen=true';

                if (confirm('----------------------------------------\n' + // eslint-disable-line no-alert
                        'Test the Desktop and Mobile site?\n' +
                        '----------------------------------------\n' +
                        'Browser : ' + browserName + '\n' +
                        'Send Results To : ' + email + '\n' +
                        '----------------------------------------') === true) {
                    shared.openNewTab(desktopURL);
                }
            } else {
                desktopURL = testURL + 'url=' + this.siteURL +
                    this.pageName + '?device=immobile';

                mobileURL = testURL + 'url=' + this.siteURL +
                    this.pageName + '?device=mobile';

                if (confirm('----------------------------------------\n' + // eslint-disable-line no-alert
                        'Test the Desktop and Mobile site?\n' +
                        '----------------------------------------\n' +
                        'Browser : ' + browserName + '\n' +
                        'Send Results To : ' + email + '\n' +
                        '----------------------------------------') === true) {
                    shared.openNewTab(desktopURL);
                    shared.openNewTab(mobileURL);
                }
            }
        },
    };

    /* ************************************************************************************************************************ */
    /* **************************************** OTHER TOOLS **************************************** */
    /* ************************************************************************************************************************ */

    // ********************************************************************************
    // **************************************** Other Tools Panel ****************************************
    // ********************************************************************************
    const otherTools = {
        'init': function () {
            // initialize module
            this.createElements();
            this.buildPanel();
            this.cacheDOM();
            this.addTool();
            this.bindEvents();
            shared.displayPanel(otherTools.config.$otherToolsPanel);
        },
        'createElements': function () {
            otherTools.config = {
                // ----------------------------------------
                // QA Tools Panel
                // ----------------------------------------
                '$otherToolsContainer': jQuery('<div>').attr({
                    'class': 'toolBox',
                    'id': 'otherToolsContainer',
                }),
                '$otherToolsPanel': jQuery('<div>').attr({
                    'class': 'toolsPanel',
                    'id': 'otherTools',
                }),
                '$otherToolsTitle': jQuery('<div>').attr({
                    'class': 'panelTitle',
                    'id': 'otherToolsTitle',
                    'title': 'Click to Minimize/Maximize',
                }).text('Other Tools'),
            };
        },
        'buildPanel': function () {
            // attach to continer
            otherTools.config.$otherToolsContainer
                .append(otherTools.config.$otherToolsTitle)
                .append(otherTools.config.$otherToolsPanel);
        },
        'cacheDOM': function () {
            // DOM elements
            this.$toolBoxContainer = jQuery('.toolboxContainer');
            this.variableList = shared.programData();
        },
        'addTool': function () {
            // add to main toolbox
            this.$toolBoxContainer
                .append(otherTools.config.$otherToolsContainer);
        },
        'bindEvents': function () {
            // minimize
            otherTools.config.$otherToolsTitle
                .on('click', shared.toggleFeature)
                .on('click', shared.saveState);
        },
    };

    // ********************************************************************************
    // **************************************** Show Navigation ****************************************
    // ********************************************************************************
    const showNavigation = {
        'init': function (callingPanel) {
            this.createElements();
            this.cacheDOM(callingPanel);
            this.buildLegend();
            this.addTool();
            this.bindEvents();
        },
        // ----------------------------------------
        // tier 1 functions
        // ----------------------------------------
        'createElements': function () {
            showNavigation.config = {
                '$activateButt': jQuery('<button>').attr({
                    'class': 'myEDOBut',
                    'id': 'showNavigation',
                    'title': 'Show Navigation (Highlights Major Pages)',
                }).text('Show Navigation'),
                '$offButt': jQuery('<input>').attr({
                    'type': 'button',
                    'class': 'myEDOBut offButt',
                    'value': 'Turn Off',
                }),
                '$legend': jQuery('<div>').attr({
                    'class': 'tbLegend showNavigation',
                }),
                '$legendTitle': jQuery('<div>').attr({
                    'class': 'legendTitle',
                }).text('Show Navigation Legend'),
                '$legendList': jQuery('<ul>').attr({
                    'class': 'legendList',
                }),
                '$legendContent': {
                    'majorPage': 'Major Page',
                    'customPage': 'Landing Page',
                    'linkChecked': 'Link Clicked',
                },
                '$hint': jQuery('<div>').attr({
                    'class': 'hint',
                }).html('ctrl+left click to open link in a new tab.'),
            };
        },
        'cacheDOM': function (callingPanel) {
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
        'buildLegend': function () {
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
                showNavigation.config.$legendList);
        },
        'addTool': function () {
            this.$toolsPanel
                .append(showNavigation.config.$activateButt);
            this.$legendContainer
                .append(showNavigation.config.$legend);
        },
        'bindEvents': function () {
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
        'bindLegendElements': function () {
            const $myMenu = jQuery('nav');
            let findThis;
            let flaggedMajorPages;
            let flaggedCustomPages;
            let flaggedCheckedLinks;

            showNavigation.config.$legendList.children().each(function (index, value) {
                findThis = jQuery(value).attr('class');
                switch (findThis) {
                    case 'majorPage':
                        flaggedMajorPages = $myMenu.find('.' + findThis);
                        jQuery(value).on('click', function () {
                            flaggedMajorPages.toggleClass('majorPage');
                        });
                        break;
                    case 'customPage':
                        flaggedCustomPages = $myMenu.find('.' + findThis);
                        jQuery(value).on('click', function () {
                            flaggedCustomPages.toggleClass('customPage');
                        });
                        break;
                    case 'linkChecked':
                        flaggedCheckedLinks = $myMenu.find('.' + findThis);
                        jQuery(value).on('click', function () {
                            flaggedCheckedLinks.toggleClass('linkChecked');
                        });
                        break;
                }
            });
        },
        // ----------------------------------------
        // tier 2 functions
        // ----------------------------------------
        'toggleFeatures': function () {
            const majorPages = 'a[href*=Form], a[href*=ContactUs], a[href=HoursAndDirections], a[href*=VehicleSearchResults]';

            if (shared.nextGenCheck()) {
                this.$navTabs
                    .toggleClass('showNav customAdd');
                this.$subNavItem
                    .toggleClass('showNav customAdd');
                this.$subNavMenuContainer
                    .toggleClass('showNav nextgenShowNav');
                this.$navTabs.find('a[href*=LandingPage]')
                    .toggleClass('customPage');
                this.$navTabs
                    .find(majorPages)
                    .toggleClass('majorPage');
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
            this.$navTabs.find('.linkChecked').removeClass('linkChecked');
        },
        'toggleDisable': function () {
            showNavigation.config.$activateButt
                .prop('disabled',
                    function (index, value) {
                        return !value;
                    });
        },
        'bindClicks': function () {
            const length = this.$navTabsLinks.length;

            for (let i = 0; i < length; i += 1) {
                jQuery(this.$navTabsLinks[i])
                    .one('mousedown', this.linkChecked(this.$navTabsLinks[i]));
            }
        },
        // ----------------------------------------
        // tier 3 functions
        // ----------------------------------------
        'linkChecked': function (currentLink) {
            return function () {
                jQuery(currentLink).addClass('linkChecked');
            };
        },
    };

    // ********************************************************************************
    // **************************************** View Mobile Site ****************************************
    // ********************************************************************************
    const viewMobile = {
        'init': function (callingPanel) {
            this.createElements();
            this.cacheDOM(callingPanel);
            this.addTool();
            this.bindEvents();
        },
        // ----------------------------------------
        // tier 1 functions
        // ----------------------------------------
        'createElements': function () {
            viewMobile.config = {
                '$activateButt': jQuery('<button>').attr({
                    'class': 'myEDOBut',
                    'id': 'viewMobile',
                    'title': 'View Mobile Site',
                }).text('View Mobile Site'),
            };
        },
        'cacheDOM': function (callingPanel) {
            this.$otherToolsPanel = jQuery(callingPanel);
            this.contextManager = unsafeWindow.ContextManager;
            this.siteURL = this.contextManager.getUrl();
            this.pageName = this.contextManager.getPageName();
        },
        'addTool': function () {
            this.$otherToolsPanel
                .append(viewMobile.config.$activateButt);
        },
        'bindEvents': function () {
            viewMobile.config.$activateButt.on('click', this.viewMobile.bind(this));
        },
        // ----------------------------------------
        // tier 2 functions
        // ----------------------------------------
        'viewMobile': function () {
            const auto = '?device=mobile&nextGen=false';
            const openThis = this.siteURL + this.pageName + auto;
            shared.openNewTab(openThis);
        },
    };

    // ********************************************************************************
    // **************************************** SEO Simplify ****************************************
    // ********************************************************************************
    const seoSimplify = {
        'init': function (callingPanel) {
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
        'createElements': function () {
            seoSimplify.config = {
                '$activateButt': jQuery('<button>').attr({
                    'class': 'myEDOBut',
                    'id': 'simpleSEO',
                    'title': 'Simplify My SEO Text',
                }).text('SEO Simplify'),
                '$removeBut': jQuery('<input>').attr({
                    'type': 'button',
                    'class': 'myEDOBut removeDiv',
                    'value': 'REMOVE',
                }),
                '$seoDisplay': jQuery('<div>').attr({
                    'class': 'inputDisplay',
                }),
                '$seoContainer': jQuery('<div>').attr({
                    'class': 'inputContainer',
                }),
                'oems': ['Chevrolet', 'Buick', 'Cadillac', 'GMC', 'Hyundai', 'Volkswagen'],
                'oemFiles': [
                    'https://cdn.rawgit.com/cirept/NextGen/master/resources/Chevrolet.json',
                    'https://cdn.rawgit.com/cirept/NextGen/master/resources/Buick.json',
                    'https://cdn.rawgit.com/cirept/NextGen/master/resources/Cadillac.json',
                    'https://cdn.rawgit.com/cirept/NextGen/master/resources/GMC.json',
                    'https://cdn.rawgit.com/cirept/NextGen/master/resources/Hyundai.json',
                    'https://cdn.rawgit.com/cirept/NextGen/master/resources/Volkswagen.json',
                ],
                'vehicles': [],
            };
        },
        'buildElements': function () {
            // attach seo display and remove button to container
            seoSimplify.config.$seoContainer
                .append(seoSimplify.config.$seoDisplay)
                .append(seoSimplify.config.$removeBut);
        },
        'loadData': function () {
            const oems = seoSimplify.config.oemFiles;
            const vehicles = seoSimplify.config.vehicles;
            const xLength = oems.length;

            // load link URL information from oem files
            // and save it into local array
            for (let x = 0; x < xLength; x += 1) {
                this.loadArray(vehicles, oems[x]);
            }
        },
        'cacheDOM': function (callingPanel) {
            this.$otherToolsPanel = jQuery(callingPanel);
            this.body = jQuery('body');
        },
        'addTool': function () {
            this.$otherToolsPanel
                .append(seoSimplify.config.$activateButt);
        },
        'bindEvents': function () {
            seoSimplify.config.$activateButt.on('click', this.simplifySEO.bind(this));
            seoSimplify.config.$removeBut.on('click', this.removeDisplay.bind(this));
            // add change to text area function
            seoSimplify.config.$seoDisplay.on('click', this.changeToTextarea.bind(this));
        },
        // ----------------------------------------
        // tier 2 functions
        // ----------------------------------------
        'loadArray': function (array, filePath) {
            jQuery.getJSON(filePath, function (data) {
                array.push(data);
            });
        },
        'simplifySEO': function () {
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
        'removeDisplay': function () {
            // remove display container
            seoSimplify.config.$seoContainer.detach();
            seoSimplify.config.$seoDisplay.empty();
        },
        'changeToTextarea': function (event) {
            const $this = jQuery(event.currentTarget);
            const input = seoSimplify.config.$seoDisplay.html();
            const $seoTextArea = jQuery('<textarea>').attr({
                'class': 'inputDisplay',
            });
            $seoTextArea.html(input);
            jQuery($this).replaceWith($seoTextArea);
            $seoTextArea.focus();
            $seoTextArea.blur(this.revertDiv.bind(this));
        },
        // ----------------------------------------
        // tier 3 functions
        // ----------------------------------------
        'getInput': function () {
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
        'cleanUpTags': function ($input) {
            // remove all empty elements
            $input.find('*:empty').remove();
            $input.find('*').each(function (index, value) {
                if (jQuery.trim(jQuery(value).html()) === '') {
                    jQuery(value).remove();
                }
            });

            // remove all style attributes
            $input.find('style').remove();
            $input.find('*').removeAttr('style');

            // remove all br elements
            $input.find('br').remove();

            // remove all &nbsp; with ' '
            $input.html($input.html().replace(/&nbsp;/gi, ' '));

            // remove all elements from text
            $input.find('div, font, span, b, strong, i, center, u, p')
                .contents()
                .unwrap();

            // return cleaner input
            return $input;
        },
        'cleanUpLinks': function ($input) {
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
                    titleText = $this.text().toString().trim();
                    titleText = titleText.substr(0, 1).toUpperCase() + titleText.substr(1);
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
        'attachDisplayArea': function () {
            this.body
                .append(seoSimplify.config.$seoContainer);
        },
        'displayText': function ($input) {
            // attach input to display
            seoSimplify.config.$seoDisplay
                .empty();
            seoSimplify.config.$seoDisplay
                .append($input.html());
        },
        'revertDiv': function (event) {
            const $this = jQuery(event.target);
            const $thisText = jQuery(event.target).text();
            const $replacementArea = seoSimplify.config.$seoDisplay;

            $replacementArea.html($thisText);

            jQuery($this).replaceWith($replacementArea);

            $replacementArea.click(this.changeToTextarea.bind(this));
        },
        // ----------------------------------------
        // tier 4 functions
        // ----------------------------------------
        'isUndefined': function (elem, attr) {
            if (typeof jQuery(elem).attr(attr) !== 'undefined') {
                return false;
            } else {
                return true;
            }
        },
        'isEmpty': function (elem, attr) {
            if (jQuery(elem).attr(attr) === '') {
                return true;
            } else {
                return false;
            }
        },
        'refineURL': function (url) {
            let ezURL = url.split('%');
            const removeThese = ['LINKCONTEXTNAME', 'LINKPAGENAME'];
            const findThis = 'ModelDetails';
            let actualURL;

            ezURL = ezURL.filter(Boolean);
            let nURL = ezURL[0].split('_');

            for (let i = 0; i < nURL.length; i += 1) {
                for (let j = 0; j < removeThese.length; j += 1) {
                    if (nURL[i] === removeThese[j]) {
                        nURL.splice(i, 1);
                    }
                }
            }

            let len = nURL.length;

            for (let x = 0; x < len; x += 1) {
                if (nURL[x] === findThis) {
                    actualURL = this.getURL(nURL[len - 1]);
                    return actualURL;
                } else {
                    actualURL = nURL[0];
                    return actualURL;
                }
            }
        },
        'emptyTarget': function (elem) {
            const $this = elem;
            // if target is undefined or empty remove target attribute
            if (seoSimplify.isUndefined($this, 'target') || seoSimplify.isEmpty($this, 'target')) {
                jQuery(elem).removeAttr('target');
            }
        },
        // ----------------------------------------
        // tier 5 functions
        // ----------------------------------------
        'getURL': function (vehicle) {
            const vehicleArray = vehicle.split(' ');
            let make = 'no match found';
            let model = '';
            const oems = seoSimplify.config.oems;
            const oemsLen = oems.length;
            //var x = 0;
            //var b = 1;
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
            jQuery.each(vehiclesArr, function (index, oemArray) {
                jQuery.each(oemArray, function (oem, vehiclesArray) {
                    if (oem === make) {
                        jQuery.each(vehiclesArray, function (ind, vArray) {
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

    // ********************************************************************************
    // **************************************** add widget outlines ****************************************
    // ********************************************************************************
    const widgetOutlines = {
        'init': function (callingPanel) {
            this.createElements();
            this.cacheDOM(callingPanel);
            this.addTool();
            this.bindEvents();
        },
        'createElements': function () {
            widgetOutlines.config = {
                '$activateButt': jQuery('<button>').attr({
                    'class': 'myEDOBut',
                    'id': 'widgetOutline',
                    'title': 'Show Widget Outlines',
                }).text('Show Widgets'),
            };
        },
        'cacheDOM': function (callingPanel) {
            this.$toolsPanel = jQuery(callingPanel);
            this.$toolboxStyles = jQuery('#qa_toolbox');
            this.$editableWidgets = jQuery('body .cell .CobaltEditableWidget');
            this.$cobaltWidgets = jQuery('body .cell .CobaltWidget');
            this.overlayStyles = [];
        },
        'addTool': function () {
            this.$toolsPanel
                .append(widgetOutlines.config.$activateButt);
        },
        'bindEvents': function () {
            widgetOutlines.config.$activateButt.on('click', this.showWidgets.bind(this));
        },
        'showWidgets': function () {
            this.addOverlay(this.$editableWidgets);
            this.addOverlay(this.$cobaltWidgets);
            this.addCustomStyles(this);
        },
        'addCustomStyles': function () {
            const self = this;
            jQuery(this.overlayStyles).each(function (index, value) {
                self.$toolboxStyles.append(value);
            });
        },
        'addOverlay': function (array) {
            const self = this;
            jQuery(array).each(function (index, value) {
                const $currentObject = jQuery(value);
                const widgetID = $currentObject.attr('id');
                const toolClass = 'showWidgetData';
                const w = $currentObject.width();
                const h = $currentObject.height();
                const addThis = `#${widgetID}.${toolClass}:after { height: ${h}px; width: ${w}px;}`;

                // add tool class
                $currentObject.addClass('showWidgetData');
                self.bindClickCallback($currentObject, widgetID);
                $currentObject.attr({
                    'title': 'Click to Copy Widget ID',
                });

                // add height and width data to widget element
                $currentObject.attr({
                    'data-content': widgetID + ' :: ' + w + 'px X ' + h + 'px',
                });

                // save custom css styles that will be added to the toolbox css styles later
                self.overlayStyles.push(addThis);
            });
        },
        'bindClickCallback': function ($currentObject, widgetID) {
            // bind click event
            return $currentObject.on('click', this.copyWidgetID($currentObject, widgetID));
        },
        'copyWidgetID': function ($currentObject, widgetID) {
            // make element blink when user clicks to copy widget ID
            // for verification purposes
            return function () {
                $currentObject
                    .fadeIn(300)
                    .fadeOut(300)
                    .fadeIn(300);
                shared.clipboardCopy(widgetID);
            };
        },
    };

    // ********************************************************************************
    // **************************************** broken link checker ****************************************
    // ********************************************************************************
    const checkLinks = {
        'init': function (callingPanel) {
            this.createElements();
            this.cacheDOM(callingPanel);
            this.buildLegend();
            this.addTool();
            this.bindEvents();
        },
        'createElements': function () {
            checkLinks.config = {
                '$activateButt': jQuery('<button>').attr({
                    'class': 'myEDOBut',
                    'id': '404checker',
                    'title': '404 Checker',
                }).text('404 Link Checker'),
                '$legend': jQuery('<div>').attr({
                    'class': 'tbLegend checkLinks',
                }),
                '$legendTitle': jQuery('<div>').attr({
                    'class': 'legendTitle',
                }).text('404 Link Checker Legend'),
                '$legendList': jQuery('<ul>').attr({
                    'class': 'legendList',
                }),
                '$legendContent': {
                    'otherDomain': 'Absolute URL*',
                    'opensWindow': 'Opens In A New Window',
                    'jumpLink': 'Jump Link or "#" URL',
                    'attention': 'URL Empty or Undefined',
                    'mobilePhoneLink': 'Mobile Link',
                    'buttonFlag': 'Button Element',
                    'success': 'Link is Real',
                    'error': '404 Link',
                },
                '$offButt': jQuery('<input>').attr({
                    'type': 'button',
                    'class': 'myEDOBut offButt',
                    'value': 'remove legend',
                }),
                '$subText': jQuery('<div>').attr({
                    'class': 'subText hint',
                }).text('* Manually Check Link'),
                '$container': jQuery('<div>').attr({
                    'class': 'checkContainer',
                }),
                '$message': jQuery('<div>').attr({
                    'class': 'checkMessage',
                }),
                '$counter': jQuery('<div>').attr({
                    'id': 'count404',
                }),
                '$iconContainer': jQuery('<div>').attr({
                    'id': 'iconContainer',
                }),
                '$thinking': jQuery('<i id="loading" class="fa fa-spinner fa-pulse fa-3x fa-fw"></i><span class="sr-only">Loading...</span>'),
                '$done': jQuery('<i class="fa fa-check-circle fa-3x fa-fw"></i>'),
                '$hint': jQuery('<div>').attr({
                    'class': 'hint',
                }).text('refresh page before running 404 checker again'),
                'count': 1,
                'totalTests': 0,
                'totalLinks': 0, // for future error reporting
                'errors': 0, // for future error reporting
            };
        },
        'cacheDOM': function (callingPanel) {
            this.contextManager = unsafeWindow.ContextManager;
            this.webID = this.contextManager.getWebId();
            this.siteID = this.contextManager.getSiteId();
            this.baseURL = this.contextManager.getUrl();
            this.host = window.location.hostname;
            this.wid = this.separateID(this.webID);
            this.$toolsPanel = jQuery(callingPanel);
            this.$legendContainer = jQuery('.legendContainer');
            this.isNextGen = this.nextGenCheck;
            this.$otherLinks = jQuery('header, footer').find('a');
        },
        'buildLegend': function () {
            checkLinks.config.$legend
                .append(checkLinks.config.$legendTitle)
                .append(checkLinks.config.$legendList)
                .append(checkLinks.config.$subText)
                .append(checkLinks.config.$offButt)
                .append(checkLinks.config.$hint);
            // fill list
            shared.buildLegendContent(
                checkLinks.config.$legendContent,
                checkLinks.config.$legendList);
            // attach filled list
            this.$legendContainer
                .append(checkLinks.config.$legend);
            checkLinks.config.$legend
                .prepend(checkLinks.config.$container);
        },
        'addTool': function () {
            this.$toolsPanel
                .append(checkLinks.config.$activateButt);
        },
        'bindEvents': function () {
            // main button
            checkLinks.config.$activateButt.on('click', function () {
                jQuery('html, body').scrollTop(0);
                jQuery('html, body').animate({
                    'scrollTop': jQuery(document).height(),
                }, 4000).delay(1750).promise().done(function () {
                    jQuery('html, body').scrollTop(0);
                    shared.flagButtons();
                    checkLinks.toggleDisable();
                    checkLinks.showLegend();
                    checkLinks.ajaxStart();
                    checkLinks.ajaxStop();
                    checkLinks.platformChooser();
                });
            });

            checkLinks.config.$offButt.on('click', this.showLegend);
        },
        // Img Overlay Functions for Card-Clickable-V2
        'addDivOverlay': function ($currentImage) {
            this.cacheDOMOverlayElements($currentImage);
            this.createOverlayElements();
            this.buildOverlayElements();
            this.attachOverlayToImage($currentImage);
            return this.$divOverlay;
        },
        'cacheDOMOverlayElements': function ($currentImage) {
            this.imageAlt = jQuery($currentImage)[0].innerHtml;
            // gets sizing of images
            this.widthOfImage = jQuery($currentImage).width();
            this.heightOfImage = jQuery($currentImage).height();
        },
        'createOverlayElements': function () {
            // create div overlay
            this.$divOverlay = jQuery('<div>').attr({
                'class': 'imgOverlay',
            });
        },
        'buildOverlayElements': function () {
            // make the div overlay the same dimensions as the image
            this.$divOverlay.css({
                'width': this.widthOfImage + 'px',
                'height': this.heightOfImage + 'px',
            });
        },
        'attachOverlayToImage': function ($currentImage) {
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
        'toggleOverlayClass': function (currentImage) {
            jQuery(currentImage).toggleClass('overlaid');
        },
        // ----------------------------------------
        // tier 1 functions
        // ----------------------------------------

        'platformChooser': function () {
            const isNextGen = shared.nextGenCheck();
            if (isNextGen) {
                this.nextgenTestLinks();
            } else {
                this.tetraTestLinks();
            }
        },
        'tetraTestLinks': function () {
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
        'addURLParameter': function ($currentLink) {
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
        'testURLs': function ($currentLink) {
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
            } else if (linkURL.indexOf('www') > -1 || linkURL.indexOf('://') > -1) { // test for absolute path URLs
                if (isImageLink) {
                    if ($linkOverlay === null) {
                        $linkOverlay = shared.addDivOverlay(isNextGen, $currentLink);
                    }
                    $linkOverlay.addClass('otherDomain');
                } else {
                    $currentLink.addClass('otherDomain');
                }
                return true; // TEST THE ABSOLUTE URL REGARDLESS
            } else {
                return true;
            }
        },
        'nextgenTestLinks': function () {
            let $currentCard;
            const $sections = jQuery('main').find('section');
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
        'checkCard': function ($currentCard) {
            // debugger;
            let $cardLinkContainer = $currentCard.children('div.content').find('div.link');
            let $cardSEOContainer = $currentCard.children('div.content').find('div.copy');
            let $cardImageContainer = $currentCard.children('div.content').find('div.media');
            const cardClass = $currentCard.attr('class') ? $currentCard.attr('class') : '';
            let isImageLink = false;
            let $cardLinks;
            let $copyTextLinks;
            let meLength;
            let youLength;
            let $currentLink;
            //            var $image;

            if (cardClass.indexOf('link-clickable') > -1 || cardClass.indexOf('none-clickable') > -1) {
                // CHECK ALL LINKS DEFINED IN CARD SETTINGS
                // ----------------------------------------
                // get all links defined in card
                // should include all primary, secondary, and tenary links
                // debugger;
                $cardLinks = $cardLinkContainer.find('a'); // this is an array
                meLength = $cardLinks.length;
                if (meLength > 0) {
                    // set total tests to number of links on page
                    checkLinks.config.totalTests = checkLinks.config.totalTests + meLength;
                    this.testLinks($cardLinks);
                }

                // CHECK ALL LINKS DEFINED IN SEO TEXT in COPY of RECORD
                // ----------------------------------------
                // get all text links in copy text of card
                $copyTextLinks = $cardSEOContainer.find('a');
                youLength = $copyTextLinks.length;
                if (youLength > 0) {
                    // set total tests to number of links on page
                    checkLinks.config.totalTests = checkLinks.config.totalTests + youLength;
                    this.testLinks($copyTextLinks);
                }
            } else if (cardClass.indexOf('card-clickable-v2') > -1 || cardClass.indexOf('card-clickable') > -1) {
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
                    $currentLink = $cardLinkContainer.find('a[class*="primary"]:first');
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
                        checkLinks.config.totalTests = checkLinks.config.totalTests + meLength;
                        this.testLinks($cardLinks);
                    }

                    // TEST TEXT LINKS IN THE COPY OF THE CARD
                    // check copy container and grab all links
                    $copyTextLinks = $cardSEOContainer.find('a');
                    youLength = $copyTextLinks.length;
                    if (youLength > 0) {
                        // set total tests to number of links on page
                        checkLinks.config.totalTests = checkLinks.config.totalTests + youLength;
                        this.testLinks($copyTextLinks);
                    }
                }
            }
        },
        /**
         * TEST LINKS FOUND IN HEADER AND FOOTER OF SITE
         * TESTS TO BODY LINKS WILL BE HANDLED DIFFERENTLY
         */
        'testHeaderFooter': function () {
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
        'testLinks': function ($linkArray) {
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
        'isImageLink': function ($image) {
            if ($image.length) {
                return true;
            }
            return false;
        },
        // checks the data returned for KEY 404 indentifiers
        // will return TRUE if a identifier is found
        // will return FALSE if no identifier is found
        'checkFor404': function (data) {
            // checks the returned page for key 404 identifiers
            if (data.indexOf('pageNotFound') > -1 || data.indexOf('not currently a functioning page') > -1) {
                return true;
            }
            return false;
        },
        // checks if the current link is within a QUICK LINKS PLUS WIDGET modified by EDO modules
        // Will return false if link is inside a QLP widget
        'checkForQuickLinksWidget': function ($currentLink) {
            // create check for links inside quick links widget
            if ($currentLink.closest('.cell').attr('data-cell')) {
                // check if link is within a quick links widget
                if ($currentLink.closest('.cell').attr('data-cell').indexOf('Quick_Links_Plus') > -1) {
                    // checks if QLP is modified by modules
                    if ($currentLink.closest('section').attr('class').indexOf('customTemplate') === -1) {
                        return false;
                    }
                }
            }
        },
        // adds classes to DOM element that the user will be able to see
        // classes will make it clear to the user via CSS that is already added to the site
        'addFlagsToElements': function ($visualElement, pageError404) {
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
        'ajaxTest': function ($currentLink, isImageLink, $currentCard) {
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
                cardClass = $currentCard.attr('class') ? $currentCard.attr('class') : '';
                if (cardClass.indexOf('card-clickable-v2') > -1) {
                    $currentCard.remove('.imgOverlay');
                    $currentImg = jQuery($currentCard.find('img')[0]);
                    $linkOverlay = this.addDivOverlay($currentImg);
                } else {
                    $linkOverlay = shared.addDivOverlay(isNextGen, $currentLink, $currentCard);
                }
                if ($currentLink.attr('target') === '_blank' ||
                    $currentLink.attr('target') === '_new' ||
                    $currentLink.attr('target') === 'custom') {
                    $linkOverlay.addClass('opensWindow');
                }
                href = jQuery($currentLink).attr('href');
                // try in case theres a problem with href
                try {
                    currentURL = jQuery.trim(href);
                    if (currentURL.indexOf('www') > -1 || currentURL.indexOf('://') > -1) {
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
                'url': linkURL, // be sure to check the right attribute
                'type': 'post',
                'crossDomain': true,
                'method': 'get',
                'dataType': 'html',
                'success': function (data) {
                    if (!isNextGen) {
                        // checks to see if link is an image link
                        hasImage = $currentLink.has('img').length;
                        if (hasImage) {
                            isImageLink = true;
                            $linkOverlay = shared.addDivOverlay(isNextGen, $currentLink);
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
                            checkLinks.addFlagsToElements($linkOverlay, pageError404);
                        } else {
                            checkLinks.addFlagsToElements($currentLink, pageError404);
                        }
                    }
                    if (isNextGen) {
                        // check to see if the card has an image prior to startin the ajax testing
                        /*
                        if (isImageLink) {
                            $linkOverlay = shared.addDivOverlay(isNextGen, $currentLink, $currentCard);

                        }*/
                        // If value is false all class modifications should be done to the link itself
                        pageError404 = checkLinks.checkFor404(data);

                        // if link is an image link
                        // ADD CLASS FLAGS TO DIV OVERLAY
                        // OTHERWISE ADD CLASS FLAGS TO LINK ELEMENT
                        if (isImageLink) {
                            checkLinks.addFlagsToElements($linkOverlay, pageError404);
                        } else {
                            checkLinks.addFlagsToElements($currentLink, pageError404);
                        }
                    }
                },
                'error': function (jqXHR) {
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
                'statusCode': {
                    '404': function () {
                        $currentLink.addClass('fourOfour');

                        if (isImageLink) {
                            checkLinks.error($linkOverlay);
                        } else {
                            checkLinks.error($currentLink);
                        }

                        checkLinks.config.errors += 1;
                    },
                },
                'complete': function () {
                    checkLinks.config.count += 1;
                    checkLinks.config.$counter.text(checkLinks.config.count + ' of ' + checkLinks.config.totalTests);
                },
            });
        },
        'showURL': function ($currentLink, isImageLink, $linkOverlay) {
            const linkURL = jQuery.trim($currentLink.attr('href'));

            // went with putting the URL in the title of the link vs.
            // appending it to the link text for a cleaner look
            $currentLink.attr('title', linkURL);

            // linkURL = '<br><span class="tooltiptext link_url">URL: ' + linkURL + '</span>';
            // if (isImageLink) {
            //     if ($linkOverlay[0].innerHTML.indexOf(linkURL) === -1) {
            //         if ($linkOverlay !== null) {
            //             $linkOverlay.append(linkURL);
            //         }
            //     }
            // } else {
            //     if ($currentLink[0].innerHTML.indexOf(linkURL) === -1) {
            //         $currentLink.append(linkURL);
            //     }
            // }
        },

        'toggleDisable': function () {
            checkLinks.config.$activateButt.prop('disabled', function (index, value) {
                return !value;
            });
        },
        'showLegend': function () {
            checkLinks.config.$legend.slideToggle(500);
        },
        'separateID': function (myWebID) {
            const split = myWebID.split('-');
            return split[1];
        },
        'ajaxStart': function () {
            jQuery(document).ajaxStart(function () {
                checkLinks.config.$message
                    .text('checking links')
                    .append(checkLinks.config.$counter)
                    .append(checkLinks.config.$iconContainer)
                    .append(checkLinks.config.$thinking);
                checkLinks.config.$container
                    .append(checkLinks.config.$message);
            });
        },
        'ajaxStop': function () {
            jQuery(document).ajaxStop(function () {
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
                    .fadeOut(2000,
                        function () {
                            checkLinks.config.$container
                                .remove();
                        });
            });
        },
        'error': function ($this) {
            // ITS SUPPOSED TO ADD THE ERROR CLASS TO THE DIV OVERLAY IF THE LINK IS AN IMAGE LINK
            $this.addClass('error');
        },
        'success': function ($this) {
            $this.addClass('success');
        },
    };

    /* ************************************************************************************************************************ */
    /* **************************************** URL MODIFIER TOOLS **************************************** */
    /* ************************************************************************************************************************ */

    // ********************************************************************************
    // **************************************** next gen toggle ****************************************
    // ********************************************************************************
    const nextGenToggle = {
        'init': function (callingPanel) {
            this.createElements();
            this.buildTool();
            this.cacheDOM(callingPanel);
            this.setToggle();
            this.addTool();
            this.bindEvents();
        },
        // ----------------------------------------
        // tier 1 functions
        // ----------------------------------------
        'createElements': function () {
            nextGenToggle.config = {
                '$nextGenTogContainer': jQuery('<div>').attr({
                    'id': 'nextGenToggleInput',
                    'class': 'toggleTool',
                    'title': 'Apply NextGen=true',
                }),
                '$nextGenTogTitle': jQuery('<div>')
                    .text('nextGen parameters?'),
                '$nextGenTogIcon': jQuery('<div>').attr({
                    'id': 'nextGenToggleIcon',
                }),
                '$FAtoggle': jQuery('<i class="fa fa-toggle-off fa-lg"></i>'),
            };
        },
        'buildTool': function () {
            nextGenToggle.config.$nextGenTogIcon.append(nextGenToggle.config.$FAtoggle);
            nextGenToggle.config.$nextGenTogContainer
                .append(nextGenToggle.config.$nextGenTogTitle)
                .append(nextGenToggle.config.$nextGenTogIcon);
        },
        'cacheDOM': function (callingPanel) {
            this.$toolsPanel = jQuery(callingPanel);
        },
        'setToggle': function () {
            if (shared.getValue('isNextGen')) {
                // if 'nextGen' value is true
                // set toggle and apply parameters
                this.toggleOn();
            } else {
                // if 'nextGen' value is false
                // set toggle and apply parameters
                this.toggleOff();
            }
        },
        'addTool': function () {
            // add to main toolbox
            this.$toolsPanel.append(nextGenToggle.config.$nextGenTogContainer);
        },
        'bindEvents': function () {
            // bind FA toggle with 'flipTheSwitch' action
            nextGenToggle.config.$nextGenTogContainer.on('click', this.flipTheSwitch.bind(this));
        },
        // ----------------------------------------
        // tier 2 functions
        // ----------------------------------------
        'toggleOn': function () {
            // set toggle on image
            const $toggle = nextGenToggle.config.$FAtoggle;
            $toggle
                .removeClass('fa-toggle-off')
                .addClass('fa-toggle-on');
        },
        'toggleOff': function () {
            // set toggle off image
            const $toggle = nextGenToggle.config.$FAtoggle;
            $toggle
                .removeClass('fa-toggle-on')
                .addClass('fa-toggle-off');
        },
        'flipTheSwitch': function () {
            // set saved variable to opposite of current value
            const toggle = shared.getValue('isNextGen');
            shared.saveValue('isNextGen', !toggle);

            // set toggle
            this.setToggle();
        },
        // ----------------------------------------
        // tier 3 functions
        // ----------------------------------------
        'hasParameters': function () {
            // determine if site URL already has custom parameters
            if (window.location.href.indexOf('nextGen=') >= 0) {
                return true;
            } else {
                return false;
            }
        },
        'siteState': function () {
            // return page variable
            return unsafeWindow.ContextManager.getVersion();
        },
        // ----------------------------------------
        // other functions
        // ----------------------------------------
        'isToggleOn': function () {
            return shared.getValue('isNextGen');
        },
    };

    // ********************************************************************************
    // **************************************** m4 checkbox toggle ****************************************
    // ********************************************************************************
    const m4Check = {
        'init': function (callingPanel) {
            this.createElements();
            this.buildTool();
            this.cacheDOM(callingPanel);
            this.setToggle();
            this.addTool();
            this.bindEvents();
        },
        // ----------------------------------------
        // tier 1 functions
        // ----------------------------------------
        'createElements': function () {
            m4Check.config = {
                '$m4Container': jQuery('<div>').attr({
                    'id': 'm4Input',
                    'class': 'toggleTool',
                    'title': 'Apply relative and comments parameters',
                }),
                '$m4CheckTitle': jQuery('<div>')
                    .text('M4 Parameters?'),
                '$m4Checkbox': jQuery('<div>').attr({
                    'id': 'm4toggle',
                }),
                '$FAtoggle': jQuery('<i class="fa fa-toggle-off fa-lg"></i>'),
            };
        },
        'buildTool': function () {
            m4Check.config.$m4Checkbox
                .append(m4Check.config.$FAtoggle);
            m4Check.config.$m4Container
                .append(m4Check.config.$m4CheckTitle)
                .append(m4Check.config.$m4Checkbox);
        },
        'setToggle': function () {
            if (shared.getValue('usingM4')) { // if 'usingM4 is turned on'
                // set toggle and apply parameters
                this.toggleOn();
            } else { // if 'site is not live'
                // set toggle and apply parameters
                this.toggleOff();
            }
        },
        'cacheDOM': function (callingPanel) {
            this.$toolsPanel = jQuery(callingPanel);
        },
        'addTool': function () {
            // add to main toolbox
            this.$toolsPanel
                .append(m4Check.config.$m4Container);
        },
        'bindEvents': function () {
            // bind FA toggle with 'flipTheSwitch' action
            m4Check.config.$m4Container.on('click', this.flipTheSwitch.bind(this));
        },
        // ----------------------------------------
        // tier 2 functions
        // ----------------------------------------
        'toggleOn': function () {
            // set toggle on image
            const $toggle = m4Check.config.$FAtoggle;
            $toggle
                .removeClass('fa-toggle-off')
                .addClass('fa-toggle-on');
        },
        'toggleOff': function () {
            // set toggle off image
            const $toggle = m4Check.config.$FAtoggle;
            $toggle
                .removeClass('fa-toggle-on')
                .addClass('fa-toggle-off');
        },
        'flipTheSwitch': function () {
            // set saved variable to opposite of current value
            const toggle = shared.getValue('usingM4');
            shared.saveValue('usingM4', !toggle);

            // set toggle
            this.setToggle();
        },
        // ----------------------------------------
        // tier 3 functions
        // ----------------------------------------
        'hasParameters': function () {
            // determine if site URL already has custom parameters
            if (window.location.href.indexOf('&comments=true&relative=true') >= 0) {
                return true;
            } else {
                return false;
            }
        },
        'siteState': function () {
            // return page variable
            return unsafeWindow.ContextManager.getVersion();
        },
        // ----------------------------------------
        // other functions
        // ----------------------------------------
        'isToggleOn': function () {
            return shared.getValue('usingM4');
        },
    };

    // ********************************************************************************
    // **************************************** autofill toggle ****************************************
    // ********************************************************************************
    const autofillToggle = {
        'init': function (callingPanel) {
            this.createElements();
            this.buildTool();
            this.cacheDOM(callingPanel);
            this.setToggle();
            this.addTool();
            this.bindEvents();
        },
        // ----------------------------------------
        // tier 1 functions
        // ----------------------------------------
        'createElements': function () {
            autofillToggle.config = {
                '$autofillTogContainer': jQuery('<div>').attr({
                    'id': 'autofillToggleInput',
                    'class': 'toggleTool',
                    'title': 'Show all autofill tags on page',
                }),
                '$autofillTogTitle': jQuery('<div>')
                    .text('show autofill tags?'),
                '$autofillTogIcon': jQuery('<div>').attr({
                    'id': 'autofillToggleIcon',
                }),
                '$FAtoggle': jQuery('<i class="fa fa-toggle-off fa-lg"></i>'),
            };
        },
        'buildTool': function () {
            autofillToggle.config.$autofillTogIcon
                .append(autofillToggle.config.$FAtoggle);
            autofillToggle.config.$autofillTogContainer
                .append(autofillToggle.config.$autofillTogTitle)
                .append(autofillToggle.config.$autofillTogIcon);
        },
        'setToggle': function () {
            if (shared.getValue('applyAutofill')) { // if 'applyAutofill is turned on'
                // set toggle and apply parameters
                this.toggleOn();
            } else { // if 'site is not live'
                // set toggle and apply parameters
                this.toggleOff();
            }
        },
        'cacheDOM': function (callingPanel) {
            this.$toolsPanel = jQuery(callingPanel);
        },
        'addTool': function () {
            // add to main toolbox
            this.$toolsPanel
                .append(autofillToggle.config.$autofillTogContainer);
        },
        'bindEvents': function () {
            // bind FA toggle with 'flipTheSwitch' action
            autofillToggle.config.$autofillTogContainer.on('click', this.flipTheSwitch.bind(this));
        },
        // ----------------------------------------
        // tier 2 functions
        // ----------------------------------------
        'toggleOn': function () {
            // set toggle on image
            const $toggle = autofillToggle.config.$FAtoggle;
            $toggle
                .removeClass('fa-toggle-off')
                .addClass('fa-toggle-on');
        },
        'toggleOff': function () {
            // set toggle off image
            const $toggle = autofillToggle.config.$FAtoggle;
            $toggle
                .removeClass('fa-toggle-on')
                .addClass('fa-toggle-off');
        },
        'flipTheSwitch': function () {
            // set saved variable to opposite of current value
            const toggle = shared.getValue('applyAutofill');
            shared.saveValue('applyAutofill', !toggle);

            // set toggle
            this.setToggle();
        },
        // ----------------------------------------
        // tier 3 functions
        // ----------------------------------------
        'hasParameters': function () {
            if (window.location.href.indexOf('disableAutofill=') >= 0) {
                return true;
            } else {
                return false;
            }
        },
        'siteState': function () {
            // return page variable
            return unsafeWindow.ContextManager.getVersion();
        },
        // ----------------------------------------
        // other functions
        // ----------------------------------------
        'isToggleOn': function () {
            return shared.getValue('applyAutofill');
        },
    };

    // ********************************************************************************
    // **************************************** URL MODIFIER Panel ****************************************
    // ********************************************************************************
    const urlModifiers = {
        'init': function () {
            // initialize module
            this.createElements();
            this.buildPanel();
            this.cacheDOM();
            this.setToggle();
            this.addTool();
            this.bindEvents();
            shared.displayPanel(urlModifiers.config.$urlModPanel);
        },
        // ----------------------------------------
        // tier 1 functions
        // ----------------------------------------
        'createElements': function () {
            // main panel container
            urlModifiers.config = {
                '$urlModContainer': jQuery('<div>').attr({
                    'class': 'toolBox',
                    'id': 'urlModContainer',
                }),
                '$urlModPanel': jQuery('<div>').attr({
                    'class': 'toolsPanel',
                    'id': 'urlModTools',
                }),
                '$urlModTitle': jQuery('<div>').attr({
                    'class': 'panelTitle',
                    'id': 'urlModTitle',
                    'title': 'Click to Minimize / Maximize',
                }).text('URL Modifiers'),
                '$autoApplyContainer': jQuery('<div>').attr({
                    'class': 'toggleTool autoApplyInput',
                    'title': 'will auto apply URL modifiers to current URL\n*please reload the page to update the URL to current settings*',
                }),
                '$autoApplyTitle': jQuery('<div>').attr({
                    'class': 'autoApply',
                }).text('Auto Apply Modifiers?'),
                '$autoApplyIcon': jQuery('<div>').attr({
                    'id': 'autoApplyIcon',
                }),
                '$FAtoggle': jQuery('<i class="fa fa-toggle-off fa-lg"></i>'),
            };
        },
        'buildPanel': function () {
            // attach panel elements to container
            urlModifiers.config.$urlModPanel
                .append(nextGenToggle.init())
                .append(m4Check.init())
                .append(autofillToggle.init());

            urlModifiers.config.$autoApplyContainer
                .append(urlModifiers.config.$autoApplyTitle)
                .append(urlModifiers.config.$autoApplyIcon);
            // urlModifiers.config.$autoApplyContainer.append(urlModifiers.config.$autoApplyIcon);
            urlModifiers.config.$autoApplyIcon
                .append(urlModifiers.config.$FAtoggle);
            urlModifiers.config.$urlModPanel
                .append(urlModifiers.config.$autoApplyContainer);

            // attach title and URL Mod panel to URL Mod container
            urlModifiers.config.$urlModContainer
                .append(urlModifiers.config.$urlModTitle)
                .append(urlModifiers.config.$urlModPanel);
            // urlModifiers.config.$urlModContainer.append(urlModifiers.config.$urlModPanel);
        },
        'cacheDOM': function () {
            // DOM elements
            this.variableList = shared.programData();
            this.$toolBoxContainer = jQuery('.toolboxContainer');
            this.newURL = window.location.href;
        },
        'setToggle': function () {
            // get value of custom variable and set toggles accordingly
            const currentToggle = shared.getValue('autoApplyParameters');

            if (currentToggle) {
                this.toggleOn();
                this.applyParameters();
            } else {
                this.toggleOff();
            }
        },
        'addTool': function () {
            // add to main toolbox
            this.$toolBoxContainer
                .append(urlModifiers.config.$urlModContainer);
        },
        'bindEvents': function () {
            // minimize
            urlModifiers.config.$urlModTitle
                .on('click', shared.toggleFeature)
                .on('click', shared.saveState);
            urlModifiers.config.$autoApplyContainer.on('click', this.flipTheSwitch.bind(this));
        },
        // ----------------------------------------
        // tier 2 functions
        // ----------------------------------------
        'toggleOn': function () {
            // set toggle on image
            const $toggle = urlModifiers.config.$FAtoggle;
            $toggle
                .removeClass('fa-toggle-off')
                .addClass('fa-toggle-on');
        },
        'toggleOff': function () {
            // set toggle off image
            const $toggle = urlModifiers.config.$FAtoggle;
            $toggle
                .removeClass('fa-toggle-on')
                .addClass('fa-toggle-off');
        },
        'applyParameters': function () {
            const urlParameters2 = {
                'nextGen=': nextGenToggle.isToggleOn(),
                'relative=': m4Check.isToggleOn(),
                'disableAutofill=': autofillToggle.isToggleOn(),
            };
            let findThis = '';
            let key = '';
            let matchesFound = [];
            let hasKey;
            let isOn;

            for (key in urlParameters2) {
                if (urlParameters2.hasOwnProperty(key)) {
                    findThis = key;

                    this.checkQuestionMark();

                    this.addImmobile();

                    // determine search term is empty
                    // this will mean that the toggle is turned off
                    if (this.runTool(findThis)) {
                        // search url for KEY
                        hasKey = this.newURL.indexOf(findThis) >= 0;
                        isOn = urlParameters2[key];

                        // check URL for parameters
                        matchesFound.push(this.modifyURL(hasKey, findThis, isOn));
                    }
                }
            }
            // reloadPAge
            this.reloadPage(matchesFound);
        },
        'flipTheSwitch': function () {
            // set saved variable to opposite of current value
            const toggle = shared.getValue('autoApplyParameters');
            shared.saveValue('autoApplyParameters', !toggle);

            // set toggle
            this.setToggle();
        },
        // ----------------------------------------
        // tier 3
        // ----------------------------------------
        'checkQuestionMark': function () {
            // this works with current URL
            // will check to see if current URL has all the variables with it
            // ONE DOWNSIDE IS THAT IF THE URL DOESNT ALREADY HAVE A ? IN IT
            // AN ERROR WILL BE THROWN
            if (this.newURL.indexOf('?') === -1) {
                this.newURL += '?';
            }
        },
        'addImmobile': function () {
            // force the page to reload in DESKTOP SITE
            // no downside to NEXT GEN SITES
            if (this.newURL.indexOf('device=immobile') === -1) {
                this.newURL += '&device=immobile';
            }
        },
        'runTool': function (findThis) {
            // determine search term is empty
            // this will mean that the toggle is turned off
            if (typeof findThis === 'undefined' || findThis === '') {
                return false;
            } else {
                return true;
            }
        },
        'modifyURL': function (hasKey, findThis, isOn) {
            // --------------------------------------------------------
            // toggle functions
            // --------------------------------------------------------
            switch (findThis) {
                // --------------------------------------------------------
                // NEXTGEN PARAMETER
                // --------------------------------------------------------
                case 'nextGen=':
                    // ----------------------------------------
                    // parameter found in url
                    // ----------------------------------------
                    // if 'found parameter in url' AND 'toggle is ON'
                    if (hasKey && isOn) {
                        // if 'parameter is set to false'
                        if (this.newURL.indexOf('nextGen=false') >= 0) {
                            this.newURL = this.newURL.replace('nextGen=false', 'nextGen=true');
                            return false;
                        }
                        // if 'parameter is set to true'
                        if (this.newURL.indexOf('nextGen=true') >= 0) {
                            // do nothing
                            return true;
                        }
                    }
                    // ----------------------------------------
                    // parameter found in url
                    // ----------------------------------------
                    // if 'found parameter in url' AND 'toggle is OFF'
                    if (hasKey && !isOn) {
                        // if 'parameter is set to true'
                        if (this.newURL.indexOf('nextGen=true') >= 0) {
                            this.newURL = this.newURL.replace('nextGen=true', 'nextGen=false');
                            return false;
                        }
                        // if 'parameter is set to false'
                        if (this.newURL.indexOf('nextGen=false') >= 0) {
                            // do nothing
                            return true;
                        }
                    }
                    // ----------------------------------------
                    // parameter not found in url
                    // ----------------------------------------
                    // if 'parameter not found in url' AND 'toggle is ON'
                    if (!hasKey && isOn) {
                        // Add parameter to url string
                        this.newURL += '&nextGen=true';
                        return false;
                    }
                    // ----------------------------------------
                    // parameter not found in url
                    // ----------------------------------------
                    // if 'parameter not found in url' AND 'toggle is OFF'
                    if (!hasKey && !isOn) {
                        // Add parameter to url string
                        this.newURL += '&nextGen=false';
                        return false;
                    }
                    break;
                    // --------------------------------------------------------
                    // DISABLE AUOTFILL PARAMETER
                    // --------------------------------------------------------
                case 'disableAutofill=':
                    // ----------------------------------------
                    // parameter found in url
                    // ----------------------------------------
                    // if 'found parameter in url' AND 'toggle is ON'
                    if (hasKey && isOn) {
                        // if 'parameter is set to false'
                        if (this.newURL.indexOf('disableAutofill=false') >= 0) {
                            this.newURL = this.newURL.replace('disableAutofill=false', 'disableAutofill=true');
                            return false;
                        }
                        // if 'parameter is set to true'
                        if (this.newURL.indexOf('disableAutofill=true') >= 0) {
                            // do nothing
                            return true;
                        }
                    }
                    // ----------------------------------------
                    // parameter found in url
                    // ----------------------------------------
                    // if 'found parameter in url' AND 'toggle is OFF'
                    if (hasKey && !isOn) {
                        // if 'parameter is set to true'
                        if (this.newURL.indexOf('disableAutofill=true') >= 0) {
                            this.newURL = this.newURL.replace('&disableAutofill=true', '');
                            return false;
                        }
                        // if 'parameter is set to false'
                        if (this.newURL.indexOf('disableAutofill=false') >= 0) {
                            // remove parameter from url
                            this.newURL = this.newURL.replace('&disableAutofill=false', '');
                            return false;
                        }
                    }
                    // ----------------------------------------
                    // parameter not found in url
                    // ----------------------------------------
                    // if 'parameter not found in url' AND 'toggle is ON'
                    if (!hasKey && isOn) {
                        // Add parameter to url string
                        this.newURL += '&disableAutofill=true';
                        return false;
                    }
                    // ----------------------------------------
                    // parameter not found in url
                    // ----------------------------------------
                    // if 'parameter not found in url' AND 'toggle is OFF'
                    if (!hasKey && !isOn) {
                        // do nothing
                        return true;
                    }
                    break;
                    // --------------------------------------------------------
                    // MILESTONE 4 PARAMETERS (TETRA SITES)
                    // --------------------------------------------------------
                case 'relative=':
                    // ----------------------------------------
                    // parameter found in url
                    // ----------------------------------------
                    // if 'found parameter in url' AND 'toggle is turned on'
                    if (hasKey && isOn) {
                        // do nothing
                        return true;
                    }
                    // ----------------------------------------
                    // parameter found in url
                    // ----------------------------------------
                    // if 'found parameter in url' AND 'toggle is off'
                    if (hasKey && !isOn) {
                        // remove ADDED parameter from URL
                        this.newURL = this.newURL.replace('&comments=true&relative=true', '');
                        return false;
                    }
                    // ----------------------------------------
                    // parameter not found in url
                    // ----------------------------------------
                    // if 'parameter not found in url' AND 'toggle is ON'
                    if (!hasKey && isOn) {
                        // Add parameter to url string
                        this.newURL += '&comments=true&relative=true';
                        return false;
                    }
                    // ----------------------------------------
                    // parameter not found in url
                    // ----------------------------------------
                    // if 'parameter not found in url' AND 'toggle is OFF'
                    if (!hasKey && !isOn) {
                        // do nothing
                        return true;
                    }
                    break;
                default:
            }
        },
        'reloadPage': function (matchesFound) {
            // determine if all parameters are found in the URL
            // will stop the page from reloading after initial build.
            const matchLength = matchesFound.length;
            let reloadPage = false;

            // loop through array to determine if page should reload
            for (let q = 0; q < matchLength; q += 1) {
                // if a match isn't found, break out of loop and reload the page.
                if (matchesFound[q]) {
                    reloadPage = false;
                } else {
                    reloadPage = true;
                    break;
                }
            }

            // if reloadPage is true reload page
            if (reloadPage) {
                window.location.href = this.newURL;
            }
        },
    };

    /* ************************************************************************************************************************ */
    /* **************************************** TOGGLE TOOLS **************************************** */
    /* ************************************************************************************************************************ */

    // ********************************************************************************
    // **************************************** Toggle Tools Panel ****************************************
    // ********************************************************************************
    const toggles = {
        'init': function () {
            // initialize module
            this.createElements();
            this.buildPanel();
            this.cacheDOM();
            this.addTool();
            this.bindEvents();
            shared.displayPanel(toggles.config.$togglesPanel);
        },
        'createElements': function () {
            toggles.config = {
                // ----------------------------------------
                // Toggle Tools Panel
                // ----------------------------------------
                '$togglesContainer': jQuery('<div>').attr({
                    'class': 'toolBox',
                    'id': 'togglesContainer',
                }),
                '$togglesPanel': jQuery('<div>').attr({
                    'class': 'toolsPanel',
                    'id': 'toggleTools',
                }),
                '$togglesTitle': jQuery('<div>').attr({
                    'class': 'panelTitle',
                    'id': 'togglesTitle',
                    'title': 'Click to Minimize/Maximize',
                }).text('Toggles'),
            };
        },
        'buildPanel': function () {
            // attach to continer
            toggles.config.$togglesContainer
                .append(toggles.config.$togglesTitle)
                .append(toggles.config.$togglesPanel);
        },
        'cacheDOM': function () {
            // DOM elements
            this.$toolBoxContainer = jQuery('.toolboxContainer');
            this.variableList = shared.programData();
        },
        'addTool': function () {
            // add to main toolbox
            this.$toolBoxContainer
                .append(toggles.config.$togglesContainer);
        },
        'bindEvents': function () {
            // minimize
            toggles.config.$togglesTitle
                .on('click', shared.toggleFeature)
                .on('click', shared.saveState);
        },
    };

    // ********************************************************************************
    // **************************************** Refresh Page toggle ****************************************
    // ********************************************************************************
    const refreshPage = {
        'init': function (callingPanel) {
            this.createElements();
            this.cacheDOM(callingPanel);
            this.buildTool();
            this.addTool();
            this.bindEvents();
            this.setToggle();
        },
        // ----------------------------------------
        // tier 1 functions
        // ----------------------------------------
        'createElements': function () {
            refreshPage.config = {
                '$refreshContainer': jQuery('<div>').attr({
                    'id': 'refreshMe',
                    'class': 'toggleTool',
                }),
                '$refreshButtContainer': jQuery('<div>').attr({
                    'class': 'refreshPageContainer',
                }),
                '$refreshButt': jQuery('<button>').attr({
                    'class': 'myEDOBut refreshButt',
                    'title': 'Refresh Page from Server ',
                }),
                '$refresh': jQuery('<i class="fa fa-undo fa-flip-horizontal fa-3x">&nbsp;</i>'),
                '$refreshTitle': jQuery('<div>').text('Refresh Button'),
                '$refreshCheckbox': jQuery('<div>').attr({
                    'id': 'refreshMetoggle',
                    'title': 'toggle refresh button',
                }),
                '$FAtoggle': jQuery('<i class="fa fa-toggle-off fa-lg"></i>'),
            };
        },
        'cacheDOM': function (callingPanel) {
            this.$togglesPanel = jQuery(callingPanel);
            this.$togglesContainer = jQuery('.toolboxContainer');
        },
        'buildTool': function () {
            refreshPage.config.$refreshButt
                .html(refreshPage.config.$refresh);
            refreshPage.config.$refreshButtContainer
                .html(refreshPage.config.$refreshButt);
            // add icon to mock button
            refreshPage.config.$refreshCheckbox
                .append(refreshPage.config.$FAtoggle);
            // add mock button to container
            refreshPage.config.$refreshContainer
                .append(refreshPage.config.$refreshTitle)
                .append(refreshPage.config.$refreshCheckbox);
        },
        'addTool': function () {
            this.$togglesPanel
                .append(refreshPage.config.$refreshContainer);
            this.$togglesContainer
                .append(refreshPage.config.$refreshButtContainer);
        },
        'bindEvents': function () {
            refreshPage.config.$refreshButt.on('click', this.reloadPage);
            refreshPage.config.$refreshContainer.on('click', this.flipTheSwitch.bind(this));
        },
        'setToggle': function () {
            // get value of custom variable and set toggles accordingly
            if (shared.getValue('useRefreshButton')) {
                this.toggleOn();
                refreshPage.config.$refreshButtContainer.show();
            } else {
                this.toggleOff();
                refreshPage.config.$refreshButtContainer.hide();
            }
        },
        // ----------------------------------------
        // tier 2 functions
        // ----------------------------------------
        'reloadPage': function () {
            window.location.reload(true);
        },
        'flipTheSwitch': function () {
            // set saved variable to opposite of current value
            const toggle = shared.getValue('useRefreshButton');
            shared.saveValue('useRefreshButton', !toggle);

            // set toggle
            this.setToggle();
        },
        'toggleOn': function () {
            // set toggle on image
            const $toggle = refreshPage.config.$FAtoggle;
            $toggle.removeClass('fa-toggle-off');
            $toggle.addClass('fa-toggle-on');
        },
        'toggleOff': function () {
            // set toggle off image
            const $toggle = refreshPage.config.$FAtoggle;
            $toggle.removeClass('fa-toggle-on');
            $toggle.addClass('fa-toggle-off');
        },
    };

    // ********************************************************************************
    // **************************************** hide preview toolbar toggle ****************************************
    // ********************************************************************************
    const previewBarToggle = {
        'init': function (callingPanel) {
            this.createElements();
            this.buildTool();
            this.cacheDOM(callingPanel);
            this.setToggle();
            this.addTool();
            this.bindEvents();
        },
        // ----------------------------------------
        // tier 1 functions
        // ----------------------------------------
        'createElements': function () {
            previewBarToggle.config = {
                '$previewBarToggleContainer': jQuery('<div>').attr({
                    'id': 'previewBarToggleInput',
                    'class': 'toggleTool',
                    'title': 'hides PCE toolbar',
                }),
                '$previewBarToggleTitle': jQuery('<div>')
                    .text('hide preview toolbar?'),
                '$previewBarToggleIcon': jQuery('<div>').attr({
                    'id': 'previewBarToggleIcon',
                }),
                '$FAtoggle': jQuery('<i class="fa fa-toggle-off fa-lg"></i>'),
                'varName': 'hidePreviewToolbar',
            };
        },
        'buildTool': function () {
            previewBarToggle.config.$previewBarToggleIcon
                .append(previewBarToggle.config.$FAtoggle);
            previewBarToggle.config.$previewBarToggleContainer
                .append(previewBarToggle.config.$previewBarToggleTitle)
                .append(previewBarToggle.config.$previewBarToggleIcon);
        },
        'setToggle': function () {
            // get value of custom variable and set toggles accordingly
            const varName = previewBarToggle.config.varName;
            const storedValue = shared.getValue(varName);

            if (storedValue) {
                this.toggleOn();
                this.togglePreviewToolbar();
            } else {
                this.toggleOff();
                this.togglePreviewToolbar();
            }
        },
        'cacheDOM': function (callingPanel) {
            this.$toolsPanel = jQuery(callingPanel);
            this.$toolboxStyles = jQuery('#qa_toolbox');
        },
        'addTool': function () {
            // add to main toolbox
            this.$toolsPanel
                .append(previewBarToggle.config.$previewBarToggleContainer);
        },
        'bindEvents': function () {
            // bind FA toggle with 'flipTheSwitch' action
            previewBarToggle.config.$previewBarToggleContainer
                .on('click', this.flipTheSwitch.bind(this))
                .on('click', '#previewToolBarFrame', this.togglePreviewToolbar);
        },
        'hideFeature': function () {
            // hides feature if viewing live site
            if (this.siteState() === 'LIVE') {
                previewBarToggle.config.$previewBarToggleContainer.toggle();
            }
        },
        // ----------------------------------------
        // tier 2 functions
        // ----------------------------------------
        'toggleOn': function () {
            // set toggle on image
            const $toggle = previewBarToggle.config.$FAtoggle;
            $toggle
                .removeClass('fa-toggle-off')
                .addClass('fa-toggle-on');
        },
        'togglePreviewToolbar': function () {
            const varName = previewBarToggle.config.varName;
            const hidePreviewToolbar = shared.getValue(varName);

            // if 'hidePreviewToolbar is toggled ON'
            if (hidePreviewToolbar) {
                this.$toolboxStyles
                    .append(' #previewToolBarFrame { display: none; }') // ;
                    // this.$toolboxStyles
                    .append(' .preview-wrapper { display: none; }');
            } else {
                this.$toolboxStyles
                    .append(' #previewToolBarFrame { display: block; }') // ;
                    // this.$toolboxStyles
                    .append(' .preview-wrapper { display: block; }');
            }
        },
        'toggleOff': function () {
            // set toggle off image
            const $toggle = previewBarToggle.config.$FAtoggle;
            $toggle.removeClass('fa-toggle-on');
            $toggle.addClass('fa-toggle-off');
        },
        'flipTheSwitch': function () {
            const varName = previewBarToggle.config.varName;
            const storedValue = shared.getValue(varName);
            // set saved variable to opposite of current value
            shared.saveValue(varName, !storedValue);
            // set toggle
            this.setToggle();
        },
    };

    // ********************************************************************************
    // **************************************** dynamic panel ****************************************
    // ********************************************************************************
    const dynamicDisplay = {
        'init': function () {
            this.createElements();
            this.buildPanel();
            this.cacheDOM();
            this.addTool();
            this.modToolbar();
            this.bindEvents();
            this.displayPanel();
        },
        'createElements': function () {
            // main panel container
            dynamicDisplay.config = {
                '$displayPanel': jQuery('<div>').attr({
                    'class': 'toolBox',
                    'id': 'displayPanel',
                }),
                // panel title
                '$displayTitle': jQuery('<div>').attr({
                    'class': 'panelTitle',
                }),
                // display area
                '$displayArea': jQuery('<div>').attr({
                    'id': 'displayArea',
                }),
                // toolbox version
                '$version': jQuery('<div>').attr({
                    'id': 'version',
                }).text('version: ' + GM_info.script.version), // eslint-disable-line camelcase
                '$changeLog': jQuery('<div>').attr({
                    'id': 'changeLog',
                }),
                '$changeLogLink': jQuery('<a>').attr({
                    'href': '#',
                    'title': 'View latest changes',
                }).text('Change Log'),
                // toolbox show button
                '$showToolbox': jQuery('<div>').attr({
                    'class': 'showToolbox',
                    'title': 'Show Toolbox',
                }),
                // font awesome icon
                '$icon': jQuery('<i class="fa fa-power-off fa-2x"></i>'),
                '$hideToolbox': jQuery('<div>').attr({
                    'class': 'hideToolbox',
                }),
                '$minimizeIcon': jQuery('<span class="fa-stack fa-2x"><i class="fa fa-circle fa-stack-1x fa-inverse"></i><i class="fa fa-times-circle fa-stack-1x"></i></span>').attr({
                    'title': 'Click to Hide Toolbox',
                }),
            };
        },
        'buildPanel': function () {
            // attach panel elements to container
            dynamicDisplay.config.$changeLog
                .append(dynamicDisplay.config.$changeLogLink);

            dynamicDisplay.config.$displayArea
                .append(dynamicDisplay.config.$version)
                .append(dynamicDisplay.config.$changeLog);

            dynamicDisplay.config.$displayPanel.append(dynamicDisplay.config.$displayArea);
            // attach icon to minimize tab
            dynamicDisplay.config.$showToolbox.append(dynamicDisplay.config.$icon);
            // attach icon to minimize tab
            dynamicDisplay.config.$hideToolbox.append(dynamicDisplay.config.$minimizeIcon);
        },
        'cacheDOM': function () {
            // page info
            this.$toolBoxContainer = jQuery('#showToolbox');
            this.variableList = shared.programData();
            // additions
            this.toolbox = jQuery('.toolBox');
            this.toolboxContain = jQuery('.toolboxContainer');
            this.edoButts = jQuery('.myEDOBut');
            this.lenendContainer = jQuery('.legendContainer');
        },
        'addTool': function () {
            // add to main toolbox
            this.$toolBoxContainer.append(dynamicDisplay.config.$displayPanel);
            this.$toolBoxContainer.before(dynamicDisplay.config.$showToolbox);
            this.$toolBoxContainer.append(dynamicDisplay.config.$hideToolbox);
        },
        'modToolbar': function () {
            if (shared.nextGenCheck()) {
                this.toolbox.addClass('nextgen');
                this.$toolBoxContainer.addClass('nextgen');
                this.edoButts.addClass('nextgen');
                this.lenendContainer.addClass('nextgen');
                dynamicDisplay.config.$hideToolbox.addClass('nextgen');
                dynamicDisplay.config.$showToolbox.addClass('nextgen');
                dynamicDisplay.config.$displayPanel.addClass('nextgen');
            } else {
                this.toolbox.addClass('tetra');
                this.edoButts.addClass('tetra');
                this.lenendContainer.addClass('tetra');
                dynamicDisplay.config.$hideToolbox.addClass('tetra');
                dynamicDisplay.config.$showToolbox.addClass('tetra');
                dynamicDisplay.config.$displayPanel.addClass('tetra');
            }
        },
        'bindEvents': function () {
            // click
            dynamicDisplay.config.$hideToolbox
                .on('click', this.toggleTools.bind(this))
                .on('click', this.saveState);
            dynamicDisplay.config.$showToolbox
                .on('click', this.toggleTools.bind(this))
                .on('click', this.saveState);
            dynamicDisplay.config.$changeLog
                .on('click', main.showChangeLog);
        },
        'displayPanel': function () {
            // loop through variable list to find the panel title
            const variables = this.variableList;
            let state = '';
            let key = '';
            for (key in variables) {
                if (variables.hasOwnProperty(key)) {
                    if (key === 'showToolbox') {
                        state = variables[key] ? 'show' : 'hide';
                        shared.setState(this.$toolBoxContainer, state);
                        // set display of hide/show button to opposite of main toolbox
                        dynamicDisplay.config.$showToolbox.addClass(variables[key] ? 'disappear' : 'appear');
                    }
                }
            }
        },
        // ----------------------------------------
        // tier 2
        // ----------------------------------------
        //'checkNextGen': function (nextGenComment) {
        //    if (nextGenComment) {
        //        return nextGenComment.indexOf('Next Gen') === -1 ? 'Tetra' : 'Next Gen';
        //    }
        //    return 'Tetra';
        //},
        'toggleTools': function () {
            // hide / show main tool box
            this.toggleBox();
            // hide / show toggle button
            dynamicDisplay.config.$showToolbox.toggle('fade', 500);
        },
        'saveState': function () {
            // get current state
            const vName = 'showToolbox';
            const currState = shared.getValue(vName, false);

            // sets usingM4 value
            shared.saveValue(vName, !currState);
        },
        // ----------------------------------------
        // tier 3
        // ----------------------------------------
        'toggleBox': function () {
            this.$toolBoxContainer.toggle('fade', 500);
        },
    };

    // ********************************************************************************
    // **************************************** MAIN ****************************************
    // ********************************************************************************
    const main = {
        'init': function () {
            this.cacheDOM();
            this.checkEnvironment();
            this.createElements();
            this.attachResources();
            this.toolContainer();
            this.pageInfoPanel();
            this.qaToolsPanel();
            this.otherToolsPanel();
            this.togglesPanel();
            this.urlModPanel();
            this.dynamicPanel();
            this.stylePanels();
            this.jQueryUIedits();
        },
        'cacheDOM': function () {
            this.contextManager = unsafeWindow.ContextManager;
            this.phoneWrapper = jQuery('body .phone-wrapper');
            this.head = jQuery('head');
        },
        'checkEnvironment': function () {
            this.editMode();
            this.isCDKsite();
            this.isMobile();
        },
        'createElements': function () {
            main.config = {
                '$toolboxStyles': jQuery('<style></style>').attr({
                    'id': 'qa_toolbox',
                    'type': 'text/css',
                }),
                '$myFont': jQuery('<link>').attr({
                    'id': 'toolFont',
                    'href': 'https://fonts.googleapis.com/css?family=Montserrat',
                    'rel': 'stylesheet',
                }),
                '$fontAw': jQuery('<link>').attr({
                    'id': 'fontAwe',
                    'href': 'https://cdn.rawgit.com/cirept/QA_Toolbox/master/resources/font-awesome-4.7.0/css/font-awesome.css',
                    'rel': 'stylesheet',
                }),
                '$jQueryUIcss': jQuery('<link>').attr({
                    'id': 'jqueryUI',
                    'href': 'https://cdn.rawgit.com/cirept/QA_Toolbox/master/resources/jquery-ui-1.12.1.custom/jquery-ui.min.css',
                    'rel': 'stylesheet',
                }),
                '$toolStyles': jQuery('<link>').attr({
                    'id': 'mycss',
                    'href': shared.getResourceUrl('toolStyles'), // eslint-disable-line camelcase
                    'rel': 'stylesheet',
                    'type': 'text/css',
                }),
                '$animate': jQuery('<link>').attr({
                    'id': 'animate',
                    'href': 'https://rawgit.com/cirept/animate.css/master/animate.css',
                    'rel': 'stylesheet',
                }),
            };
        },
        'attachResources': function () {
            this.head
                .append(main.config.$toolboxStyles)
                .append(main.config.$myFont)
                .append(main.config.$jQueryUIcss)
                .append(main.config.$toolStyles)
                .append(main.config.$mycss)
                .append(main.config.$fontAw)
                .append(main.config.$animate);
        },
        'toolContainer': function () {
            qaToolbox.init();
        },
        'pageInfoPanel': function () {
            pageInformation.init();
        },
        'qaToolsPanel': function () {
            const panelID = '#mainTools';
            qaTools.init();
            imageChecker.init(panelID);
            linkChecker.init(panelID);
            spellCheck.init(panelID);
            speedtestPage.init(panelID);
            checkLinks.init(panelID);
        },
        'otherToolsPanel': function () {
            const panelID = '#otherTools';
            otherTools.init();
            showNavigation.init(panelID);
            seoSimplify.init(panelID);

            // add tetra specific tool to panel
            if (!shared.nextGenCheck()) {
                widgetOutlines.init(panelID);
                viewMobile.init(panelID);
            }
        },
        'togglesPanel': function () {
            const panelID = '#toggleTools';
            toggles.init();
            refreshPage.init(panelID);
            previewBarToggle.init(panelID);
        },
        'urlModPanel': function () {
            const panelID = '#urlModTools';
            urlModifiers.init();
            nextGenToggle.init(panelID);
            autofillToggle.init(panelID);

            // add tetra specific tool to panel
            if (!shared.nextGenCheck()) {
                m4Check.init(panelID);
            }
        },
        'dynamicPanel': function () {
            dynamicDisplay.init();
        },
        'stylePanels': function () {
            this.styleButtons(qaTools.config.$mainToolsPanel);
            this.styleButtons(otherTools.config.$otherToolsPanel);
            this.wrapText(qaToolbox.config.$toolboxContainer);
        },
        'isCDKsite': function () {
            try {
                // get version of CDK site
                // if value does not exist, shut the toolbar down
                if (this.contextManager.getVersion().length === 0) {
                    throw new Error('Shutting toolbox down');
                }
            } catch (e) {
                // get version of site
                // if contextManager object does not exist, shut the toolbar down
                throw new Error('Shutting toolbox down');
            }
        },
        'isMobile': function () {
            // determines if the page being viewed is meant for mobile
            if (this.phoneWrapper.length > 0) {
                throw new Error('Shutting toolbox down');
            }
        },
        'editMode': function () {
            // determines if site is in edit mode in WSM (this variable should only exist on CDK sites)
            if (unsafeWindow.editMode === true) {
                throw new Error('Shutting toolbox down');
            }
        },
        'styleButtons': function ($toolPanel) {
            // add class to buttons for styling
            $toolPanel.children('.myEDOBut:even').addClass('evenEDObutts');
            $toolPanel.children('.myEDOBut:odd').addClass('oddEDObutts');
        },
        'wrapText': function ($toolPanel) {
            // wrapping interior text in order style text.
            // allows override of the !important tags used by CDK bundles.css
            $toolPanel.find('.myEDOBut').wrapInner('<span></span>');
        },
        'jQueryUIedits': function () {
            // should only show the changelog when the user first uses program
            // should also show when the user updates.
            if (!shared.getValue('hideChangeLog')) {
                this.showChangeLog();
            }
        },
        'showChangeLog': function () {
            qaToolbox.config.$changeLogDisplay.dialog({
                'width': 1000,
                'title': 'Change Log',
                'buttons': [{
                    'text': 'Close',
                    'icon': 'ui-icon-heart',
                    'click': function () {
                        shared.saveValue('hideChangeLog', true);
                        jQuery(this).dialog('close');
                    },
                }],
            });

            // set max height for TETRA sites
            if (!shared.nextGenCheck()) {
                qaToolbox.config.$changeLogDisplay.dialog('option', 'maxHeight', 800);
            }
        },
    };

    /**
     * initialize toolbox
     */
    main.init();
}());
