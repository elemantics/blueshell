# Blueshell.js #

> There's a reason it's called blueshell.  But that's not really important.

Blueshell.js is a powerful inheritance microlibrary for JavaScript.  It's geared mainly toward working with
prototypal inheritance but allows class-like construction as well.  Prototypes created with Blueshell are
even accessible in IE 8 (not tested in 7).

Note: Blueshell syntax is not like Java syntax.  It's much more in line with modern JS than traditional OO style.

Here's how it works:

## Installation ##

Blueshell can be installed anywhere and binds itself to the global object by default.  However, you can add it to
your object of choice by simply modifying the 'this' argument in the last line of the blueshell.js file.

## Creating Prototypes ##

For these examples, we'll assume Blueshell has attached itself to the global object.  Since you might be in the
browser, Node, or whatever, we'll call that object **global**.

So let's say you have an object full of methods that you want to use as a prototype for other objects.

```javascript

var personActions = {
    "sayName" : function () { return this.name },
    "sayAge"  : function () { return this.age }
};

```

You can bind objects to **personActions** and use it as a prototype by using Blueshell's **protoChain** function:

```javascript

var me = global.protoChain(personActions, {
    "name" : "John",
    "age"  : 28
});

var you = global.protoChain(personActions, {
    "name" : "Alex",
    "age"  : 94
});

```

Note:  Blueshell does NOT let you bind a prototype to an object that already exists.  **protoChain** returns a new object in every case.  It would be a very bad idea to attach and detach prototypes to objects willy nilly throughout the course of their lives.

Anyway, if you log either of these new objects to the console, you'll see that Blueshell has generated something
called a **QuantumObject**.  It's called this because there are some really cool quantum physics taking place here :)

```javascript

console.log(me);
/*
QuantumObject =>
{
    "name" : "John",
    "age"  : 28
}
*/

```

As we would expect, the **me** object only owns the properties we put into it.  However, because it is bound to
**personActions**, it can use them:

```javascript

me.sayName();
/*
returns => "John"
*/

you.sayAge();
/*
returns => 94
*/

```

And here's where it really gets cool.

Blueshell also gives each of your QuantumObjects access to a super-awesome utility for retrieving its prototype.

```javascript

me.getPrototype();
/*
Object =>
{
    "sayName" : [Function],
    "sayAge"  : [Function]
}
*/

```

But if **getPrototype** isn't in the prototype and it isn't one of the object's own properties, where is it??  Hint:  It's NOT in **Object.prototype** either.  It's something I like to call a quantum utility.  Blueshell lets you see those like this:

```javascript

me.getQuantumUtils();
/*
Object =>
{
    "getPrototype" : [Function],
    "getQuantumUtils" : [Function]
}
*/

```

Using **myObject.getPrototype** allows you to see prototypes in (possibly) any modern browser, including IE.  So once you have Blueshell installed, you won't want to use **Object.getPrototypeOf** because it will return the quantum utilities instead of the actual prototype object.  If you need a way to a see prototypes more functionally, Blueshell gives you this:

```javascript

global.getPrototype(me);
/*
Object =>
{
    "sayName" : [Function],
    "sayAge"  : [Function]
}
*/

```

## Creating Classes ##

You never need to use the word **new** when working with Blueshell inheritance.  All that is handled under the hood
for you.  Working with Blueshell classes feels much more like modern JS than traditional Java.

So let's say you've got a general person object:

```javascript

var person = {
    "eyes"   : 2,
    "gender" : "male",
    "isBald" : true
};

```

Now we want to build an instance of **person**.

```javascript

var kid = global.classChain(person);
/*
QuantumObject =>
{
    "eyes"   : 2,
    "gender" : "male",
    "isBald" : true
}
*/

```

Notice that **kid** is a QuantumObject.  This means it has access to the same quantum utilities that you would
get if you were creating a prototypal chain.  It also means you can use **getPrototype** to get its prototype.

Blueshell's class system takes prototypes into account.  If your parent object is bound to a prototype, your child
object will be bound to the same prototype.

You can also merge two parents together to create a child object - a process also known as including "mixins".

```javascript

var kid = global.classChain(person, {
    "name"   : "Sally",
    "gender" : "female",
    "isBald" : false
});
/*
QuantumObject =>
{
    "eyes"   : 2,
    "gender" : "female",
    "isBald" : false,
    "name"   : "Sally"
}
*/

```

Notice that when you include mixins, the mixins will override any of the same properties in the initial parent.