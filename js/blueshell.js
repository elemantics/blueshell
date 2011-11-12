/*
Name: blueshell.js
Author: John Newman
Date: 11-11-11
Version: 1.0
License: MIT
Description: A JS microlibrary for inheritance.  Based on the model used in the 
Sparrow programming language (still in development).

Usage:
If you want to create an object from a prototype, do it like this:
entangle(prototypeObj, newObj);

If you want to create an object from a class, do it like this:
extend(parentObj, childObj);

*/

(function (w) {

    'use strict';

    var version = '1.0';

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
    function Quantum(parentObj, newSpecObj) {
        var Entanglement = function () {
            return construct(this, newSpecObj);
        };
        Entanglement.prototype = parentObj;
        return new Entanglement(newSpecObj);
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
    function extend(parentObj, newSpecObj) {
        var me = new Class(parentObj, newSpecObj),
            proto = Object.getPrototypeOf(parentObj);
        if (proto !== Object.prototype) {
            return new Quantum(proto, me);
        }
        return me;
    }

    // Grant access to the current blueshell version
    w.blueshellVersion = w.blueshellVersion || version;

    // Grant access to global inheritance functions
    w.entangle = w.entangle || function (proto, child) {
        return new Quantum(proto, child);
    };
    w.extend = w.extend || function (parent, child) {
        return extend(parent, child);
    };

    return true;

}(window));


