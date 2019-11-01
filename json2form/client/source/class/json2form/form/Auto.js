/* ************************************************************************
   Copyright: 2013 OETIKER+PARTNER AG
              2018 ITIS Foundation
   License:   MIT
   Authors:   Tobi Oetiker <tobi@oetiker.ch>
   Utf8Check: äöü
************************************************************************ */

/**
 * Create a form. The argument to the form
 * widget defines the structure of the form.
 *
 * <pre class='javascript'>
 *   {
 *     key: {
 *       displayOrder: 5,
 *       label: "Widget SelectBox Test",
 *       description: "Test Input for SelectBox",
 *       defaultValue: "dog",
 *       type: "string",
 *       widget: {
 *         type: "SelectBox",
 *         structure: [{
 *           key: "dog",
 *           label: "A Dog"
 *         }, {
 *           key: "cat",
 *           label: "A Cat"
 *         }]
 *       }
 *     },
 *   }
 * </pre>
 *
 * The default widgets for data types are as follows:
 *     string: text
 *     integer: spinner
 *     bool:  checkBox
 *     number: text
 *     data:  file-upload/selection
 *
 * The following widget types are supported:
 *     selectBox: { structure: [ {key: x, label: y}, ...] },
 *     date: { }, // following unix tradition, dates are represented in epoc seconds
 *     password: {},
 *     textArea: {},
 *     hiddenText: {},
 *     checkBox: {},
 *     comboBox: {},
 *
 *
 * Populate the new form using the setData method, providing a map
 * with the required data.
 *
 */

