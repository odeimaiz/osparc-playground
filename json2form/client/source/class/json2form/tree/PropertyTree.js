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
        c.bindProperty("type", "type", null, item, id);
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
      model.addListener("changeBubble", e => {
        console.log(e.getData());
      }, this);
      this.setModel(model);
    }
  }
});
