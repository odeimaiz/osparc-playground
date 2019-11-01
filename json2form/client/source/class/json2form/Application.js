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
    __formTitle: null,
    __formDescription: null,

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
      const hBox = new qx.ui.container.Composite(new qx.ui.layout.HBox(10));

      const jsonsPanel = this.__buildJsons();
      const propsWidget = this.__buildForm();

      hBox.add(jsonsPanel, {
        width: "60%"
      });
      hBox.add(propsWidget, {
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
      const formLayout = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));

      const formTitle = this.__formTitle = new qx.ui.basic.Label().set({
        rich: true
      });
      formLayout.add(formTitle);

      const formDesc = this.__formDescription = new qx.ui.basic.Label();
      formLayout.add(formDesc);

      const form = this.__form = new json2form.form.Auto();
      const propsWidget = new json2form.form.renderer.PropForm(form);
      formLayout.add(propsWidget, {
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
        this.__formTitle.setValue(value["title"]);
        this.__formDescription.setValue(value["description"]);
        this.__form.setJsonSchema(value["properties"]);
      });
      this.__uiSchema.addListener("changeValue", e => {
        const data = e.getData();
        const value = JSON.parse(data);
        this.__form.setUiSchema(value);
      });
      this.__formData.addListener("changeValue", e => {
        const data = e.getData();
        const value = JSON.parse(data);
        this.__form.setFormData(value);
      });
    },

    __populateWithfake: function() {
      this.__jsonSchema.setValue(this.__fakeJsonSchema());
      this.__uiSchema.setValue(this.__fakeUiSchema());
      this.__formData.setValue(this.__fakeFormData());
    },

    __fakeJsonSchema: function() {
      return JSON.stringify({
        "title": "A registration form",
        "description": "A simple form example.",
        "type": "object",
        "required": [
          "firstName",
          "lastName"
        ],
        "properties": {
          "firstName": {
            "type": "string",
            "title": "First name",
            "default": "Chuck"
          },
          "lastName": {
            "type": "string",
            "title": "Last name"
          },
          "age": {
            "type": "integer",
            "title": "Age"
          },
          "bio": {
            "type": "string",
            "title": "Bio"
          },
          "password": {
            "type": "string",
            "title": "Password",
            "minLength": 3
          },
          "telephone": {
            "type": "string",
            "title": "Telephone",
            "minLength": 10
          }
        }
      }, null, 4);
    },

    __fakeUiSchema: function() {
      return JSON.stringify({
        "firstName": {
          "ui:autofocus": true,
          "ui:emptyValue": ""
        },
        "age": {
          "ui:widget": "updown",
          "ui:title": "Age of person",
          "ui:description": "(earthian year)"
        },
        "bio": {
          "ui:widget": "textarea"
        },
        "password": {
          "ui:widget": "password",
          "ui:help": "Hint: Make it strong!"
        },
        "date": {
          "ui:widget": "alt-datetime"
        },
        "telephone": {
          "ui:options": {
            "inputType": "tel"
          }
        }
      }, null, 4);
    },

    __fakeFormData: function() {
      return JSON.stringify({
        "firstName": "Chuck",
        "lastName": "Norris",
        "age": 75,
        "bio": "Roundhouse kicking asses since 1940",
        "password": "noneed"
      }, null, 4);
    }
  }
});