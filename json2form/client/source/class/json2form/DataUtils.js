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


qx.Class.define("json2form.DataUtils", {
  type: "static",

  statics: {
    stringify: function(data) {
      return JSON.stringify(data, null, 4);
    },

    deepCloneObject: function(data) {
      return JSON.parse(JSON.stringify(data));
    },

    getRootObj: function() {
      const rootObj = {
        key: "root",
        type: "object",
        properties: {}
      };
      return rootObj;
    },

    addRootKey2Obj: function(data) {
      const rootData = json2form.DataUtils.getRootObj();
      for (const key in data) {
        rootData.properties[key] = json2form.DataUtils.deepCloneObject(data[key]);
      }
      return rootData;
    },

    jsonSchema2PropArray: function(data) {
      let constData = {};
      for (const key in data) {
        if (key === "properties" && typeof data["properties"] === 'object') {
          constData["properties"] = [];
          for (const propKey in data["properties"]) {
            const propObj = data["properties"][propKey];
            let prop = {};
            prop["key"] = ("key" in propObj) ? propObj["key"] : propKey;
            prop["title"] = ("title" in propObj) ? propObj["title"] : propKey;
            const moreProps = json2form.DataUtils.jsonSchema2PropArray(propObj);
            prop = Object.assign(prop, moreProps);
            constData["properties"].push(prop);
          }
        } else {
          constData[key] = json2form.DataUtils.deepCloneObject(data[key]);
        }
      }
      return constData;
    },

    uiSchema2PropObj: function(parentObj, data) {
      let constData = parentObj ? parentObj : {};
      for (const key in data) {
        if (typeof data[key] === "object") {
          constData[key] = {};
          const dataCopy = json2form.DataUtils.deepCloneObject(data[key]);
          const moreProps = Object.values(dataCopy).some(elem => {
            return typeof elem === "object"
          });
          if (moreProps) {
            constData[key]["properties"] = json2form.DataUtils.uiSchema2PropObj(data[key]["properties"], dataCopy);
          } else {
            constData[key] = json2form.DataUtils.uiSchema2PropObj(data[key]["properties"], dataCopy);
          }
        } else {
          constData = json2form.DataUtils.deepCloneObject(data);
        }
      }
      return constData;
    }
  }
});