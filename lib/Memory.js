"use strict";

var Memory = function(numberOfWords, wordsize, callbacks) {
  this.numberOfWords = numberOfWords;
  this.wordsize = wordsize;
  this.callbacks = callbacks;
  this.words = [];
  this.reset();
};

Memory.prototype.read = function(address) {
  if (address > this.words.length) {
    throw "Address is out of range";
  }
  this.callbacks.read(address, this.words[address]);
  return this.words[address];
};

Memory.prototype.write = function(address, value) {
  if (value > this.wordsize) {
    throw "Value is larger than wordsize";
  }
  if (address > this.words.length) {
    throw "Address is out of range";
  }
  this.callbacks.write(address, value);
  this.words[address] = value;
};

Memory.prototype.reset = function() {
  for (var i = 0; i < this.numberOfWords; i++) {
    this.words[i] = 0x0000;
  }
};