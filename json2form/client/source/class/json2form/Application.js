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
    __jsonSchema: null,
    __uiSchema: null,
    __formData: null,
    __jsonSchema2: null,
    __form: null,
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

      this.__buildLayout();
      this.__bindElements();

      this.__populateWithfake();
    },

    __buildLayout: function() {
      const vBox = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));

      const hBox = new qx.ui.container.Composite(new qx.ui.layout.HBox(20, null, "separator-horizontal"));

      const jsonsPanel = this.__buildJsons();
      const propsWidget = this.__buildForm();
      const footer = this.__buildFooter();

      hBox.add(jsonsPanel, {
        width: "60%"
      });
      hBox.add(propsWidget, {
        width: "40%"
      });

      vBox.add(hBox, {
        flex: 1
      });
      vBox.add(footer);

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
      const jsonSchemaLayout = this.__buildJsonLayout("JSONSchema");
      this.__jsonSchema = jsonSchemaLayout.getChildren()[1];

      const jsonSchemaLayout2 = this.__buildJsonLayout("JSONSchema2");
      this.__jsonSchema2 = jsonSchemaLayout2.getChildren()[1];

      const uiSchemaLayout = this.__buildJsonLayout("UISchema");
      this.__uiSchema = uiSchemaLayout.getChildren()[1];

      const formDataLayout = this.__buildJsonLayout("formData");
      this.__formData = formDataLayout.getChildren()[1];

      const hBox = new qx.ui.container.Composite(new qx.ui.layout.HBox(20));
      hBox.add(jsonSchemaLayout, {
        flex: 1
      });
      hBox.add(jsonSchemaLayout2, {
        flex: 1
      });

      const hBox2 = new qx.ui.container.Composite(new qx.ui.layout.HBox(20));
      hBox2.add(uiSchemaLayout, {
        flex: 1
      });
      hBox2.add(formDataLayout, {
        flex: 1
      });

      const jsonsLayout = new qx.ui.container.Composite(new qx.ui.layout.VBox(20));
      jsonsLayout.add(hBox, {
        flex: 1
      });
      jsonsLayout.add(hBox2, {
        flex: 1
      });

      return jsonsLayout;
    },

    __buildForm: function() {
      const formLayout = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));

      const form = this.__form = new json2form.form.Auto();
      const propsWidget = new json2form.form.renderer.PropForm(form);
      formLayout.add(propsWidget, {
        flex: 1
      });
      form.addListener("changeData", e => {
        const data = e.getData();
        console.log("Data changed", data);
        this.__formData.setValue(json2form.DataUtils.stringify(data));
      }, this);


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

    __buildFooter: function() {
      return new json2form.LinkButton("Powered by qooxdoo-json2form", "https://github.com/odeimaiz/osparc-playground");
    },

    __bindElements: function() {
      /*
      this.__jsonSchema.bind("value", this.__form, "jsonSchema", {
        converter: textValue => {
          return JSON.parse(textValue);
        }
      });
      this.__uiSchema.bind("value", this.__form, "uiSchema", {
        converter: textValue => {
          return JSON.parse(textValue);
        }
      });
      this.__formData.bind("value", this.__form, "formData", {
        converter: textValue => {
          return JSON.parse(textValue);
        }
      });
      */
      this.__jsonSchema.addListener("changeValue", e => {
        const data = e.getData();
        const value = JSON.parse(data);
        const valueCopy = json2form.DataUtils.deepCloneObject(value);
        this.__form.setJsonSchema(value["properties"]);
        const newFormat = json2form.DataUtils.propObj2PropArray(valueCopy);
        this.__jsonSchema2.setValue(json2form.DataUtils.stringify(newFormat));
        this.__tree.setJsonSchema(newFormat);
      });
      this.__uiSchema.addListener("changeValue", e => {
        const data = e.getData();
        const value = JSON.parse(data);
        this.__form.setUiSchema(value);
        this.__tree.setUiSchema(value);
      });
      this.__formData.addListener("changeValue", e => {
        const data = e.getData();
        const value = JSON.parse(data);
        this.__form.setFormData(value);
        this.__tree.setFormData(value);
      });
    },

    __populateWithfake: function() {
      this.__jsonSchema.setValue(json2form.FakeData.fakeJsonSchema());
      this.__uiSchema.setValue(json2form.FakeData.fakeUiSchema());
      this.__formData.setValue(json2form.FakeData.fakeFormData());
    }
  }
});