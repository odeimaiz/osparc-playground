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
 *
 *
 *
 * *Example*
 *
 * Here is a little example of how to use the widget.
 *
 * <pre class='javascript'>
 *   const tree = new json2form.tree.PropertyTree();
 *   this.getRoot().add(tree);
 * </pre>
 */

qx.Class.define("json2form.tree.PropertyTree", {
  extend: qx.ui.tree.VirtualTree,

  construct: function() {
    this.base(arguments, null, "title", "properties");

    this.setDelegate({
      createItem: () => new json2form.tree.PropertyTreeItem(),
      bindItem: (c, item, id) => {
        c.bindDefaultProperties(item, id);
        /*
        c.bindProperty("type", "formEntry", {
          converter: function(data) {
            console.log("type", type);
            const control = new qx.ui.form.CheckBox();
            const setup = this.__setupBoolField;

            let option = {}; // could use this to pass on info to the form renderer
            this.add(control, s.title ? this["tr"](s.title):null, null, key, null, option);
            setup.call(this, s, key, control);

            return control;
          }
        }, item, id);
        */
      }
    });
  },

  properties: {
    jsonSchema: {
      check: "Object",
      init: {},
      event: "changeJsonSchema",
      apply: "__populateTree"
    },
    uiSchema: {
      check: "Object",
      init: {},
      event: "changeUiSchema"
    },
    formData: {
      check: "Object",
      init: {},
      event: "changeFormData"
    }
  },

  members: {
    __populateTree: function(value, old) {
      const rootModel = qx.data.marshal.Json.createModel(value, true);
      this.setModel(rootModel);
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
    }
  }
});
