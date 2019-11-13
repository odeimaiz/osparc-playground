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
      apply: "__applyType",
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

  members: {
    getValue: function() {
      const form = this.getFormEntry();
      if (form.classname !== "qx.ui.core.Widget") {
        if (form.getValue) {
          return form.getValue();
        } else {
          return null;
        }
      }
      return null;
    },

    buildFormField: function() {
      console.log("buildFormField");
    },

    // overridden
    _addWidgets: function() {
      this.addSpacer(); // from VirtualTreeItem
      this.addOpenButton(); // from VirtualTreeItem
      // this.addIcon(); // from VirtualTreeItem
      this.addLabel(); // from VirtualTreeItem

      // All else should be right justified
      this.addWidget(new qx.ui.core.Spacer(), {flex: 1});
    },

    __applyType: function(value, old) {
      console.log("type", value);

      const oldControl = this.getFormEntry();
      const children = this._getChildren();
      for (let i=0; i<children.length; i++) {
        if (oldControl === children[i]) {
          this._remove(oldControl);
        }
      }

      if (value !== "object") {
        const control = this.__getField(this.getType());
        this.setFormEntry(control);
        this.addWidget(this.getFormEntry());
      }
    },

    __applyValue: function(value, old) {
      if (this.getFormEntry()) {
        this.getFormEntry().setValue(value);
      }
    },

    __getField: function(type) {
      if (type.match(/^data:/)) {
        type = "data";
      }
      const myType = {
        string: "Text",
        password: "Password",
        integer: "Spinner",
        number: "Number",
        boolean: "CheckBox",
        data: "FileButton",
        object: "Group",
        array: "Array"
      }[type];
      let control;
      switch (myType) {
        case "Date":
          control = new qx.ui.form.DateField();
          setup = this.__setupDateField;
          break;
        case "Text":
          control = new qx.ui.form.TextField();
          setup = this.__setupTextField;
          break;
        case "Number":
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
        case "SelectBox":
          control = new qx.ui.form.SelectBox();
          setup = this.__setupSelectBox;
          break;
        case "ComboBox":
          control = new qx.ui.form.ComboBox();
          setup = this.__setupComboBox;
          break;
        case "FileButton":
          control = new qx.ui.form.TextField();
          setup = this.__setupFileButton;
          break;
        case "Array":
          control = new json2form.form.ArraySpinner();
          control.set({
            maximum: 10000,
            minimum: -10000
          });
          control.setNItems(3);
          break;
        default:
          console.error("unknown widget type " + type);
          break;
      }
      return control;
    }
  }
});
