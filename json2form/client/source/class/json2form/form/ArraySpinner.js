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

qx.Class.define("json2form.form.ArraySpinner", {
  extend : json2form.form.ArrayForm,
  implement : [
    qx.ui.form.INumberForm,
    qx.ui.form.IRange
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
    this.base(arguments, nItems);
  },

  properties: {
    // overridden
    appearance: {
      refine : true,
      init : "spinner"
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
      init : Number.MIN_SAFE_INTEGER,
      event: "changeMinimum"
    },

    /** The value of the spinner. */
    value: {
      check : "this._checkValue(value)",
      nullable : true,
      apply : "_applyValue",
      init : Number.MAX_SAFE_INTEGER,
      event : "changeValue"
    },

    /** maximal value of the Range object */
    maximum: {
      check : "Number",
      apply : "_applyMaximum",
      init : 100,
      event: "changeMaximum"
    },

    /** Controls the display of the number in the textfield */
    numberFormat: {
      check : "qx.util.format.NumberFormat",
      apply : "_applyNumberFormat",
      nullable : true
    }
  },

  members: {
    getValue: function() {
      const value = [];
      for (let i=0; i<this.__widgets.length; i++) {
        value.push(this.__widgets[i].getValue());
      }
      return value;
    },

    // overridden
    _applyNItems: function(value, old) {
      for (let i=0; i<value; i++) {
        const newWidget =  new qx.ui.form.Spinner(-1000, 0, 1000);
        this.addWidget(newWidget);
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

    _checkValue: function(value) {
      if (typeof value === "number") {
        return value >= this.getMinimum() && value <= this.getMaximum();
      } else if (Array.isArray(value)) {
        let valid = true;
        for (let i=0; i<value.length && valid; i++) {
          valid = value[i] >= this.getMinimum() && value[i] <= this.getMaximum();
        }
        return valid;
      } else if (value.classname === "qx.data.Array") {
        const myArray = value.toArray();
        const min = this.getMinimum();
        const max = this.getMaximum();
        let valid = true;
        for (let i=0; i<myArray.length && valid; i++) {
          valid = myArray[i] >= min && myArray[i] <= max;
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
            if (values.classname === "qx.data.Array") {
              this.__widgets[i].setValue(values.toArray()[i]);
            } else {
              this.__widgets[i].setValue(values[i]);
            }
          }
        }
      }
    },

    _applyNumberFormat : function(value, old) {
      this.__widgets.forEach(widget => {
        widget.setApplyNumberFormat(value);
      });
    }
  }
});