qx.Class.define("json2form.form.Auto", {
  extend: qx.ui.form.Form,
  include: [qx.locale.MTranslation],

  construct: function() {
    this.base(arguments);

    this.__ctrlMap = {};
    this.__formCtrl = new qx.data.controller.Form(null, this);
    this.__boxCtrl = {};
  },

  properties: {
    jsonSchema: {
      check: "Object",
      init: {},
      event: "changeJsonSchema",
      apply: "_applyJsonSchema"
    },
    uiSchema: {
      check: "Object",
      init: {},
      event: "changeUiSchema",
      apply: "_applyUiSchema"
    },
    formData: {
      check: "Object",
      init: {},
      event: "changeFormData",
      apply: "_applyFormData"
    }/*,

    propForm: {
      check: "qx.ui.form.renderer.Single",
      init: new qx.ui.form.renderer.Single()
    }*/
  },

  members: {
    __boxCtrl: null,
    __ctrlMap: null,
    __formCtrl: null,

    _applyJsonSchema: function(jsonSchema) {
      const items = this.getItems();
      for (const itemKey in items) {
        this.remove(items[itemKey]);
      }
      this.__addProperties(jsonSchema);
    },

    _applyUiSchema: function(uiSchema) {
      console.log(uiSchema);
    },

    _applyFormData: function(formData) {
      console.log(formData);
    },

    __addProperties: function(props) {
      for (const key in props) {
        this.__addProperty(props[key], key);
      }
    },

    __addProperty: function(s, key) {
      if (s.default) {
        if (!s.set) {
          s.set = {};
        }
        s.set.value = s.default;
      }

      if (!s.widget) {
        let type = s.type;
        if (type.match(/^data:/)) {
          type = "data";
        }
        s.widget = {
          type: {
            string: "Text",
            integer: "Spinner",
            number: "Number",
            boolean: "CheckBox",
            data: "FileButton"
          }[type]
        };
      }
      let control;
      let setup;
      switch (s.widget.type) {
        case "Date":
          control = new qx.ui.form.DateField();
          setup = this.__setupDateField;
          break;
        case "Text":
          control = new qx.ui.form.TextField();
          setup = this.__setupTextField;
          break;
        case "Number":
          control = new qx.ui.form.TextField();
          setup = this.__setupNumberField;
          break;
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
        default:
          throw new Error("unknown widget type " + s.widget.type);
      }
      this.__ctrlMap[key] = control;
      let option = {}; // could use this to pass on info to the form renderer
      this.add(control, s.title ? this["tr"](s.title):null, null, key, null, option);

      setup.call(this, s, key, control);

      if (s.set) {
        if (s.set.filter) {
          s.set.filter = RegExp(s.filter);
        }
        if (s.set.placeholder) {
          s.set.placeholder = this["tr"](s.set.placeholder);
        }
        if (s.set.label) {
          s.set.label = this["tr"](s.set.label);
        }
        control.set(s.set);
      }
      control.key = key;
      control.description = s.description;
      this.__ctrlMap[key] = control;
    },

    __setupDateField: function(s) {
      this.__formCtrl.addBindingOptions(s.key,
        { // model2target
          converter: function(data) {
            if (/^\d+$/.test(String(data))) {
              let d = new Date();
              d.setTime(parseInt(data) * 1000);
              let d2 = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0);
              return d2;
            }
            if (qx.lang.Type.isDate(data)) {
              return data;
            }
            return null;
          }
        },
        { // target2model
          converter: function(data) {
            if (qx.lang.Type.isDate(data)) {
              let d = new Date(Date.UTC(data.getFullYear(), data.getMonth(), data.getDate(), 0, 0, 0, 0));
              return Math.round(d.getTime()/1000);
            }
            return null;
          }
        }
      );
      if (!s.set) {
        s.set = {};
      }
      s.set.dateFormat = new qx.util.format.DateFormat(
        this["tr"](
          s.set.dateFormat ?
            s.set.dateFormat :
            "dd.MM.yyyy"
        )
      );
      let dateValue = s.defaultValue;
      if (dateValue !== null) {
        if (typeof dateValue == "number") {
          s.defaultValue = new Date(dateValue * 1000);
        } else {
          s.defaultValue = new Date(dateValue);
        }
      }
    },
    __setupTextArea: function(s, key, control) {
      if (s.widget.minHeight) {
        control.setMinHeight(s.widget.minHeight);
      }
      this.__setupTextField(s, key, control);
    },
    __setupTextField: function(s, key) {
      this.__formCtrl.addBindingOptions(key,
        { // model2target
          converter: function(data) {
            return String(data);
          }
        },
        { // target2model
          converter: function(data) {
            return data;
          }
        }
      );
    },
    __setupNumberField: function(s, key) {
      if (!s.set) {
        s.set = {};
      }
      if (s.defaultValue) {
        s.set.value = qx.lang.Type.isNumber(s.defaultValue) ? String(s.defaultValue) : s.defaultValue;
      } else {
        s.set.value = String(0);
      }
      this.__formCtrl.addBindingOptions(key,
        { // model2target
          converter: function(data) {
            if (qx.lang.Type.isNumber(data)) {
              return String(data);
            }
            return data;
          }
        },
        { // target2model
          converter: function(data) {
            return parseFloat(data);
          }
        }
      );
    },
    __setupSpinner: function(s, key) {
      if (!s.set) {
        s.set = {};
      }
      if (s.defaultValue) {
        s.set.value = parseInt(String(s.defaultValue));
      } else {
        s.set.value = 0;
      }
      this.__formCtrl.addBindingOptions(key,
        { // model2target
          converter: function(data) {
            let d = String(data);
            if (/^\d+$/.test(d)) {
              return parseInt(d);
            }
            return null;
          }
        },
        { // target2model
          converter: function(data) {
            return parseInt(data);
          }
        }
      );
    },
    __setupSelectBox: function(s, key, control) {
      let controller = this.__boxCtrl[key] = new qx.data.controller.List(null, control, "label");
      controller.setDelegate({
        bindItem: function(ctrl, item, index) {
          ctrl.bindProperty("key", "model", null, item, index);
          ctrl.bindProperty("label", "label", null, item, index);
        }
      });
      let cfg = s.widget;
      if (cfg.structure) {
        cfg.structure.forEach(function(item) {
          item.label = item.label ? this["tr"](item.label) : null;
        }, this);
      } else {
        cfg.structure = [{
          label: "",
          key: null
        }];
      }
      if (s.defaultValue) {
        s.set.value = [s.defaultValue];
      }
      let sbModel = qx.data.marshal.Json.createModel(cfg.structure);
      controller.setModel(sbModel);
    },
    __setupComboBox: function(s, key, control) {
      let ctrl = this.__boxCtrl[key] = new qx.data.controller.List(null, control);
      let cfg = s.cfg;
      if (cfg.structure) {
        cfg.structure.forEach(function(item) {
          item = item ? this["tr"](item):null;
        }, this);
      } else {
        cfg.structure = [];
      }
      let sbModel = qx.data.marshal.Json.createModel(cfg.structure);
      ctrl.setModel(sbModel);
    },
    __setupBoolField: function(s, key, control) {
      if (!s.set) {
        s.set = {};
      }
      this.__formCtrl.addBindingOptions(key,
        { // model2target
          converter: function(data) {
            return data;
          }
        },
        { // target2model
          converter: function(data) {
            return data;
          }
        }
      );
    },
    __setupFileButton: function(s, key) {
      this.__formCtrl.addBindingOptions(key,
        { // model2target
          converter: function(data) {
            return String(data);
          }
        },
        { // target2model
          converter: function(data) {
            return data;
          }
        }
      );
    }
  }
});
