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

    this.set({
      hideRoot: true
    })

    this.setDelegate({
      createItem: () => new json2form.tree.PropertyTreeItem(),
      bindItem: (c, item, id) => {
        c.bindDefaultProperties(item, id);
        c.bindProperty("key", "key", null, item, id);
        c.bindProperty("ui_icon", "uiIcon", null, item, id);
        c.bindProperty("type", "type", null, item, id);
        c.bindProperty("ui_widget", "uiWidget", null, item, id);
        c.bindProperty("items", "items", null, item, id);
        c.bindProperty("minItems", "minItems", null, item, id);
        c.bindProperty("maxItems", "maxItems", null, item, id);
        c.bindProperty("default", "default", null, item, id);
        item.buildFormEntry();
        return;
        
        if (item.getType() !== "object") {
          c.bindProperty("readOnly", "readOnly", null, item, id);
          c.bindProperty("value", "value", null, item, id);
          /*
          c.bindPropertyReverse("value", "value", {
            converter: function(data) {
              if (data === null) {
                console.log("trying to set null in ");
              }
              console.log(data);
              return data;
            }
          }, item, id);
          */
        }
      }
    });
  },

  properties: {
    mergedData: {
      check: "Object",
      init: {},
      event: "changeMergedData",
      apply: "__populateTree"
    }
  },

  members: {
    __populateTree: function(value, old) {
      const model = this.__model = qx.data.marshal.Json.createModel(value, true);
      this.setModel(model);
    }
  }
});
