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

    this.__openItems = new Set();

    this.setDelegate({
      createItem: () => new json2form.tree.PropertyTreeItem(),
      bindItem: (c, item, id) => {
        c.bindDefaultProperties(item, id);
        c.bindProperty("key", "key", null, item, id);
        c.bindProperty("ui_icon", "uiIcon", null, item, id);
        c.bindProperty("type", "type", null, item, id);
        c.bindProperty("readOnly", "readOnly", null, item, id);
        c.bindProperty("ui_widget", "uiWidget", null, item, id);
        c.bindProperty("items", "items", null, item, id);
        c.bindProperty("minItems", "minItems", null, item, id);
        c.bindProperty("maxItems", "maxItems", null, item, id);
        c.bindProperty("default", "default", null, item, id);
        item.buildFormEntry();
        if (item.hasFormEntry()) {
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
    __openItems: null,

    __populateTree: function(value, old) {
      // if new is same as old, skip
      if (JSON.stringify(value) === JSON.stringify(old)) {
        return;
      }

      const model = this.__model = qx.data.marshal.Json.createModel(value, true);
      this.setModel(model);

      if (!this.hasListener("open")) {
        this.addListener("open", e => {
          const item = e.getData();
          this.__openItems.add(item.getKey());
        }, this);
      }
      if (!this.hasListener("close")) {
        this.addListener("close", e => {
          const item = e.getData();
          this.__openItems.delete(item.getKey());
        }, this);
      }

      // Open first levels by default
      const props = this.getModel().getProperties();
      for (let i=0; i<props.length; i++) {
        this.openNode(props.getItem(i));
      }

      const onlyNodes = this.getNodes();
      this.__openItems.forEach(openItem => {
        const nodeFound = onlyNodes.find(node => node.getKey() === openItem);
        if (nodeFound) {
          this.openNode(nodeFound);
        }
      });
    },

    getAllItems: function() {
      return this.__getAllItems(this.getModel());
    },

    getNodes: function() {
      const allItems = this.getAllItems();
      const nodes = allItems.filter(function(item) {
        return ("getProperties" in item);
      });
      return nodes;
    },

    getLeaves: function() {
      const allItems = this.getAllItems();
      const nodes = allItems.filter(function(item) {
        return !("getProperties" in item);
      });
      return nodes;
    },

    __getAllItems: function(node) {
      let nodes = [];
      nodes.push(node);
      if ("getProperties" in node) {
        const props = node.getProperties();
        for (let i=0; i<props.length; i++) {
          const prop = props.getItem(i);
          nodes.push(prop);
          if ("getProperties" in prop) {
            nodes = nodes.concat(this.__getAllItems(prop));
          }
        }
      }
      return nodes;
    }
  }
});
