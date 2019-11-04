/* ************************************************************************

   osparc - the simcore frontend

   https://osparc.io

   Copyright:
     2019 IT'IS Foundation, https://itis.swiss

   License:
     MIT: https://opensource.org/licenses/MIT

   Authors:
     * Odei Maiz (odeimaiz)

************************************************************************ */

/**
 * A Button with low optical impact presenting as a simple weblink
 *
 * *Example*
 *
 * Here is a little example of how to use the widget.
 *
 * <pre class='javascript'>
 *   const link = new json2form.LinkLabel(this.tr("oSparc"),"https://osparc.io");
 *   this.getRoot().add(link);
 * </pre>
 */

qx.Class.define("json2form.LinkButton", {
  extend: qx.ui.form.Button,

  /**
    * @param label {String} Label to use
    * @param url {String} Url to point to
    * @param height {Integer?12} Height of the link icon
  */
  construct: function(label, url) {
    this.base(arguments, label);

    this.set({
      allowGrowX: false
    });

    if (url) {
      this.addListener("execute", () => {
        window.open(url);
      }, this);
    }
  }
});
