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
    __formDataMod: null,
    __mergedForTree: null,
    __mergedSchema: null,
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

      this.__mergedSchema = json2form.DataUtils.getRootObj();

      this.__buildLayout();
      this.__bindElements();

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
      const jsonSchemaSrcLayout = this.__buildJsonLayout("JSONSchemaSrc");
      this.__jsonSchemaSrc = jsonSchemaSrcLayout.getChildren()[1];

      const uiSchemaSrcLayout = this.__buildJsonLayout("UISchemaSrc");
      this.__uiSchemaSrc = uiSchemaSrcLayout.getChildren()[1];

      const formDataSrcLayout = this.__buildJsonLayout("formDataSrc");
      this.__formDataSrc = formDataSrcLayout.getChildren()[1];

      const vBoxSrc = new qx.ui.container.Composite(new qx.ui.layout.VBox(20));
      vBoxSrc.add(jsonSchemaSrcLayout, {
        flex: 1
      });
      vBoxSrc.add(uiSchemaSrcLayout, {
        flex: 1
      });
      vBoxSrc.add(formDataSrcLayout, {
        flex: 1
      });


      const jsonSchemaModLayout = this.__buildJsonLayout("JSONSchemaMod");
      this.__jsonSchemaMod = jsonSchemaModLayout.getChildren()[1];

      const uiSchemaModLayout = this.__buildJsonLayout("UISchemaMod");
      this.__uiSchemaMod = uiSchemaModLayout.getChildren()[1];

      const formDataModLayout = this.__buildJsonLayout("formDataMod");
      this.__formDataMod = formDataModLayout.getChildren()[1];

      const vBoxMod = new qx.ui.container.Composite(new qx.ui.layout.VBox(20));
      vBoxMod.add(jsonSchemaModLayout, {
        flex: 1
      });
      vBoxMod.add(uiSchemaModLayout, {
        flex: 1
      });
      vBoxMod.add(formDataModLayout, {
        flex: 1
      });


      const mergedForTree = this.__buildJsonLayout("MergedForTree");
      this.__mergedForTree = mergedForTree.getChildren()[1];

      const vBoxMerged = new qx.ui.container.Composite(new qx.ui.layout.VBox(20));
      vBoxMerged.add(mergedForTree, {
        flex: 1
      });

      const jsonsLayout = new qx.ui.container.Composite(new qx.ui.layout.HBox(20));
      jsonsLayout.add(vBoxSrc, {
        flex: 1
      });
      jsonsLayout.add(vBoxMod, {
        flex: 1
      });
      jsonsLayout.add(vBoxMerged, {
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

    __bindElements: function() {
      this.__jsonSchemaSrc.addListener("changeValue", e => {
        const data = e.getData();
        const value = JSON.parse(data);
        const valueWRoot = json2form.DataUtils.addRootKey2Obj(value);
        const newFormat = json2form.DataUtils.jsonSchema2PropArray(valueWRoot);
        this.__jsonSchemaMod.setValue(json2form.DataUtils.stringify(newFormat));
      });
      this.__uiSchemaSrc.addListener("changeValue", e => {
        const data = e.getData();
        const value = JSON.parse(data);
        const valueObj = json2form.DataUtils.uiSchema2PropObj(null, value);
        const valueWRoot = json2form.DataUtils.addRootKey2Obj(valueObj);
        // const newFormat = json2form.DataUtils.jsonSchema2PropArray(valueWRoot);
        this.__uiSchemaMod.setValue(json2form.DataUtils.stringify(valueWRoot));
      });
      this.__formDataSrc.addListener("changeValue", e => {
        const data = e.getData();
        const value = JSON.parse(data);
        console.log(value);
      });
      
      this.__jsonSchemaMod.addListener("changeValue", e => {
        const data = e.getData();
        const value = JSON.parse(data);
        this.__mergedForTree.setValue(json2form.DataUtils.stringify(value));
      });

      this.__mergedForTree.addListener("changeValue", e => {
        const data = e.getData();
        const value = JSON.parse(data);
        this.__tree.setMergedData(value);
      });
    },

    __populateWithfake: function() {
      this.__jsonSchemaSrc.setValue(json2form.FakeData.fakeJsonSchema());
      this.__uiSchemaSrc.setValue(json2form.FakeData.fakeUiSchema());
      this.__formDataSrc.setValue(json2form.FakeData.fakeFormData());
    }
  }
});