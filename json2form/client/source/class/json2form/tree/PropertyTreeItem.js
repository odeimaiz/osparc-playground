/* ************************************************************************

   s4l

   https://osparc.io

   Copyright:
     2019 IT'IS Foundation, https://itis.swiss

   License:
     MIT: https://opensource.org/licenses/MIT

   Authors:
     * Odei Maiz (odeimaiz)

************************************************************************ */

/**
 * VirtualTreeItem used by Tree
 *
 * *Example*
 *
 * Here is a little example of how to use the widget.
 *
 * <pre class='javascript'>
 *   tree.setDelegate({
 *     createItem: () => new json2form.tree.PropertyTreeItem(),
 *     bindItem: (c, item, id) => {
 *       c.bindDefaultProperties(item, id);
 *     }
 *   });
 * </pre>
 */

qx.Class.define("json2form.tree.PropertyTreeItem", {
  extend: qx.ui.tree.VirtualTreeItem,

  construct: function() {
    this.base(arguments);

    this.set({
      indent: 11
    });
  },

  properties: {
    key: {
      check: "String",
      event: "changeKey"
    },

    readOnly: {
      init: false,
      check: "Boolean",
      apply: "__applyReadOnly",
      event: "changeReadOnly"
    },

    uiIcon: {
      init: null,
      check: "String",
      nullable: true,
      event: "changeUiIcon"
    },

    type: {
      check: "String",
      event: "changeType"
    },

    uiWidget: {
      init: null,
      check: "String",
      nullable: true,
      event: "changeUiWidget"
    },

    minimum: {
      init: null,
      check: "Number",
      nullable: true,
      event: "changeMinimum"
    },

    maximum: {
      init: null,
      check: "Number",
      nullable: true,
      event: "changeMaximum"
    },

    items: {
      init: null,
      check: "Object",
      nullable: true,
      event: "changeItems"
    },

    minItems: {
      init: null,
      check: "Number",
      nullable: true,
      event: "changeMinItems"
    },

    maxItems: {
      init: null,
      check: "Number",
      nullable: true,
      event: "changeMaxItems"
    },

    default: {
      init: null,
      nullable: true,
      event: "changeDefault"
    },

    value: {
      init: null,
      nullable: true,
      apply: "__applyValue",
      event: "changeValue"
    },

    formEntry: {
      init: null,
      nullable: true,
      event: "changeFormEntry"
    },

    unit: {
      init: null,
      nullable: true,
      apply: "__applyUnit",
      event: "changeUnit"
    },

    formUnitEntry: {
      init: null,
      nullable: true,
      event: "changeFormUnitEntry"
    }
  },

  statics: {
    TYPES: {
      string: "Text",
      integer: "Spinner",
      range: "Slider",
      number: "Number",
      password: "Password",
      textarea: "TextArea",
      boolean: "CheckBox",
      checkbox: "CheckBox",
      array: "Array",
      colorpicker: "ColorPicker",
      quantity: "Quantity",
      quantity3: "Quantity3",
      data: "FileButton"
    }
  },

  members: {
    // overridden
    _addWidgets: function() {
      this.addSpacer(); // from VirtualTreeItem
      this.addOpenButton(); // from VirtualTreeItem
      // this.addIcon(); // from VirtualTreeItem
      this.addLabel(); // from VirtualTreeItem

      // All else should be right justified
      this.addWidget(new qx.ui.core.Spacer(), {flex: 1});
    },

    getValue: function() {
      if (this.hasFormEntry()) {
        const form = this.getFormEntry();
        if (form.getValue) {
          return form.getValue();
        } else {
          return null;
        }
      }
      return null;
    },

    hasFormEntry: function() {
      const hasFormEntry = Boolean(this.getFormEntry && this.getFormEntry());
      return hasFormEntry;
    },

    hasFormUnitEntry: function() {
      const hasFormUnitEntry = Boolean(this.getFormUnitEntry && this.getFormUnitEntry());
      return hasFormUnitEntry;
    },

    buildFormEntry: function() {
      if (this.hasFormEntry()) {
        const formEntry = this.getFormEntry();
        if (this.getKey() === formEntry.key) {
          return;
        }
        this._remove(formEntry);
        this.resetFormEntry();
        this.resetValue();
        if (this.hasFormUnitEntry()) {
          const formUnitEntry = this.getFormUnitEntry();
          this._remove(formUnitEntry);
          this.resetFormUnitEntry();
          this.resetUnit();
        }
      }

      if (this.getType() !== "object") {
        const control = this.__getField();
        if (control) {
          this.setFormEntry(control);
          this.addWidget(this.getFormEntry());
        }
        const unitControl = this.__getUnitField();
        if (unitControl) {
          this.setFormUnitEntry(unitControl);
          this.addWidget(this.getFormUnitEntry());
        }
      }
    },

    __applyValue: function(value, old) {
      if (value === null) {
        return;
      }
      if (this.hasFormEntry()) {
        this.getFormEntry().setValue(value);
      }
    },

    __applyUnit: function(value, old) {
      if (value === null) {
        return;
      }
      if (this.hasFormUnitEntry()) {
        this.getFormUnitEntry().setValue(value);
      }
    },

    __applyReadOnly: function() {
      if (this.hasFormEntry()) {
        this.getFormEntry().setEnabled(!this.getReadOnly());
      }
    },

    __getField: function() {
      const s = {
        key: this.getKey(),
        set: {},
        widget: {}
      };
      if (this.getDefault) {
        s.defaultValue = this.getDefault();
      }
      if (this.getUiWidget()) {
        s.widget.type = json2form.tree.PropertyTreeItem.TYPES[this.getUiWidget()];
      } else {
        let type = this.getType();
        if (type.match(/^data:/)) {
          type = "data";
        }
        s.widget.type = json2form.tree.PropertyTreeItem.TYPES[type];
      }

      let control;
      switch (s.widget.type) {
        case "Text":
          control = new qx.ui.form.TextField();
          setup = this.__setupTextField;
          break;
        case "Number":
        case "Quantity":
        case "Spinner":
          control = new qx.ui.form.Spinner();
          setup = this.__setupSpinner;
          break;
        case "Password":
          control = new qx.ui.form.PasswordField();
          setup = this.__setupTextField;
          break;
        case "TextArea":
          control = new qx.ui.form.TextArea();
          setup = this.__setupTextArea;
          break;
        case "CheckBox":
          control = new qx.ui.form.CheckBox();
          setup = this.__setupBoolField;
          break;
        case "FileButton":
          control = new qx.ui.form.TextField();
          setup = this.__setupFileButton;
          break;
        case "Slider":
          control = new qx.ui.form.Slider();
          setup = this.__setupSlider;
          break;
        case "ColorPicker":
        case "Quantity3":
        case "Array":
          control = new json2form.form.ArraySpinner();
          setup = this.__setupArraySpinner;
          break;
        default:
          console.error("unknown widget type " + s.widget.type);
          break;
      }

      if (control) {
        setup.call(this, s, control);
        control.set(s.set);
        control.key = this.getKey();

        control.setEnabled(!this.getReadOnly());
      }

      return control;
    },
    __setupTextArea: function(s, control) {
      if (s.widget.minHeight) {
        control.setMinHeight(s.widget.minHeight);
      }
      this.__setupTextField(s);
    },
    __setupTextField: function(s) {
      if (s.defaultValue === null) {
        s.set.value = "";
      } else {
        s.set.value = s.defaultValue;
      }
    },
    __setupSpinner: function(s) {
      if (s.defaultValue === null) {
        s.set.value = 0;
      } else {
        s.set.value = parseInt(String(s.defaultValue));
      }
      if (this.getMinimum) {
        s.set.minimum = this.getMinimum();
      }
      if (this.getMaximum) {
        s.set.maximum = this.getMaximum();
      }
    },
    __setupBoolField: function(s, control) {
      if (s.defaultValue === null) {
        s.set.value = true;
      } else {
        s.set.value = s.defaultValue;
      }
    },
    __setupFileButton: function(s) {
    },
    __setupSlider: function(s, control) {
      if (s.defaultValue === null) {
        s.set.value = 0;
      } else {
        s.set.value = parseInt(String(s.defaultValue));
      }
      if (this.getMinimum) {
        s.set.minimum = this.getMinimum();
      }
      if (this.getMaximum) {
        s.set.maximum = this.getMaximum();
      }
      if (s.widget.minWidth) {
        control.setMinWidth(s.widget.minWidth);
      } else {
        control.setMinWidth(120);
      }
    },
    __setupArraySpinner: function(s) {
      if (this.getMinItems()) {
        s.set.nItems = this.getMinItems();
      }
      const items = this.getItems();
      if (items.getMinimum) {
        s.set.minimum = items.getMinimum();
      }
      if (items.getMaximum) {
        s.set.maximum = items.getMaximum();
      }
    },

    __getUnitField: function() {
      if (this.getKey().endsWith(".value")) {
        const unitField = new qx.ui.basic.Label();
        unitField.set({
          value: this.getUnit(),
          minWidth: 30,
          maxWidth: 30
        });
        return unitField;
      }
      return null;
    },
  }
});
