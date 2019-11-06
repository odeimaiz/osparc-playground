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

qx.Class.define("json2form.form.ArraySpinner",
{
  extend : qx.ui.core.Widget,
  implement : [
    qx.ui.form.INumberForm,
    qx.ui.form.IRange,
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
   * @param nItems {Number} Number of spinners
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
      apply : "__applyNItems"
    },


    // overridden
    appearance: {
      refine : true,
      init : "spinner"
    },

    // overridden
    focusable: {
      refine : true,
      init : true
    },

    /** The amount to increment on each event (keypress or pointerdown) */
    singleStep: {
      check : "Number",
      init : 1
    },

    /** The amount to increment on each pageup/pagedown keypress */
    pageStep: {
      check : "Number",
      init : 10
    },

    /** minimal value of the Range object */
    minimum: {
      check : "Number",
      apply : "_applyMinimum",
      init : 0,
      event: "changeMinimum"
    },

    /** The value of the spinner. */
    value: {
      check : "this._checkValue(value)",
      nullable : true,
      apply : "_applyValue",
      init : 0,
      event : "changeValue"
    },

    /** maximal value of the Range object */
    maximum: {
      check : "Number",
      apply : "_applyMaximum",
      init : 100,
      event: "changeMaximum"
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

    /** Controls the display of the number in the textfield */
    numberFormat: {
      check : "qx.util.format.NumberFormat",
      apply : "_applyNumberFormat",
      nullable : true
    },

    // overridden
    allowShrinkY: {
      refine : true,
      init : false
    }
  },

  members: {
    __widgets: null,

    __applyNItems: function(value, old) {
      for (let i=0; i<value; i++) {
        const newWidget =  new qx.ui.form.Spinner(this.getMinimum(), this.getValue(), this.getMaximum());
        this.addWidget(newWidget);
      }
    },

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
    _applyMinimum: function(value, old) {
      this.__widgets.forEach(widget => {
        widget.setMinimum(value);
      })

      if (this.getMaximum() < value) {
        this.setMaximum(value);
      }

      if (this.getValue() < value) {
        this.setValue(value);
      }
    },

    _applyMaximum: function(value, old) {
      this.__widgets.forEach(widget => {
        widget.setMaximum(value);
      })

      if (this.getMinimum() > value) {
        this.setMinimum(value);
      }

      if (this.getValue() > value) {
        this.setValue(value);
      }
    },

    // overridden
    _applyEnabled: function(value, old) {
      this.__widgets.forEach(widget => {
        widget.setEnabled(value);
      })
    },

    _checkValue: function(value) {
      if (typeof value === "number") {
        return value >= this.getMinimum() && value <= this.getMaximum();
      } else if (Array.isArray(value)) {
        // return value.every(this._checkValue);
        let valid = true;
        for (let i=0; i<value.length && valid; i++) {
          valid = value[i] >= this.getMinimum() && value[i] <= this.getMaximum();
        }
        return valid;
      }
      return false;
    },

    _applyValue: function(values, old) {
      // write the value of the spinner to the textfield
      if (values !== null) {
        for (let i=0; i<values.length; i++) {
          if (i < this.__widgets.length) {
            this.__widgets[i].setValue(values[i]);
          }
        }
      }
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
    },

    _applyNumberFormat : function(value, old) {
      this.__widgets.forEach(widget => {
        widget.setApplyNumberFormat(value);
      });
    }
  }
});