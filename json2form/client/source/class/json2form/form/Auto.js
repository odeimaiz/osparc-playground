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
    }
  },

  events: {
    /**
     * fire when the form changes content and
     * and provide access to the data
     */
    "changeData": "qx.event.type.Data"
  },

  members: {
    __boxCtrl: null,
    __ctrlMap: null,
    __formCtrl: null,
    __model: null,
    __settingData: false,

    _applyJsonSchema: function(jsonSchema) {
      this.__settingData = true;

      const oldData = this.getData();

      this.__removeAll();
      for (const key in jsonSchema) {
        this.__addField(jsonSchema[key], key);
      }

      if (oldData) {
        this.setData(oldData);
      }

      const model = this.__model = this.__formCtrl.createModel(true);
      model.addListener("changeBubble", e => {
        if (!this.__settingData) {
          this.fireDataEvent("changeData", this.getData());
        }
      },
      this);

      this.__settingData = false;
    },

    _applyUiSchema: function(uiSchema) {
      console.log(uiSchema);
    },

    _applyFormData: function(formData) {
      this.__settingData = true;

      for (const itemKey in formData) {
        const ctrl = this.getControl(itemKey);
        if (ctrl) {
          ctrl.setValue(formData[itemKey]);
        }
      }

      this.__settingData = false;
    },

    /**
     * get a handle to the control with the given name
     *
     * @param key {let} key of the the field
     * @return {let} control associated with the field
     */
    getControl: function(key) {
      return this.__ctrlMap[key];
    },

    /**
     * fetch the data for this form
     *
     * @return {let} all data from the form
     */
    getData: function() {
      return this.__getData(this.__model);
    },

    /**
     * load new data into the data main model
     *
     * @param data {let} map with key value pairs to apply
     * @param relax {let} ignore non existing keys
     */
    setData: function(data, relax) {
      this.__setData(this.__model, data, relax);
    },

    /**
     * turn a model object into a plain data structure
     *
     * @param model {let} TODOC
     * @return {let} TODOC
     */
    __getData: function(model) {
      if (model === null) {
        return null;
      }
      let props = model.constructor.$$properties;
      let data = {};

      for (let key in props) {
        let getter = "get" + qx.lang.String.firstUp(key);
        data[key] = model[getter]();
      }

      return data;
    },


    /**
     * load new data into a model
     * if relax is set unknown properties will be ignored
     *
     * @param model {let} TODOC
     * @param data {let} TODOC
     * @param relax {let} TODOC
     */
    __setData: function(model, data, relax) {
      this.__settingData = true;

      for (let key in data) {
        this.getControl(key).setEnabled(true);
        let upkey = qx.lang.String.firstUp(key);
        let setter = "set" + upkey;
        let value = data[key];
        if (relax && !model[setter]) {
          continue;
        }
        model[setter](value);
      }

      this.__settingData = false;

      /* only fire ONE if there was an attempt at change */

      this.fireDataEvent("changeData", this.getData());
    },

    __removeAll: function() {
      const items = this.getItems();
      for (const itemKey in items) {
        this.remove(items[itemKey]);
      }
    },

    __addField: function(s, key) {
      if (!s.title) {
        s.title = key;
      }
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
            password: "Password",
            integer: "Spinner",
            number: "Number",
            boolean: "CheckBox",
            data: "FileButton",
            array: "Array"
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
          control = new qx.ui.form.Spinner();
          setup = this.__setupSpinner;
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
        case "Array":
          control = new json2form.form.ArraySpinner();
          setup = this.__setupArray;
          break;
        default:
          // throw new Error("unknown widget type " + s.widget.type);
          console.log("unknown widget type " + s.type);
          break;
      }
      if (control === undefined) {
        return;
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
      if (!s.set) {
        s.set = {};
      }
      s.set.value = s.defaultValue ? String(s.defaultValue) : "";
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
    },

    __setupArray: function(s, key) {
      console.log(s, key);
    }
  }
});
