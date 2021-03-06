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
    });

    this.resetTree();

    this.setDelegate({
      createItem: () => new json2form.tree.PropertyTreeItem(),
      bindItem: (c, item, id) => {
        c.bindDefaultProperties(item, id);
        c.bindProperty("key", "key", null, item, id);
        c.bindProperty("ui_icon", "uiIcon", null, item, id);
        c.bindProperty("type", "type", null, item, id);
        c.bindProperty("readOnly", "readOnly", null, item, id);
        c.bindProperty("ui_widget", "uiWidget", null, item, id);
        c.bindProperty("minimum", "minimum", null, item, id);
        c.bindProperty("maximum", "maximum", null, item, id);
        c.bindProperty("items", "items", null, item, id);
        c.bindProperty("minItems", "minItems", null, item, id);
        c.bindProperty("maxItems", "maxItems", null, item, id);
        c.bindProperty("default", "default", null, item, id);
        this.__allItems.set(item.getKey(), item);
        if (item.hasFormEntry() && item.getFormEntry().key === item.getKey()) {
          return;
        }
        item.buildFormEntry();
        if (item.getKey() in this.__flatObj) {
          item.setValue(this.__flatObj[item.getKey()]);
          if (item.getKey().endsWith(".value")) {
            const unitKey = item.getKey().replace(".value", ".unit");
            if (unitKey in this.__flatObj) {
              item.setUnit(this.__flatObj[unitKey]);
            }
          }
        } else {
          c.bindProperty("value", "value", null, item, id);
          c.bindProperty("unit", "unit", null, item, id);
        }

        if (item.hasFormEntry()) {
          item.getFormEntry().bind("value", item, "value");
          item.addListener("changeValue", e => {
            if (e.getData() !== null) {
              this.__valueChanged(item.getKey(), e.getData());
            }
          });
        }
      }
    });
  },

  properties: {
    schema: {
      check: "Object",
      init: {},
      event: "changeSchema",
      apply: "__applySchema"
    },

    data: {
      check: "Object",
      init: {},
      event: "changeData",
      apply: "__applyData"
    }
  },

  events: {
    "dataChanged": "qx.event.type.Data"
  },

  members: {
    __flatObj: null,
    __openItems: null,
    __allItems: null,

    resetTree: function() {
      this.__flatObj = {};
      this.__openItems = new Set();
      this.__allItems = new Map();
    },

    __applySchema: function(value, old) {
      // if new is same as old, skip
      if (JSON.stringify(value) === JSON.stringify(old)) {
        return;
      }

      const model = this.__model = qx.data.marshal.Json.createModel(value, true);
      this.setModel(model);

      this.__addOpenCloseListeners();
      this.__openFirstLevel();
      this.__reopenItems();
    },

    __applyData: function(value, old) {
      // if new is same as old, skip
      if (JSON.stringify(value) === JSON.stringify(old)) {
        return;
      }

      const flatObj = this.__flatObj = json2form.DataUtils.formData2FlatObj(value);
      for (const key in flatObj) {
        if (key.endsWith(".unit")) {
          const fieldKey = key.replace(".unit", ".value");
          if (this.__allItems.has(fieldKey)) {
            this.__allItems.get(fieldKey).setUnit(flatObj[key]);
          }
        } else {
          if (this.__allItems.has(key)) {
            this.__allItems.get(key).setValue(flatObj[key]);
          }
        }
      }
    },

    __valueChanged: function(key, value) {
      const data = {};
      data[key] = value;
      if (key in this.__flatObj) {
        // if (this.__flatObj[key] !== value) {
        if (JSON.stringify(this.__flatObj[key]) !== JSON.stringify(value)) {
          this.__flatObj[key] = value;
          this.fireDataEvent("dataChanged", data);
        }
      } else {
        this.__flatObj[key] = value;
        this.fireDataEvent("dataChanged", data);
      }
    },

    __addOpenCloseListeners: function() {
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
    },

    __openFirstLevel: function() {
      // Open first levels by default
      const props = this.getModel().getProperties();
      for (let i=0; i<props.length; i++) {
        this.openNode(props.getItem(i));
      }
    },

    __reopenItems: function() {
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
      const nodes = allItems.filter((item) => {
        return ("getProperties" in item);
      });
      return nodes;
    },

    getLeaves: function() {
      const allItems = this.getAllItems();
      const nodes = allItems.filter((item) => {
        return !("getProperties" in item);
      });
      return nodes;
    },

    getLeaf: function(key) {
      const leaves = this.getLeaves();
      const leaf = leaves.find((item) => {
        return item.getKey() === key;
      });
      return leaf;
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
