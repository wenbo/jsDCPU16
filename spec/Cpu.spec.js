"use strict";
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(['../lib/Memory', '../lib/Cpu'], function(Memory, Cpu) {

  var setupCpu = function(instructions) {
    var wordsize = 0xFFFF;
    var numberOfWords = 0x10000;

    var memory = new Memory(numberOfWords, wordsize, {
      read: function() {},
      write: function() {}
    });

    instructions.forEach(function(instruction, index) {
      memory.write(index, instruction);
    });

    var cpu = new Cpu(memory, {
      step: function() {}
    });

    return cpu;
  }

  describe('SET', function() {
    it('correctly sets a register', function() {
      var cpu = setupCpu([0x9401]); // SET A, 5
      cpu.step();
      expect(cpu.registers[0x00]).toEqual(0x0005);
    });

    it('correctly sets a register to the value of another register', function() {
      var cpu = setupCpu([
        0x9401,   // SET A, 5
        0x0011    // SET B, A
      ]);
      cpu.step();
      cpu.step();
      expect(cpu.registers[0x01]).toEqual(0x0005);
    });
  });


  describe('ADD', function() {
    it('correctly adds the value of a register to the value of another register', function() {
      var cpu = setupCpu([
        0x9401,   // SET A, 5
        0x0011,   // SET B, A
        0x0402    // ADD A, B
      ]);
      cpu.step();
      cpu.step();
      cpu.step();
      expect(cpu.registers[0x00]).toEqual(0x000a); // A must be 10
    });

    it('sets O if an overflow occurs', function() {
      var cpu = setupCpu([
        0x7c01,   // SET A, 0xfffe
        0xfffe,   //
        0x9402    // ADD A, 5
      ]);
      cpu.step();
      cpu.step();
      expect(cpu.registers[0x00]).toEqual(0x0003);
      expect(cpu.registers[0x1d]).toEqual(0x0001);
    });
  });

});