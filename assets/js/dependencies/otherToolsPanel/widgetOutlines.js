  const widgetOutlines = {
    init(callingPanel) {
      this.createElements();
      this.cacheDOM(callingPanel);
      this.addTool();
      this.bindEvents();
    },
    createElements() {
      widgetOutlines.config = {
        $activateButt: jQuery('<button>')
          .attr({
            class: 'myEDOBut',
            id: 'widgetOutline',
            title: 'Show Widget Outlines',
          })
          .text('Show Widgets'),
      };
    },
    cacheDOM(callingPanel) {
      this.$toolsPanel = jQuery(callingPanel);
      this.$toolboxStyles = jQuery('#qa_toolbox');
      this.$editableWidgets = jQuery('body .cell .CobaltEditableWidget');
      this.$cobaltWidgets = jQuery('body .cell .CobaltWidget');
      this.overlayStyles = [];
    },
    addTool() {
      this.$toolsPanel
        .append(widgetOutlines.config.$activateButt);
    },
    bindEvents() {
      widgetOutlines.config.$activateButt.on('click', this.showWidgets.bind(
        this));
    },
    showWidgets() {
      this.addOverlay(this.$editableWidgets);
      this.addOverlay(this.$cobaltWidgets);
      this.addCustomStyles(this);
    },
    addCustomStyles() {
      const self = this;
      jQuery(this.overlayStyles)
        .each((index, value) => {
          self.$toolboxStyles.append(value);
        });
    },
    addOverlay(array) {
      const self = this;
      jQuery(array)
        .each((index, value) => {
          const $currentObject = jQuery(value);
          const widgetID = $currentObject.attr('id');
          const toolClass = 'showWidgetData';
          const w = $currentObject.width();
          const h = $currentObject.height();
          const addThis =
            `#${widgetID}.${toolClass}:after { height: ${h}px; width: ${w}px;}`;

          // add tool class
          $currentObject.addClass('showWidgetData');
          self.bindClickCallback($currentObject, widgetID);
          $currentObject.attr({
            title: 'Click to Copy Widget ID',
          });

          // add height and width data to widget element
          $currentObject.attr({
            'data-content': `${widgetID} :: ${w}px X ${h
            }px`,
          });

          // save custom css styles that will be added to the toolbox css styles later
          self.overlayStyles.push(addThis);
        });
    },
    bindClickCallback($currentObject, widgetID) {
      // bind click event
      return $currentObject.on('click', this.copyWidgetID(
        $currentObject,
        widgetID,
      ));
    },
    copyWidgetID($currentObject, widgetID) {
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
