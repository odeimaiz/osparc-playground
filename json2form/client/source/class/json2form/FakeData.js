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


qx.Class.define("json2form.FakeData", {
  type: "static",

  statics: {
    fakeJsonSchema: function() {
      return json2form.DataUtils.stringify({
        "Block 1": {
          "title": "Block 1",
          "readOnly": false,
          "type": "object",
          "properties": {
            "Name": {
              "title": "Name",
              "readOnly": false,
              "type": "string"
            },
            "Visible": {
              "title": "Visible",
              "readOnly": false,
              "type": "boolean",
              "default": false
            },
            "Color": {
              "title": "Color",
              "readOnly": false,
              "type": "array",
              "items": {
                "type": "number",
                "minimum": 0,
                "maximum": 1
              },
              "minItems": 4,
              "maxItems": 4
            },
            "Opacity": {
              "title": "Opacity",
              "readOnly": false,
              "type": "object",
              "properties": {
                "value": {
                  "type": "number",
                  "minimum": 0,
                  "maximum": 100
                },
                "unit": {
                  "type": "string",
                  "default": null
                }
              },
              "required": [
                "value"
              ]
            },
            "Transformation": {
              "readOnly": false,
              "type": "object",
              "properties": {
                "Scaling": {
                  "title": "Scaling",
                  "readOnly": false,
                  "type": "object",
                  "properties": {
                    "value": {
                      "type": "array",
                      "items": {
                        "type": "number"
                      },
                      "minItems": 3,
                      "maxItems": 3
                    },
                    "unit": {
                      "type": "string",
                      "default": null
                    }
                  },
                  "required": [
                    "value"
                  ]
                },
                "Rotation": {
                  "title": "Rotation",
                  "description": "Euler angles",
                  "readOnly": false,
                  "type": "object",
                  "properties": {
                    "value": {
                      "type": "array",
                      "items": {
                        "type": "number"
                      },
                      "minItems": 3,
                      "maxItems": 3
                    },
                    "unit": {
                      "type": "string",
                      "default": null
                    }
                  },
                  "required": [
                    "value"
                  ]
                },
                "Translation": {
                  "title": "Translation",
                  "description": "x, y, z",
                  "readOnly": false,
                  "type": "object",
                  "properties": {
                    "value": {
                      "type": "array",
                      "items": {
                        "type": "number"
                      },
                      "minItems": 3,
                      "maxItems": 3
                    },
                    "unit": {
                      "type": "string",
                      "default": null
                    }
                  },
                  "required": [
                    "value"
                  ]
                }
              }
            },
            "Parameters": {
              "title": "Block",
              "readOnly": false,
              "type": "object",
              "properties": {
                "SizeX": {
                  "title": "Size X",
                  "readOnly": false,
                  "type": "object",
                  "properties": {
                    "value": {
                      "type": "number",
                      "minimum": -1.7976931348623157e+308,
                      "maximum": 1.7976931348623157e+308
                    },
                    "unit": {
                      "type": "string",
                      "default": null
                    }
                  },
                  "required": [
                    "value"
                  ]
                },
                "SizeY": {
                  "title": "Size Y",
                  "readOnly": false,
                  "type": "object",
                  "properties": {
                    "value": {
                      "type": "number",
                      "minimum": -1.7976931348623157e+308,
                      "maximum": 1.7976931348623157e+308
                    },
                    "unit": {
                      "type": "string",
                      "default": null
                    }
                  },
                  "required": [
                    "value"
                  ]
                },
                "SizeZ": {
                  "title": "Size Z",
                  "readOnly": false,
                  "type": "object",
                  "properties": {
                    "value": {
                      "type": "number",
                      "minimum": -1.7976931348623157e+308,
                      "maximum": 1.7976931348623157e+308
                    },
                    "unit": {
                      "type": "string",
                      "default": null
                    }
                  },
                  "required": [
                    "value"
                  ]
                },
                "Centered": {
                  "title": "Centered",
                  "readOnly": false,
                  "type": "boolean",
                  "default": false
                }
              }
            },
            "Material": {
              "title": "Material",
              "readOnly": false,
              "type": "object",
              "properties": {
                "Assign": {
                  "title": "Material Name",
                  "readOnly": false,
                  "type": "unknown"
                }
              }
            }
          }
        }
      });
    },

    fakeUiSchema: function() {
      return json2form.DataUtils.stringify({
        "Block 1": {
          "Name": {
            "ui:widget": "textarea"
          },
          "Visible": {
            "ui:icon": "icons/XModelerUI/visibility.ico",
            "ui:widget": "checkbox"
          },
          "Color": {
            "ui:widget": "colorpicker"
          },
          "Opacity": {
            "ui:widget": "range"
          },
          "Transformation": {
            "Scaling": {
              "ui:widget": "quantity3"
            },
            "Rotation": {
              "ui:widget": "quantity3"
            },
            "Translation": {
              "ui:widget": "quantity3"
            }
          },
          "Parameters": {
            "ui:icon": "icons/XModelerUI/create_solidblock.ico",
            "SizeX": {
              "ui:widget": "quantity"
            },
            "SizeY": {
              "ui:widget": "quantity"
            },
            "SizeZ": {
              "ui:widget": "quantity"
            },
            "Centered": {
              "ui:widget": "checkbox"
            }
          },
          "Material": {
            "Assign": {}
          }
        }
      });
    },

    fakeFormData: function() {
      return json2form.DataUtils.stringify({
        "Block 1": {
          "Name": "Block 1",
          "Visible": true,
          "Color": [
            0.9725490808486938,
            0.02352941408753395,
            0.5607843399047852,
            1
          ],
          "Opacity": {
            "value": 100,
            "unit": ""
          },
          "Transformation": {
            "Scaling": {
              "value": [
                1,
                1,
                1
              ],
              "unit": ""
            },
            "Rotation": {
              "value": [
                0,
                0,
                0
              ],
              "unit": "deg"
            },
            "Translation": {
              "value": [
                -52,
                46,
                0
              ],
              "unit": "mm"
            }
          },
          "Parameters": {
            "SizeX": {
              "value": 33,
              "unit": "mm"
            },
            "SizeY": {
              "value": -30,
              "unit": "mm"
            },
            "SizeZ": {
              "value": 38,
              "unit": "mm"
            },
            "Centered": false
          },
          "Material": {
            "Assign": {}
          }
        }
      });
    }
  }
});