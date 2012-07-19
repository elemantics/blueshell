/*
Name: blueshell.js
Author: John Newman
Date: 7-18-12
Version: 2.0
License: MIT
Description: A JS microlibrary for inheritance.  Geared more toward seamless integration with prototypes. Even works in IE.

Version 2 contains:
    - No more BS joke :)
    - Less looping
    - "Infinitely" chainable prototypes that are super easy to make
    - A simpler, stricter interface
    - Prototypes accessible in EVERY JS environment including old versions of IE

Usage:
Any time you create an object, do it with BlueShell.hatch:

    var person = B.hatch({name: 'john', age: 28})

If you ignore the previous rule, you will not get seamless prototypes that work
in a cross-browser capacity.

Any time you want to extend an object, also do it with BlueShell.hatch:

    var kid = B.hatch(parent, B.hatch({name: 'bill', eyes: 'brown'}))

A second argument will contain mixins and overrides.

Any time you want to create a new object bound to a prototype, do it with BlueShell.bindProto:

    var parent = B.hatch({
        "getName" : function () {return this.name;}
        "getAge"  : function () {return this.age;}
    });
    var kid = B.bindProto(parent, B.hatch({name: 'john', age: 28}));

Objects created with BlueShell.bindProto undergo the same special treatment as objects created
with BlueShell.hatch so they can be used in all the same ways, including as prototypes
for other new objects.

All prototypes attached with BlueShell can be retrieved in any JS environment.  Each Object
created with BlueShell has access to a prototypal "getProto" function that returns its
prototype:

  myObject.getProto();
  => {...whatever the prototype is...}
*/

(function (context) {
    'use strict';

    var version = '2.0',
        idIncrementor = 1000000, // used by uid()
        protoRefs = {}, // holds references to prototypes to make them cross-retrievable
        exports = {}; // will contain exported methods

    // Define a function that will add properties from one object to another
    function construct(scope, obj) {
        var i;
        for (i in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, i)) {
                scope[i] = obj[i];
            }
        }
        return scope;
    }

    // Generates a univerasally unique identifier in 4 steps
    // 1. Begin with 'B-' to indicate blueshell
    // 2. Add a timestamp
    // 3. Add an incrementor with 8,999,999 subsequent values
    // 4. Add a random 25 char string
    function uid() {
        var newStr = "B-", i, chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz";
        newStr += (new Date()).getTime();
        idIncrementor += 1;
        newStr += ("-" + idIncrementor + "-");
        if (idIncrementor === 9999999) {
            idIncrementor = 1000000;
        }
        for (i = 0; i < 25; i += 1) {
            newStr += chars[Math.floor(Math.random() * chars.length)];
        }
        return newStr;
    }

    // The constructor for classical inheritance
    function Class(parent, child, copyProto) {
        var B = {}, newId = uid(), middleChild, middleBinding;

        // This actually does the construction.
        // Call it B.ClassChain for instance naming consistency.
        // It is defined within the Class function because its prototype
        // is subject to change depending on what the user is trying to do
        // thus we need to generate a new instance of this every time we call new Class().
        B.ClassChain = function (parent, child) {
            construct(this, parent);
            if (child) {
                return construct(this, child);
            }
            return this;
        };

        // If the parent was created with blueshell we want the child to inherit the parent's
        // prototype unless the user tells us not to.
        if (parent.isClassChain && !Object.prototype.hasOwnProperty.call(parent, 'isClassChain') && copyProto !== false) {

            // In order to make prototypes retrievable, we have to override the protoRef
            // property.  We do that by adding an object between the prototype and the child
            // that contains the override.
            B.ChainLink = function (newSpec) {
                construct(this, newSpec);
            };
            middleChild = {
                "protoRef" : uid()
            };

            // Create a reference to the prototype to make it retrievable.
            protoRefs[middleChild.protoRef] = parent.getProto();

            // Attach the prototype chain to the middle object and run the constructor.
            B.ChainLink.prototype = parent.getProto();
            middleBinding = new B.ChainLink(middleChild);

            // Lastly attach the expanded prototype to the constructor and build the new object.
            B.ClassChain.prototype = middleBinding;
            return new B.ClassChain(parent, child);

        // In the case that we do not want the child to inherit the parent's prototype...
        } else {

            // We generate the default prototype object, attach it to the constructor,
            // and build the new object.
            B.ClassChain.prototype = {
                "isClassChain" : true,
                "protoRef"     : newId,
                "getProto"     : function () {
                    var proto = protoRefs[this.protoRef];
                    return (!proto) ? Object.prototype : proto;
                }
            };
            return new B.ClassChain(parent, child);
        }
    }

    // The constructor for prototypal inheritance
    function Proto(proto, child) {
        var B = {}, middleChild, middleBinding;

        // This does the actual object building.
        // Just like in the Class function, we name it B.ClassChain for instance naming consistency.
        // Also like in the Class function, it has to be generated anew upon every instance
        // of Proto being called because the prototype we attach to it is subject to change.
        B.ClassChain = function (newSpec) {
            construct(this, newSpec);
        };

        // If the prototypal parent was created with blueshell, we want to nest prototypes.
        if (proto.isClassChain && !Object.prototype.hasOwnProperty.call(proto, 'isClassChain')) {

            // In order to make prototypes retrievable, we have to override the protoRef
            // property.  We do that by adding an object between the prototype and the child
            // that contains the override.
            B.ChainLink = function (newSpec) {
                construct(this, newSpec);
            };
            middleChild = {
                "protoRef" : uid()
            };

            // Create a reference to the prototype to make it retrievable.
            protoRefs[middleChild.protoRef] = proto;

            // Attach the prototype to the middle object constructor and run it.
            B.ChainLink.prototype = proto;
            middleBinding = new B.ChainLink(middleChild);

            // Lastly, attach the middle object to the main constructor as a prototype and run it.
            B.ClassChain.prototype = middleBinding;
            return new B.ClassChain(child);

        // If there is currently no prototype chain, begin one using proto as the original prototype.
        } else {

            // Create a reference to the prototype to make it retrievable.
            protoRefs[child.protoRef] = proto;

            // Attach the prototype to the constructor and build the object.
            B.ClassChain.prototype = proto;
            return new B.ClassChain(child);
        }
    }

    // Populate exports.
    exports.version = version;
    exports.bindProto = function (proto, child) {
        return new Proto(proto, child);
    };
    exports.hatch = function (parent, child, copyProto) {
        return new Class(parent, child, copyProto);
    };

    // Add various export wrappers.
    // AMD
    if (context.define && typeof context.define === 'function' && context.define.amd) {
        context.define('B', [], exports);
    // weird stuff
    } else if (context.module && context.module.exports) {
        context.module.exports = exports;
    // node and browser
    } else {
        context.BlueShell = context.B = exports;
    }

}(this));


