  const autofillToggle = {
    /**
     * initialize the tool
     * calls all the functions to build the tool
     */
    init(callingPanel) {
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
    /**
     * Creates all the DOM elements that the tool will use
     */
    createElements() {
      this.config = {
        $autofillTogContainer: jQuery('<div>')
          .attr({
            id: 'autofillToggleInput',
            class: 'toggleTool myParameter',
            title: 'Show all autofill tags on page',
          }),
        $autofillTogTitle: jQuery('<div>')
          .text('autofills?'),
        $autofillTogIcon: jQuery('<div>')
          .attr({
            id: 'autofillToggleIcon',
          }),
        $FAtoggle: jQuery('<i class="fa fa-toggle-off fa-lg"></i>'),
      };
    },
    /**
     * Builds the tools elements
     * Combines the cached DOM elements
     */
    buildTool() {
      const {
        $autofillTogIcon,
        $FAtoggle,
        $autofillTogContainer,
        $autofillTogTitle
      } = this.config;

      $autofillTogIcon
        .append($FAtoggle);
      $autofillTogContainer
        .append($autofillTogIcon)
        .append($autofillTogTitle);
    },
    /**
     * Sets the state of the toggle to the last saved state loaded from
     * local storage
     */
    setToggle() {
      if (shared.getValue('applyAutofill')) { // if 'applyAutofill is turned on'
        // set toggle and apply parameters
        this.toggleOn();
      } else { // if 'site is not live'
        // set toggle and apply parameters
        this.toggleOff();
      }
    },
    /**
     * Caches things from the DOM that the tool will use.
     * @param {object} callingPanel - the panel that this tool is located in
     */
    cacheDOM(callingPanel) {
      this.$toolsPanel = jQuery(callingPanel);
    },
    /**
     * Adds the combined tool elements to the tool container on the DOM
     */
    addTool() {
      // add to main toolbox
      this.$toolsPanel
        .append(this.config.$autofillTogContainer);
    },
    /**
     * Attaches the event listeners that will provide the tools functionality
     */
    bindEvents() {
      const {
        $autofillTogContainer,
        $autofillTogTitle
      } = this.config;

      // bind FA toggle with 'flipTheSwitch' action
      $autofillTogContainer.on('click', this.flipTheSwitch
        .bind(this));

      // apply mouse over hover effect for display text
      $autofillTogTitle.on('mouseover', () => {
        $autofillTogTitle.fadeOut(250, () => {
          $autofillTogTitle.text('Show Autofill Tags?')
            .fadeIn(500);
        })
      });

      // apply mouse out hover effect for display text
      $autofillTogTitle.on('mouseout', () => {
        $autofillTogTitle.fadeOut(250, () => {
          $autofillTogTitle.text('Autofills?')
            .fadeIn(500);
        })
      });
    },
    // ----------------------------------------
    // tier 2 functions
    // ----------------------------------------
    /**
     * Changed the DOM toggle to the ON state
     */
    toggleOn() {
      const {
        $FAtoggle
      } = this.config;

      // set toggle on image
      // const $toggle = this.config.$FAtoggle;
      $FAtoggle
        .removeClass('fa-toggle-off')
        .addClass('fa-toggle-on');
    },
    /**
     * Changed the DOM toggle to the OFF state
     */
    toggleOff() {
      const {
        $FAtoggle
      } = this.config;

      // set toggle off image
      // const $toggle = this.config.$FAtoggle;
      $FAtoggle
        .removeClass('fa-toggle-on')
        .addClass('fa-toggle-off');
    },
    /**
     * Sets the saved variable to the opposite of what it is currently
     * and updates the DOM toggle element
     */
    flipTheSwitch() {
      // set saved variable to opposite of current value
      const toggle = shared.getValue('applyAutofill');
      shared.saveValue('applyAutofill', !toggle);

      // set toggle
      this.setToggle();
    },
    // ----------------------------------------
    // tier 3 functions
    // ----------------------------------------
    hasParameters() {
      if (window.location.href.indexOf('disableAutofill=') >= 0) {
        return true;
      }
      return false;
    },
    siteState() {
      // return page variable
      return unsafeWindow.ContextManager.getVersion();
    },
    // ----------------------------------------
    // other functions
    // ----------------------------------------
    isToggleOn() {
      return shared.getValue('applyAutofill');
    },
  };
