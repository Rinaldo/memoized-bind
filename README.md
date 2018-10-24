# memoized-bind
Minimal memoized bind function for React

`memoized-bind` produces results identical to [`Function.prototype.bind()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind), except it memoizes the results for future use. Calling `memoized-bind` repeatedly with the same arguments will always return the same bound function. This can be especially useful when passing functions as props to child components in React.

## Installation

```
npm install memoized-bind
```

## Usage

### `memoizedBind(context)`

Initializes an instance of `memoized-bind`.

Returns a `bind` function that is itself bound to the context passed to it.

### `bind(fn, [...args])`

The return value of `memoizedBind(context)`.

Returns a bound version of the passed in function where the `this` keyword is set to the context that `bind` was initialized with.

The results of `bind` are memoized. Calling bind repeatedly with the same arguments always returns the same bound function.

## Example

```js
import memoizedBind from 'memoized-bind'

const bind = memoizedBind()  // setting `this` to undefined

const multiply = (...nums) => nums.reduce((a, c) => a * c)

const boundMult = bind(multiply, 2, 3)  // Identical to multiply.bind(undefined, 2, 3)
const boundMult2 = bind(multiply, 2, 3)  // Returns the same function

const funcsStrictlyEqual = boundMult === boundMult2  // true

boundMult(7)  // 42
```

## React Example

```js
import React, { Component } from 'react'
import memoizedBind from 'memoized-bind'


class List extends Component {
  constructor(props) {
    super(props)
    this.state = {
      clicks: 0
    }
    this.bind = memoizedBind(this)  // sets the context of all subsequently bound functions to the component's `this`
  }

  handleItemClicked(item) {
    console.log(`${item.label} was clicked!`)
    this.setState(prevState => ({ clicks: prevState.clicks + 1 }))
  }

  render() {
    return (
      <ul>
        {this.props.items.map(item => (
          <li onClick={this.bind(this.handleItemClicked, item)} key={item.id}>{item.label}</li>
        ))}
      </ul>
    )
  }
}
```
## Why `memoized-bind`?

When dealing with arrays of items in React, you often want to be able to call a method when a given item is clicked or interacted with in some way. Many times you want to call a method of the component which is generating the items. The trick is getting a reference to the particular item you want. The two common ways of doing it are passing along the item's id to the child component, or using a an inline arrow function or bound function. The problem with passing id down to the child component and then back up to the parent is that it means your child component is dealing with the parent's concerns. It has more information than it should have and is more tightly tied to its parent than it should be. The problem with using an inline arrow function or bound function is that you create a new function instance on each render, causing unecessary rerenders when using `PureComponent` or `shouldComponentUpdate` and unecessary garbage collection.

`memoized-bind` solves this problem by allowing you to use bind functions inline, keeping component concerns separated and preventing unecessary rerenders and garbage collection.

## But why `memoized-bind` in particular?

There are a number of memoization libraries out there, but `memoized-bind` is ideal for use in React applications.

* It's designed to be used with the component lifecycle.
  * When an instance of `memoized-bind` is initialized in a component's constructor, it will only exist for as long as the the component exists, providing a simple solution to memory leaks.
* It's short and sweet.
  * The entire module is only 10 lines, 391 bytes uncompressed.
* It's fast.
  * `memoized-bind` is 7 times faster than `memoize-bind`. See this [jsPerf](https://jsperf.com/memoized-bind-vs-memoize-bind/)


## License

MIT

## Acknowledgements

[`memoize-bind`](https://github.com/timkendrick/memoize-bind)

[`pure-bind`](https://github.com/DzoQiEuoi/pure-bind)
