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
      const rootData = this.getRootObj();
      for (const key in data) {
        rootData.properties[key] = this.deepCloneObject(data[key]);
      }
      return rootData;
    },

    isObject: function (value) {
      return value && typeof value === 'object' && value.constructor === Object;
    },

    uiSchema2PropObj: function(parentObj, data) {
      const deepMerge = json2form.wrapper.DeepMerge.getInstance();
      let constData = parentObj ? parentObj : {};
      for (const key in data) {
        if (json2form.DataUtils.isObject(data[key])) {
          constData[key] = {};
          const dataCopy = json2form.DataUtils.deepCloneObject(data[key]);
          let wChildren = {};
          let woChildren = {};
          for (const keyC in dataCopy) {
            if (keyC.includes("ui:")) {
              woChildren[keyC.replace("ui:", "ui_")] = dataCopy[keyC];
            } else {
              wChildren[keyC] = dataCopy[keyC];
            }
          }
          if (Object.entries(woChildren).length) {
            constData[key] = deepMerge.mergeArrayOfObjs([constData[key], json2form.DataUtils.uiSchema2PropObj(data[key]["properties"], woChildren)]);
          }
          if (Object.entries(wChildren).length) {
            constData[key]["properties"] = json2form.DataUtils.uiSchema2PropObj(data[key]["properties"], wChildren);
          }
        } else {
          constData = json2form.DataUtils.deepCloneObject(data);
        }
      }
      return constData;
    },

    formData2PropObj: function(parentObj, data) {
      const deepMerge = json2form.wrapper.DeepMerge.getInstance();
      let constData = parentObj ? parentObj : {};
      for (const key in data) {
        if (json2form.DataUtils.isObject(data[key])) {
          constData[key] = {};
          const dataCopy = json2form.DataUtils.deepCloneObject(data[key]);
          let wChildren = {};
          let woChildren = {};
          for (const keyC in dataCopy) {
            if (keyC.includes("ui:")) {
              woChildren[keyC.replace("ui:", "ui_")] = dataCopy[keyC];
            } else {
              wChildren[keyC] = dataCopy[keyC];
            }
          }
          if (Object.entries(woChildren).length) {
            constData[key] = deepMerge.mergeArrayOfObjs([constData[key], this.formData2PropObj(data[key]["properties"], woChildren)]);
          }
          if (Object.entries(wChildren).length) {
            constData[key]["properties"] = this.formData2PropObj(data[key]["properties"], wChildren);
          }
        } else {
          constData[key] = {
            "value": data[key]
          };
        }
      }
      return constData;
    },

    formData2FlatObj: function(data, parentKey, flatEntry) {
      flatEntry = flatEntry ? flatEntry : {};
      for (const key in data) {
        const newKey = this.concatKey(key, parentKey);
        if (this.isObject(data[key])) {
          this.formData2FlatObj(data[key], newKey, flatEntry);
        } else {
          flatEntry[newKey] = this.deepCloneObject(data[key]);
        }
      }
      return flatEntry;
    },

    jsonSchema2PropArray: function(data) {
      let constData = {};
      for (const key in data) {
        if (key === "properties" && typeof data["properties"] === 'object') {
          constData["properties"] = [];
          for (const propKey in data["properties"]) {
            const propObj = data["properties"][propKey];
            let prop = {};
            const parentKey = data["key"];
            const newKey = this.concatKey(propKey, parentKey);
            propObj["key"] = prop["key"] = newKey;
            prop["title"] = ("title" in propObj) ? propObj["title"] : propKey;
            const moreProps = this.jsonSchema2PropArray(propObj);
            prop = Object.assign(prop, moreProps);
            constData["properties"].push(prop);
          }
        } else {
          constData[key] = this.deepCloneObject(data[key]);
        }
      }
      if (constData["type"] !== "object") {
        constData["value"] = null;
      }
      return constData;
    },

    concatKey: function(key, parentKey) {
      let newKey = key;
      if (parentKey && parentKey !== "root") {
        newKey = parentKey + "." + newKey;
      }
      return newKey;
    }
  }
});
