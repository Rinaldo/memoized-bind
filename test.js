const memoizedBind = require('./index.js')


describe('The memoizedBind function', () => {

  it('returns the bind function when invoked', () => {
    const bind = memoizedBind()
    expect(bind.name).toBe('bind')
  })

  describe('The bind function', () => {

    const context = { name: 'Rob' }

    function multiply(...nums) {
      return nums.reduce((a, c) => a * c)
    }
    function thisSays (...words) {
      return [this.name, 'says:', ...words].reduce((a, c) => a + ' ' + c)
    }

    it('returns a bound version of the passed in function', () => {
      const bind = memoizedBind()
      const boundMultiply = bind(multiply, 2, 3)
      expect(boundMultiply(7)).toBe(42)
    })

    it('handles context correctly', () => {
      const bind = memoizedBind(context)
      const boundSays = bind(thisSays, 'hello')
      expect(boundSays('world!')).toBe('Rob says: hello world!')
    })

    it('can bind multiple arguments', () => {
      const bind = memoizedBind(context)
      const boundSays = bind(thisSays, 'oh', 'what', 'a', 'day')
      expect(boundSays('what', 'a', 'lovely', 'day!')).toBe('Rob says: oh what a day what a lovely day!')
    })

    it('memoizes bound functions', () => {
      const bind = memoizedBind()
      const mult1 = bind(multiply, 2, 3)
      const mult2 = bind(multiply, 2, 3)
      expect(mult1).toBe(mult2)
      expect(mult1(3.5, 2)).toBe(42)
    })

    it('handles memoizing many functions with different arguments', () => {
      const bind = memoizedBind(context)

      const multA = bind(multiply, 5)
      const multA2 = bind(multiply, 5)
      const multB = bind(multiply, 5, 6)
      const multB2 = bind(multiply, 5, 6)
      const multC = bind(multiply, 1, 2, 3)
      const multC2 = bind(multiply, 1, 2, 3)
      const multD = bind(multiply, 1, 2)
      const multD2 = bind(multiply, 1, 2)

      const saysA = bind(thisSays, 'foo')
      const saysB = bind(thisSays, 'foo', 'bar', 'baz')
      const saysC = bind(thisSays, 'a', 'b', 'c')
      const saysD = bind(thisSays, 'a')

      expect(multA(4)).toBe(20)
      expect(multB(2)).toBe(60)
      expect(multC(7)).toBe(42)
      expect(multD(4)).toBe(8)
      expect(multA).toBe(multA2)
      expect(multA2).not.toBe(multB)
      expect(multB).toBe(multB2)
      expect(multB2).not.toBe(multC)
      expect(multC).toBe(multC2)
      expect(multC2).not.toBe(multD)
      expect(multD).toBe(multD2)

      expect(saysA).not.toBe(saysB)
      expect(saysB).not.toBe(saysC)
      expect(saysC).not.toBe(saysD)
    })

    it('returns funtions reflectively equal to functions bound with the native bind method', () => {
      const bind = memoizedBind(context)

      const memMult1 = bind(multiply, 2, 3)
      const memMult2 = multiply.bind(context, 2, 3)
      expect(memMult1(7)).toEqual(memMult2(7))

      const memSays1 = bind(thisSays, 'foo', 'bar')
      const memSays2 = thisSays.bind(context, 'foo', 'bar')
      expect(memSays1('baz')).toEqual(memSays2('baz'))
    })
  })
})
