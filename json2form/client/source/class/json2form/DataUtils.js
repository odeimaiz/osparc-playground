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

    addRootKey2Obj: function(data) {
      const rootData = {
        key: "root",
        type: "object",
        properties: {}
      }
      for (const key in data) {
        rootData.properties[key] = json2form.DataUtils.deepCloneObject(data[key]);
      }
      return rootData;
    },

    propObj2PropArray: function(data) {
      let constData = {};
      for (const key in data) {
        if (key === "properties" && typeof data["properties"] === 'object') {
          constData["properties"] = [];
          for (const propKey in data["properties"]) {
            const propObj = data["properties"][propKey];
            let prop = {};
            prop["key"] = ("key" in propObj) ? propObj["key"] : propKey;
            prop["title"] = ("title" in propObj) ? propObj["title"] : propKey;
            const moreProps = json2form.DataUtils.propObj2PropArray(propObj);
            prop = Object.assign(prop, moreProps);
            constData["properties"].push(prop);
          }
        } else {
          constData[key] = json2form.DataUtils.deepCloneObject(data[key]);
        }
      }
      return constData;
    }
  }
});