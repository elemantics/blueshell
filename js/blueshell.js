
// HOW TO IMPLEMENT ALL COLLECTIONS AS HASH TABLES:

// Concepts:

// 1. The Sparrow user gets 2 collections: an object literal and an array
// 2. The JS array sucks so it would be nice if the Sparrow array could compile to a JS object literal.
//    That would make the Sparrow array just as efficient as the Sparrow object literal.
//    The compiled Sparrow array would look something like this:
//    var name = {
//        "0" : "John",
//        "1" : "Gavin",
//        "2" : "Newman"
//    }
// 3. Now the Sparrow programmer can access an item by position in his array but the compiled code is
//    really just asking for a key in a hash table.  Much more efficient.
// 4. Given that compiling an object literal to an object literal is no big deal, we can forget about
//    that for now and focus on how to compile the Sparrow array to a JS object literal.
// 5. Our main issue is how to keep a count of items in the compiled object literal because JS does
//    not natively do this and it is necessary for the Sparrow array to have this ability.
// 6. Proposed solution:  Any time you create a Sparrow array (JS object literal), it is linked
//    prototypally with an object that contains meta-data about the "array" and can keep
//    a running count of items in the "array" in particular.  There will also be a globally availabe
//    collection of functions for manipulating the array.



// You will need a special addKey and removeKey function in order to manipulate a count (length) property.

// Step 1: Make sure Sparrow's inheritance model is already in place.
var SPRW = SPRW || {};

SPRW.inherit = (function () {
	'use strict';

	function construct(scope, obj) {
		var i;
		for (i in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, i)) {
				scope[i] = obj[i];
			}
		}
		return scope;
	}
	
	// Prototypal ->
	function Quantum(parentObj, newSpecObj) {
		var Entanglement = function () {
			return construct(this, newSpecObj);
		};
		Entanglement.prototype = parentObj;
		return new Entanglement(newSpecObj);
	}
	
	// Classical ->
	function Class(parentObj, newSpecObj) {
		construct(this, parentObj);
		if (newSpecObj) {
			return construct(this, newSpecObj);
		}
		return this;
	}
	
	// Global Inheritance Object ->
	return {
		// Takes two objects.
		// parentObj is the object that will constitute the prototype of the new object.
		// newSpecObj should contain any properties specific to the new object and any desired classical mixins.
		// In this model, making a change to parentObj will cause that change to be reflected in the children as well.
		"fromProto" : function (parentObj, newSpecObj) {
			return new Quantum(parentObj, newSpecObj);
		},
		
		// Takes two objects.
		// parentObj is the object that will be considered a class and copied entirely to the new object.
		// newSpecObj should contain any overriding or specific properties. This is also where mixins are included.
		// If the parent object also has a prototype, that prototype will be given to the new object as well.
		"fromClass" : function (parentObj, newSpecObj) {
			var me = new Class(parentObj, newSpecObj),
				proto = Object.getPrototypeOf(parentObj);
			if (proto !== Object.prototype) {
				return this.fromProto(proto, me);
			}
			return me;
		},
		
		// Creates new objects from a useable prototype containing a count property
		"createMap" : function (newSpecObj) {
			return this.fromProto({
				"count" : (function() {
					var accum = 0, i;
					for (i in newSpecObj) {
						accum += 1;
					}
					return accum;
				}())
			}, newSpecObj);
		},
		
		// Used to add or manipulate properties in an object
		"set" : function (obj, prop, val) {
			if (!obj[prop]) {
				Object.getPrototypeOf(newObj).count += 1
			}
			obj[prop] = val;
		},
		
		// Used to remove a property from an object
		"remove" : function (obj, prop) {
			if (obj[prop]) {
				delete obj[prop];
				Object.getPrototypeOf(obj).count -= 1;
			}
		}
	};

}());


/*
// Step 2: Any time you create a new object, do it like this:
var newObj = SPRW.inherit.createMap({name:'john'});

// Step 3: Any time you manipulate an object, do it like this:
SPRW.inherit.set(newObj, 'age', 28);
SPRW.inherit.remove(newObj, 'age');

// Step 4: If you want to create an object from a prototype, do it like this:
SPRW.inherit.fromProto(parentObj, newPropObj);

// Step 5: If you want to create an object from a class, do it like this:
SPRW.inherit.fromClass(parentObj, newPropObj);
*/

