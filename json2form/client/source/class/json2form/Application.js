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
    __form: null,

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
    },

    __buildLayout: function() {
      const hBox = new qx.ui.container.Composite(new qx.ui.layout.HBox(10));

      const jsonsPanel = this.__buildJsons();
      const formPanel = this.__form = this.__buildForm();

      hBox.add(jsonsPanel, {
        width: "60%"
      });
      hBox.add(formPanel, {
        width: "40%"
      });

      const doc = this.getRoot();
      doc.add(hBox, {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
      });
    },

    __buildJsons: function() {
      const jsonSchemaLayout = this.__buildJsonLayout("JSONSchema");
      this.__jsonSchema = jsonSchemaLayout.getChildren()[1];

      const uiSchemaLayout = this.__buildJsonLayout("UISchema");
      this.__uiSchema = uiSchemaLayout.getChildren()[1];

      const formDataLayout = this.__buildJsonLayout("formData");
      this.__formData = formDataLayout.getChildren()[1];

      const hBox = new qx.ui.container.Composite(new qx.ui.layout.HBox(10));
      hBox.add(uiSchemaLayout, {
        flex: 1
      });
      hBox.add(formDataLayout, {
        flex: 1
      });

      const jsonsLayout = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
      jsonsLayout.add(jsonSchemaLayout, {
        flex: 1
      });
      jsonsLayout.add(hBox, {
        flex: 1
      });

      return jsonsLayout;
    },

    __buildForm: function() {
      return new qx.ui.core.Widget();
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
    }
  }
});