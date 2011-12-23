/*
Name: blueshell.js
Author: John Newman
Date: 11-11-11
Version: 1.6
License: MIT
Description: A JS microlibrary for inheritance.  Geared more toward working with Prototypes. Even works in IE.

Version 1.6 exports better to modules.

Usage:
BS.protoChain(prototypeObj, newObj);

If you want to create an object from a class, do it like this:
BS.classChain(parentObj, childObj);

Every object linked to an object created with protoChain() has access to a method called getPrototype() that 
returns its prototype. You should use this instead of Object.getPrototypeOf() because GPO is not available 
in all browsers and will not return the data you want in cases of objects created with protoChain().  Blueshell
also gives you a standard way to access an object's prototype that will work in most browsers (including IE as
long as the object was created using protoChain()): 
BS.getPrototype(obj) 

*/

(function (context) {

    'use strict';

    var version = '1.6', bs;

    // Utility for accessing prototypes
    function accessProto(obj) {
        var quantumproto;
        if (obj.getPrototype && typeof obj.getPrototype === 'function') {
            quantumproto = obj.getPrototype();
            if (Object.prototype.toString.call(quantumproto) === '[object Object]') {
                return quantumproto;
            }
        }
        if (!!Object.getPrototypeOf) {
            return Object.getPrototypeOf(obj);
        } else if (obj.__proto__) {
            return obj.__proto__;
        } else {
            return false;
        }
    }

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

    // Prototypal Closure Constructor
    // Define a function that binds a prototype object to a child object
    // Can't bind prototypes to objects that already exist.  They have to be new objects.
    // You shouldn't want to do something so crazy anyway.
    function Quantum(intendedPrototype, newSpecObj) {
        var Entanglement, quantumUtils, QuantumObject, middleObj;

        // Bind the intendedPrototype to a utilities Object of good prototypal utilities
        quantumUtils = {
            "getPrototype" : function () {
                return intendedPrototype;
            },
            "getQuantumUtils" : function () {
                return quantumUtils;
            }
        };
        Entanglement = function () {
            return construct(this, quantumUtils);
        };
        Entanglement.prototype = intendedPrototype;
        middleObj = new Entanglement();

        // Bind the newSpecObj to the middle obj to create a prototype chain
        QuantumObject = function () {
            return construct(this, newSpecObj);
        };
        QuantumObject.prototype = middleObj;

        // Run the constructor and return the result plus its prototype
        return new QuantumObject();
    }

    // Classical Closure Constructor
    // Define a function that copies a parent object to a child object.
    function Class(parentObj, newSpecObj) {
        construct(this, parentObj);
        if (newSpecObj) {
            return construct(this, newSpecObj);
        }
        return this;
    }

    // Define a function that creates a class and attaches the child to the prototype of the parent.
    function extension(parentObj, newSpecObj) {
        var me = new Class(parentObj, newSpecObj), proto = accessProto(parentObj);
        if (proto !== false || proto !== Object.prototype) {
            return new Quantum(proto, me);
        }
        return me;
    }

    bs = {

        // Grant access to the current blueshell version
        "version" : version,

        // Grant access to inheritance functions
        "getPrototype" : function (obj) {
            return accessProto(obj);
        },

        "protoChain" : function (proto, child) {
            return new Quantum(proto, child);
        },

        "classChain" : function (parent, child) {
            return extension(parent, child);
        }

    };

    // AMD
    if (context.define && typeof context.define === 'function' && context.define.amd) {
        context.define('blueshell', [], bs);
    // node
    } else if (context.module && context.module.exports) {
        context.module.exports = bs;
    // browser
    } else {
        // use string because of Google closure compiler ADVANCED_MODE
        context['BLUESHELL'] = context['BS'] = bs;
    }

}(this));