module.exports = function memoizedBind(context) {
  const tree = new Map()
  return function bind(fn, ...args) {
    let level = tree.get(fn) || tree.set(fn, new Map()).get(fn)
    for (let i = 0, len = args.length; i < len; i++) {
      level = level.get(args[i]) || level.set(args[i], new Map()).get(args[i])
    }
    return level.bound || (level.bound = fn.bind(context, ...args))
  }
}
