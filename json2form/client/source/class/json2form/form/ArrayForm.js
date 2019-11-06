/* ************************************************************************

   json2form

   https://osparc.io

   Copyright:
     2019 IT'IS Foundation, https://itis.swiss

   License:
     MIT: https://opensource.org/licenses/MIT

   Authors:
     * Odei Maiz (odeimaiz)

************************************************************************ */

qx.Class.define("json2form.form.ArrayForm", {
  type: "abstract",

  extend : qx.ui.core.Widget,
  implement : [
    qx.ui.form.IForm
  ],
  include : [
    qx.ui.core.MContentPadding,
    qx.ui.form.MForm
  ],


  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  /**
   * @param nItems {Number} Number of items
   */
  construct: function(nItems) {
    this.base(arguments);

    this._setLayout(new qx.ui.layout.HBox());

    this.__widgets = [];
    if (nItems) {
      this.setNItems(nItems)
    }
  },

  properties: {
    nItems: {
      check : "Number",
      apply : "_applyNItems"
    },

    // overridden
    focusable: {
      refine : true,
      init : true
    },

    /** whether the value should wrap around */
    wrap: {
      check : "Boolean",
      init : false,
      apply : "_applyWrap"
    },

    /** Controls whether the textfield of the spinner is editable or not */
    editable: {
      check : "Boolean",
      init : true,
      apply : "_applyEditable"
    },

    // overridden
    allowShrinkY: {
      refine : true,
      init : false
    }
  },

  members: {
    __widgets: null,

    _applyNItems: function(value, old) {},

    addWidget: function(widget) {
      widget.addListener("changeValue", e => {
        const data = [];
        for (let i=0; i<this.__widgets.length; i++) {
          const widget = this.__widgets[i];
          data.push(widget.getValue());
        }
        this.fireDataEvent("changeValue", data);
      }, this)
      this._add(widget, {
        flex: 1
      })
      this.__widgets.push(widget);
    },


    // overridden
    /**
     * @lint ignoreReferenceField(_forwardStates)
     */
    _forwardStates : {
      focused : true,
      invalid : true
    },

    // overridden
    tabFocus: function() {
      if (this.__widgets.length) {
        this.__widgets[0].tabFocus();
      }
    },

    /*
    ---------------------------------------------------------------------------
      APPLY METHODS
    ---------------------------------------------------------------------------
    */

    // overridden
    _applyEnabled: function(value, old) {
      this.__widgets.forEach(widget => {
        widget.setEnabled(value);
      })
    },

    _applyEditable: function(value, old) {
      this.__widgets.forEach(widget => {
        widget.setEditable(value);
      });
    },

    _applyWrap : function(value, old) {
      this.__widgets.forEach(widget => {
        widget.setWrap(value);
      });
    }
  }
});