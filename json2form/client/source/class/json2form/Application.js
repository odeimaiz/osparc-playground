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

/**
 * This is the main application class of "json2form"
 *
 * @asset(json2form/*)
 */

qx.Class.define("json2form.Application", {
  extend : qx.application.Standalone,

  members :
  {
    __jsonSchemaSrc: null,
    __uiSchemaSrc: null,
    __formDataSrc: null,
    __jsonSchemaMod: null,
    __uiSchemaMod: null,
    __mergedSchemaMod: null,
    __mergedForTree: null,
    __tree: null,

    /**
     * This method contains the initial application code and gets called 
     * during startup of the application
     */
    main: function() {
      // Call super class
      this.base(arguments);

      // Enable logging in debug variant
      if (qx.core.Environment.get("qx.debug")) {
        // support native logging capabilities, e.g. Firebug for Firefox
        qx.log.appender.Native;
      }

      json2form.wrapper.DeepMerge.getInstance().init();

      this.__buildLayout();
      this.__bindSchemas();
      this.__bindDatas();

      this.__populateWithfake();
    },

    __buildLayout: function() {
      const vBox = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));

      const hBox = new qx.ui.container.Composite(new qx.ui.layout.HBox(20, null, "separator-horizontal"));

      const jsonsPanel = this.__buildJsons();
      const propsWidget = this.__buildTree();

      hBox.add(jsonsPanel, {
        width: "75%"
      });
      hBox.add(propsWidget, {
        width: "25%"
      });

      vBox.add(hBox, {
        flex: 1
      });

      const doc = this.getRoot();
      const padding = 20;
      doc.add(vBox, {
        top: padding,
        bottom: padding,
        left: padding,
        right: padding
      });
    },

    __buildJsons: function() {
      const jsonsLayout = new qx.ui.container.Composite(new qx.ui.layout.VBox(20));


      const jsonSchemasLayout = new qx.ui.container.Composite(new qx.ui.layout.HBox(20));

      const vBoxSrc = new qx.ui.container.Composite(new qx.ui.layout.VBox(20));
      const jsonSchemaSrcLayout = this.__buildJsonLayout("JSONSchemaSrc");
      this.__jsonSchemaSrc = jsonSchemaSrcLayout.getChildren()[1];
      vBoxSrc.add(jsonSchemaSrcLayout, {
        flex: 1
      });
      const uiSchemaSrcLayout = this.__buildJsonLayout("UISchemaSrc");
      this.__uiSchemaSrc = uiSchemaSrcLayout.getChildren()[1];
      vBoxSrc.add(uiSchemaSrcLayout, {
        flex: 1
      });
      jsonSchemasLayout.add(vBoxSrc, {
        flex: 1
      });


      const vBoxMod = new qx.ui.container.Composite(new qx.ui.layout.VBox(20));
      const jsonSchemaModLayout = this.__buildJsonLayout("JSONSchemaMod");
      this.__jsonSchemaMod = jsonSchemaModLayout.getChildren()[1];
      this.__jsonSchemaMod.setReadOnly(true);
      vBoxMod.add(jsonSchemaModLayout, {
        flex: 1
      });
      const uiSchemaModLayout = this.__buildJsonLayout("UISchemaMod");
      this.__uiSchemaMod = uiSchemaModLayout.getChildren()[1];
      this.__uiSchemaMod.setReadOnly(true);
      vBoxMod.add(uiSchemaModLayout, {
        flex: 1
      });
      jsonSchemasLayout.add(vBoxMod, {
        flex: 1
      });


      const mergedSchemaMod = this.__buildJsonLayout("SchemasMerged");
      this.__mergedSchemaMod = mergedSchemaMod.getChildren()[1];
      this.__mergedSchemaMod.setReadOnly(true);
      jsonSchemasLayout.add(mergedSchemaMod, {
        flex: 1
      });


      const mergedForTree = this.__buildJsonLayout("SchemasForTreeBinding");
      this.__mergedForTree = mergedForTree.getChildren()[1];
      this.__mergedForTree.setReadOnly(true);
      jsonSchemasLayout.add(mergedForTree, {
        flex: 1
      });


      const formDataSrcLayout = this.__buildJsonLayout("formDataSrc");
      this.__formDataSrc = formDataSrcLayout.getChildren()[1];
      jsonsLayout.add(jsonSchemasLayout, {
        flex: 1
      });
      jsonsLayout.add(formDataSrcLayout, {
        flex: 1
      });


      return jsonsLayout;
    },

    __buildTree: function() {
      const formLayout = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));

      const tree = this.__tree = new json2form.tree.PropertyTree();
      formLayout.add(tree, {
        flex: 1
      });

      return formLayout;
    },

    __buildJsonLayout: function(labelText) {
      const vBox = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));

      const label = new qx.ui.basic.Label("<b>"+labelText+"<b>").set({
        rich: true
      });
      vBox.add(label);

      const textArea = new qx.ui.form.TextArea();
      vBox.add(textArea, {
        flex: 1
      });

      return vBox;
    },

    __bindSchemas: function() {
      const deepMerge = json2form.wrapper.DeepMerge.getInstance();

      this.__jsonSchemaSrc.addListener("changeValue", e => {
        const data = e.getData();
        let value = JSON.parse(data);
        this.__jsonSchemaMod.setValue(json2form.DataUtils.stringify(value));


        const oldVal = JSON.parse(this.__mergedSchemaMod.getValue());
        if (oldVal) {
          value = deepMerge.mergeArrayOfObjs([oldVal, value]);
        }
        this.__mergedSchemaMod.setValue(json2form.DataUtils.stringify(value));


        const valueWRoot = json2form.DataUtils.addRootKey2Obj(value);
        const newFormat = json2form.DataUtils.jsonSchema2PropArray(valueWRoot);
        this.__mergedForTree.setValue(json2form.DataUtils.stringify(newFormat));


        this.__tree.setSchema(newFormat);
      });
      this.__uiSchemaSrc.addListener("changeValue", e => {
        const data = e.getData();
        const val = JSON.parse(data);
        let value = json2form.DataUtils.uiSchema2PropObj(null, val);
        this.__uiSchemaMod.setValue(json2form.DataUtils.stringify(value));


        const oldVal = JSON.parse(this.__mergedSchemaMod.getValue());
        if (oldVal) {
          value = deepMerge.mergeArrayOfObjs([oldVal, value]);
        }
        this.__mergedSchemaMod.setValue(json2form.DataUtils.stringify(value));


        const valueWRoot = json2form.DataUtils.addRootKey2Obj(value);
        const newFormat = json2form.DataUtils.jsonSchema2PropArray(valueWRoot);
        this.__mergedForTree.setValue(json2form.DataUtils.stringify(newFormat));


        this.__tree.setSchema(newFormat);
      });
    },

    __bindDatas: function() {
      this.__formDataSrc.addListener("changeValue", e => {
        const data = e.getData();
        const value = JSON.parse(data);
        this.__tree.setData(value);
      });

      this.__tree.addListener("dataChanged", e => {
        const deepMerge = json2form.wrapper.DeepMerge.getInstance();

        const data = e.getData();
        for (const key in data) {
          const keys = key.split(".");
          const deepestKey = keys[keys.length-1];
          let changedValue = {};
          keys.reduce((o, s) => {
            o[s] = {};
            if (s === deepestKey) {
              o[s] = data[key];
            }
            return o[s];
          }, changedValue);
  
          const valueOld = JSON.parse(this.__formDataSrc.getValue());
          const newValue = deepMerge.mergeArrayOfObjs([valueOld, changedValue]);
          this.__formDataSrc.setValue(json2form.DataUtils.stringify(newValue));
        }
      });
    },

    __populateWithfake: function() {
      this.__jsonSchemaSrc.setValue(json2form.FakeData.fakeJsonSchema());
      this.__uiSchemaSrc.setValue(json2form.FakeData.fakeUiSchema());
      this.__formDataSrc.setValue(json2form.FakeData.fakeFormData());
    }
  }
});