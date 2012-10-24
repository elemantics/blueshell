# Blueshell.js #

> A simple, clean, straightforward and powerful inheritance engine for all JS environments.

Version 2.0 contains:
- No more BS joke :)
- "Infinitely" chainable prototypes that are super easy to make
- A simpler, smarter, stricter interface
- Prototypes accessible in EVERY JS environment including IE

Blueshell.js is a powerful inheritance microlibrary for JavaScript.  It's also an experiment
into doing inheritance a little differently than you might have seen before.

Blueshell is uniquely suited to dealing with
classical inheritance and prototypal inheritance alike.  Prototypes created with BlueShell are
even accessible in IE 8 (not tested in 7) and, of course, it passes JSLint.

**Note: BlueShell syntax is not like Java syntax. You won't need any `new` anything.**

Here's how it works:

## Installation ##

BlueShell can be installed anywhere and binds a namespace called `BlueShell` or `B` to the global object
by default.  In the browser, just include the JS file.  Anywhere else, just do what you'd normally do.

## Usage ##

First and foremost, any objects you intend to touch directly or indirectly with BlueShell need to
be created using BlueShell.  If you ignore this rule, you won't get seamless, retrievable prototypes.

To create an object, use `BlueShell.hatch`.  Remember that `B` can be used as a shortcut for "BlueShell".

```javascript
var person = B.hatch({
    name: 'john',
    age: 28
});
```

Doing this engages the background work that makes retrieving prototypes possible.  Your result is an
instance of `B.ClassChain` and looks something like this:

```javascript
// B.ClassChain =>
{
    name: 'john',
    age: 28,
    __proto__: Object {
        isClassChain: true,
        getProto: [FUNCTION],
        protoRef: 'B-1342644884033-1000001-bbbXbQ2x9K56V7wcLBB29NBdm'
    }
}
```

Notice that `B.hatch` will give your object a universally unique prototypal `protoRef` property.  This
reference is necessary for BlueShell's advanced prototypal inheritance and is the reason you need to
create all of your objects with `B.hatch`.

### Classical Inheritance ###

If you want to create a new object that classically inherits properties from another object, you can use 
`B.hatch` for this as well.  In this use case, you have the option of passing in up to three arguments.

```javascript
var person = B.hatch({
    name: 'john',
    age: 28
});

var kid = B.hatch(person, B.hatch({
    age: 42,
    hair: 'brown'
}));

kid;
// B.ClassChain =>
{
    name: 'john',
    age: 42,
    hair: 'brown',
    __proto__: Object {
        isClassChain: true,
        getProto: [FUNCTION],
        protoRef: 'B-1342645295780-1000004-MYpaly2PKxpPPzM6sWN0hUJ96'
    }
}
```

When using `.hatch` in this way, your first argument constitutes the object to be used as a parent
and the second argument constitutes an object full of mixins and overrides.

If it so happens that your parent object has been attached to a prototype via BlueShell, your new child
object will be bound to the same prototype unless you explicitly tell BlueShell not to do this.  You can
state this explicitly by passing in the value `false` as a third argument to `.hatch`.

### Prototypal Inheritance ###

Binding objects to prototypes with BlueShell is much easier than in native JavaScript.  Let's say you
have an object you want to use as a prototype:

```javascript
var personActions = B.hatch({
    getName: function () { return this.name; },
    getAge: function () { return this.age; }
});
```

You can create a new object using `personActions` as its prototype with the method `BlueShell.bindProto`:

```javascript
var person = B.bindProto(personActions, B.hatch({
    name: 'john',
    age: 28
}));

person.getName();
// => 'john'

person.getAge();
// => 28

person;
// B.ClassChain =>
{
    name: 'john',
    age: 28,

    __proto__: B.ChainLink {
        protoRef: 'B-1342706794368-1000008-1WZVGxUT3dSxdrS6wlYgFOCcD',

        __proto__: B.ClassChain {
            getName: function () { return this.name; },
            getAge: function () { return this.age; },

            __proto__: Object {
                getProto: [FUNCTION],
                protoRef: 'B-1342645295780-1000004-MYpaly2PKxpPPzM6sWN0hUJ96'
            }
        }
    }
}
```

Once you have created an object with an attached prototype, you can actually use your new object as the
prototype for another object.  Feel free to nest your prototypes as deep as you like.

```javascript
var child = B.bindProto(person, B.hatch({
    hair: 'brown';
}));

child;
// B.ClassChain =>
{
    hair: 'brown',

    __proto__: B.ChainLink {
        protoRef: 'B-1342706790790-1000003-7NBHANoQGn5MNELQ4yb5pkWMb',

        __proto__: B.ClassChain {
            name: 'john',
            age: 28,

            __proto__: B.ChainLink {
                protoRef: 'B-1342706794368-1000008-1WZVGxUT3dSxdrS6wlYgFOCcD',

                __proto__: B.ClassChain {
                    getName: function () { return this.name; },
                    getAge: function () { return this.age; },

                    __proto__: Object {
                        getProto: [FUNCTION],
                        protoRef: 'B-1342645295780-1000004-MYpaly2PKxpPPzM6sWN0hUJ96'
                    }
                }
            }
        }
    }
}
```

Then, of course, if you modify a prototype, the change propagates to the children:

```javascript
personActions.getHair = function () { return this.hair; };

child;
// B.ClassChain =>
{
    hair: 'brown',

    __proto__: B.ChainLink {
        protoRef: 'B-1342706790790-1000003-7NBHANoQGn5MNELQ4yb5pkWMb',

        __proto__: B.ClassChain {
            name: 'john',
            age: 28,

            __proto__: B.ChainLink {
                protoRef: 'B-1342706794368-1000008-1WZVGxUT3dSxdrS6wlYgFOCcD',

                __proto__: B.ClassChain {
                    getName: function () { return this.name; },
                    getAge: function () { return this.age; },
                    getHair: function () { return this.hair; },

                    __proto__: Object {
                        getProto: [FUNCTION],
                        protoRef: 'B-1342645295780-1000004-MYpaly2PKxpPPzM6sWN0hUJ96'
                    }
                }
            }
        }
    }
}

child.getHair();
// => 'brown'
```

The instances of `B.ChainLink` are part of what makes the prototypes cross-environment compatible.
In practice, you can pretend they don't even exist.  When you want to retrieve an object's prototype,
just invoke `someObject.getProto()` and it will return the most immediate prototype attached to an object
disregarding the chain links.

```javascript
child.getProto();
// B.ClassChain =>
{
    name: 'john',
    age: 28,

    __proto__: B.ChainLink {
        protoRef: 'B-1342706794368-1000008-1WZVGxUT3dSxdrS6wlYgFOCcD',

        __proto__: B.ClassChain {
            getName: function () { return this.name; },
            getAge: function () { return this.age; },
            getHair: function () { return this.hair; },

            __proto__: Object {
                getProto: [FUNCTION],
                protoRef: 'B-1342645295780-1000004-MYpaly2PKxpPPzM6sWN0hUJ96'
            }
        }
    }
|
```
