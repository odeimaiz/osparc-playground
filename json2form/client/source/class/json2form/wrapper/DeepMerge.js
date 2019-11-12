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
 * @asset(deepmerge/umd.js)
 * @ignore(deepmerge)
 */

/* global deepmerge */

qx.Class.define("json2form.wrapper.DeepMerge", {
  extend: qx.core.Object,
  type : "singleton",

  construct() {
    this.base(arguments);
  },

  members: {
    __loadDeepMerge: null,

    init: function() {
      const deepMergePath = "deepmerge/umd.js";
      const loader = new qx.util.DynamicScriptLoader([
        "deepmerge/umd.js"
      ]);
      loader.addListenerOnce("ready", () => {
        console.log(deepMergePath + " loaded");
      }, this);
      loader.addListenerOnce("failed", e => {
        const data = e.getData();
        console.error("failed to load " + data.script);
      });
      loader.start();
    },

    mergeArrayOfObjs: function(arrayOfObjects, options = {}) {
      return deepmerge.all(arrayOfObjects, options);
    }
  }
});