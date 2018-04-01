'use strict'

/* global describe, it */

const { assert } = require('chai')
const EventEmitter = require('events')
const Vrpc = require('vrpc')
const addon = require('../build/Release/vrpc_example')

describe('The example binding together with vrpc', () => {
  let vrpc
  let bar
  let event
  const emitter = new EventEmitter()
  emitter.on('empty', msg => {
    event = msg
  })
  it('should properly load', () => {
    vrpc = Vrpc(addon)
    assert.ok(vrpc)
  })
  it('should be able to instantiate a Bar object', () => {
    bar = vrpc.create('Bar')
    assert.ok(bar)
  })
  describe('The bar object', () => {
    it('should have the right philosophy', () => {
      assert.equal(
        vrpc.callStatic('Bar', 'philosophy'),
        'I have mixed drinks about feelings.'
      )
    })
    it('should behave correctly when adding and removing bottles', () => {
      assert.isFalse(bar.hasDrink('rum'))
      assert.deepEqual(bar.getAssortment(), {})
      const bottle = { brand: 'a', country: 'a', age: 1 }
      bar.addBottle('rum', bottle)
      assert.isTrue(bar.hasDrink('rum'))
      assert.deepEqual(bar.getAssortment(), { rum: [bottle] })
      bar.onEmptyDrink({ emitter, event: 'empty' })
      assert.equal(event, undefined)
      bar.removeBottle('rum')
      assert.equal(event, 'rum')
    })
  })
})
