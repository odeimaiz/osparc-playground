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
      check: "String",
      nullable: true,
      event: "changeDefault"
    },

    value: {
      apply: "__applyValue",
      event: "changeValue"
    },

    formEntry: {
      init: null,
      nullable: true,
      event: "changeFormEntry"
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
      const form = this.getFormEntry();
      if (form && form.classname !== "qx.ui.core.Widget") {
        if (form.getValue) {
          return form.getValue();
        } else {
          return null;
        }
      }
      return null;
    },

    buildFormField: function() {
      if (this.getFormEntry()) {
        return;
      }

      if (this.getType() !== "object") {
        const control = this.__addField();
        if (control) {
          this.setFormEntry(control);
          this.addWidget(this.getFormEntry());
        }
      }
    },

    __applyValue: function(value, old) {
      if (this.getFormEntry()) {
        this.getFormEntry().setValue(value);
      }
    },

    __translateWidget: function() {

    },

    __addField: function() {
      const s = {
        key: this.getKey(),
        set: {},
        widget: {}
      };
      if (this.getDefault()) {
        s.defaultValue = this.getDefault();
        s.set.value = this.getDefault();
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
          control.set({
            maximum: 10000,
            minimum: -10000
          });
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
        case "ColorPicker":
        case "Quantity3":
        case "Array":
          control = new json2form.form.ArraySpinner();
          control.set({
            maximum: 10000,
            minimum: -10000
          });
          setup = this.__setupArraySpinner;
          break;
        default:
          console.error("unknown widget type " + type);
          break;
      }

      if (control) {
        setup.call(this, s, control);
        control.set(s.set);
        control.key = this.getKey();
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
    },
    __setupSpinner: function(s) {
      if (s.defaultValue) {
        s.set.value = parseInt(String(s.defaultValue));
      } else {
        s.set.value = 0;
      }
    },
    __setupBoolField: function(s) {
      if (s.defaultValue) {
        s.set.value = (s.defaultValue === "true" || s.defaultValue === "True");
      } else {
        s.set.value = true;
      }
    },
    __setupFileButton: function(s) {
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
    }
  }
});
