/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     MIT: https://opensource.org/licenses/MIT
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)
     * Andreas Ecker (ecker)
     * Martin Wittemann (martinwittemann)
     * Jonathan Weiß (jonathan_rass)

************************************************************************ */

/**
 * A *spinner* is a control that allows you to adjust a numerical value,
 * typically within an allowed range. An obvious example would be to specify the
 * month of a year as a number in the range 1 - 12.
 *
 * To do so, a spinner encompasses a field to display the current value (a
 * textfield) and controls such as up and down buttons to change that value. The
 * current value can also be changed by editing the display field directly, or
 * using mouse wheel and cursor keys.
 *
 * An optional {@link #numberFormat} property allows you to control the format of
 * how a value can be entered and will be displayed.
 *
 * A brief, but non-trivial example:
 *
 * <pre class='javascript'>
 * var s = new qx.ui.form.Spinner();
 * s.set({
 *   maximum: 3000,
 *   minimum: -3000
 * });
 * var nf = new qx.util.format.NumberFormat();
 * nf.setMaximumFractionDigits(2);
 * s.setNumberFormat(nf);
 * </pre>
 *
 * A spinner instance without any further properties specified in the
 * constructor or a subsequent *set* command will appear with default
 * values and behaviour.
 *
 * @childControl textfield {qx.ui.form.TextField} holds the current value of the spinner
 * @childControl upbutton {qx.ui.form.Button} button to increase the value
 * @childControl downbutton {qx.ui.form.Button} button to decrease the value
 *
 */
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
   * @param min {Number} Minimum value
   * @param value {Number} Current value
   * @param max {Number} Maximum value
   */
  construct: function(nItems) {
    this.base(arguments);

    // Force hBox layout
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
    appearance:
    {
      refine : true,
      init : "spinner"
    },

    // overridden
    focusable :
    {
      refine : true,
      init : true
    },

    /** The amount to increment on each event (keypress or pointerdown) */
    singleStep:
    {
      check : "Number",
      init : 1
    },

    /** The amount to increment on each pageup/pagedown keypress */
    pageStep:
    {
      check : "Number",
      init : 10
    },

    /** minimal value of the Range object */
    minimum:
    {
      check : "Number",
      apply : "_applyMinimum",
      init : 0,
      event: "changeMinimum"
    },

    /** The value of the spinner. */
    value:
    {
      check : "this._checkValue(value)",
      nullable : true,
      apply : "_applyValue",
      init : 0,
      event : "changeValue"
    },

    /** maximal value of the Range object */
    maximum:
    {
      check : "Number",
      apply : "_applyMaximum",
      init : 100,
      event: "changeMaximum"
    },

    /** whether the value should wrap around */
    wrap:
    {
      check : "Boolean",
      init : false,
      apply : "_applyWrap"
    },

    /** Controls whether the textfield of the spinner is editable or not */
    editable :
    {
      check : "Boolean",
      init : true,
      apply : "_applyEditable"
    },

    /** Controls the display of the number in the textfield */
    numberFormat :
    {
      check : "qx.util.format.NumberFormat",
      apply : "_applyNumberFormat",
      nullable : true
    },

    // overridden
    allowShrinkY :
    {
      refine : true,
      init : false
    }
  },



  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

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