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
        "$id": "https://osparc.io/schemas/data-schema.json",
        "$schema": "http://json-schema.org/draft-07/schema#",
        "title": "Selected Entity Properties",
        "description": "A form for entities",
        "type": "object",
        "required": [
          "name"
        ],
        "properties": {
          "name": {
            "type": "string"
          },
          "visible": {
            "type": "boolean",
            "default": true
          },
          "color": {
            "type": "array",
            "items": {
              "type": "integer",
              "minimum": 0,
              "maximum": 256
            },
            "minItems": 3,
            "maxItems": 3
          },
          "opacity": {
            "type": "number",
            "minimum": 0,
            "maximum": 100
          },
          "transformation": {
            "title": "Transformation",
            "type": "object",
            "properties": {
              "rotation": {
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
                    "type": "string"
                  }
                },
                "required": [
                  "value"
                ]
              },
              "translation": {
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
                    "type": "string"
                  }
                },
                "required": [
                  "value"
                ]
              }
            }
          },
          "parameters": {
            "type": "object",
            "title": "Parameters",
            "properties": {
            "radius": {
              "type": "object",
              "properties": {
                "value": {
                  "type": "number"
                },
                "unit": {
                  "type": "string"
                }
              },
              "required": [
                "value"
              ]
            },
            "height": {
              "type": "object",
              "properties": {
                "value": {
                  "type": "number"
                },
                "unit": {
                  "type": "string"
                }
              },
              "required": [
                "value"
              ]
            },
            "centered": {
              "type": "boolean",
              "default": false
            }
          }
        },
        "materials": {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
        }
      });
    },

    fakeUiSchema: function() {
      return json2form.DataUtils.stringify({
        "name": {
          "ui:widget": "textarea",
          "ui:autofocus": true
        },
        "visible": {
          "ui:icon": "https://img.icons8.com/ios/50/000000/visible.png"
        },
        "color": {
          "ui:widget": "colorpicker"
        },
        "opacity": {
          "ui:widget": "range"
        },
        "transformation": {
          "rotation": {
            "value": {
              "ui:widget": "field"
            },
            "unit": {
              "ui:widget": "field"
            }
          },
          "translation": {
            "ui:widget": "quantity3"
          }
        },
        "parameters": {
          "radius": {
            "ui:widget": "quantity"
          },
          "height": {
            "ui:widget": "quantity"
          },
          "centered": {
            "ui:widget": "radio"
          }
        }
      });
    },

    fakeFormData: function() {
      return json2form.DataUtils.stringify({
        "name": "Red Cylinder",
        "visible": true,
        "color": [
          248,
          6,
          143
        ],
        "opacity": 100,
        "transformation": {
          "rotation": {
            "value": [
              0,
              0,
              0
            ],
            "unit": "deg"
          },
          "translation": {
            "value": [
              100,
              0,
              0
            ],
            "unit": "mm"
          }
        },
        "parameters": {
          "radius": {
            "value": 19.1055,
            "unit": "mm"
          },
          "height": {
            "value": 43,
            "unit": "mm"
          },
          "centered": false
        },
        "materials": []
      });
    },

    fakeJsonSchema2: function() {
      return json2form.DataUtils.stringify({
        "title": "A registration form",
        "description": "A simple form example.",
        "type": "object",
        "required": [
          "firstName",
          "lastName"
        ],
        "properties": {
          "firstName": {
            "type": "string",
            "title": "First name",
            "default": "Chuck"
          },
          "lastName": {
            "type": "string",
            "title": "Last name"
          },
          "age": {
            "type": "integer",
            "title": "Age"
          },
          "bio": {
            "type": "string",
            "title": "Bio"
          },
          "password": {
            "type": "string",
            "title": "Password",
            "minLength": 3
          },
          "telephone": {
            "type": "string",
            "title": "Telephone",
            "minLength": 10
          }
        }
      });
    },

    fakeUiSchema2: function() {
      return json2form.DataUtils.stringify({
        "firstName": {
          "ui:autofocus": true,
          "ui:emptyValue": ""
        },
        "age": {
          "ui:widget": "updown",
          "ui:title": "Age of person",
          "ui:description": "(earthian year)"
        },
        "bio": {
          "ui:widget": "textarea"
        },
        "password": {
          "ui:widget": "password",
          "ui:help": "Hint: Make it strong!"
        },
        "date": {
          "ui:widget": "alt-datetime"
        },
        "telephone": {
          "ui:options": {
            "inputType": "tel"
          }
        }
      });
    },

    fakeFormData2: function() {
      return json2form.DataUtils.stringify({
        "firstName": "Chuck",
        "lastName": "Norris",
        "age": 75,
        "bio": "Roundhouse kicking asses since 1940",
        "password": "noneed"
      });
    }
  }
});