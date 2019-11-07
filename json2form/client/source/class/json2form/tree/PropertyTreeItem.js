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
 * VirtualTreeItem used by Tree
 *
 * *Example*
 *
 * Here is a little example of how to use the widget.
 *
 * <pre class='javascript'>
 *   tree.setDelegate({
 *     createItem: () => new json2form.tree.PropertyTreeItem(),
 *     bindItem: (c, item, id) => {
 *       c.bindDefaultProperties(item, id);
 *     }
 *   });
 * </pre>
 */

qx.Class.define("json2form.tree.PropertyTreeItem", {
  extend: qx.ui.tree.VirtualTreeItem,

  construct: function() {
    this.base(arguments);
  },

  properties: {
    formEntry: {
      nullable: true,
      init: null,
      event: "changeProperty"
    }
  },

  members: {
    // overridden
    _addWidgets: function() {
      this.addSpacer(); // from VirtualTreeItem
      this.addOpenButton(); // from VirtualTreeItem

      if (this.getFormEntry() !== null) {
        this.addWidget(this.getFormEntry());
      }
    }
  }
});
