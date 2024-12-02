var noop = (exports.noop = function () {});

export const extend = function extend(dest, source) {
  for (var prop in source) {
    dest[prop] = source[prop];
  }
};

export const eventEmitterListenerCount =
  require('events').EventEmitter.listenerCount ||
  function (emitter, type) {
    return emitter.listeners(type).length;
  };

export const bufferAllocUnsafe = Buffer.allocUnsafe
  ? Buffer.allocUnsafe
  : function oldBufferAllocUnsafe(size) {
      return new Buffer(size);
    };

export const bufferFromString = Buffer.from
  ? Buffer.from
  : function oldBufferFromString(string, encoding) {
      return new Buffer(string, encoding);
    };

export const BufferingLogger = function createBufferingLogger(identifier, uniqueID) {
  var logFunction = require('debug')(identifier);
  if (logFunction.enabled) {
    var logger = new _BufferingLogger(identifier, uniqueID, logFunction);
    var debug = logger.log.bind(logger);
    debug.printOutput = logger.printOutput.bind(logger);
    debug.enabled = logFunction.enabled;
    return debug;
  }
  logFunction.printOutput = noop;
  return logFunction;
};

function _BufferingLogger(identifier, uniqueID, logFunction) {
  this.logFunction = logFunction;
  this.identifier = identifier;
  this.uniqueID = uniqueID;
  this.buffer = [];
}

_BufferingLogger.prototype.log = function () {
  this.buffer.push([new Date(), Array.prototype.slice.call(arguments)]);
  return this;
};

_BufferingLogger.prototype.clear = function () {
  this.buffer = [];
  return this;
};

_BufferingLogger.prototype.printOutput = function (logFunction) {
  if (!logFunction) {
    logFunction = this.logFunction;
  }
  var uniqueID = this.uniqueID;
  this.buffer.forEach(function (entry) {
    var date = entry[0].toLocaleString();
    var args = entry[1].slice();
    var formatString = args[0];
    if (formatString !== void 0 && formatString !== null) {
      formatString = '%s - %s - ' + formatString.toString();
      args.splice(0, 1, formatString, date, uniqueID);
      logFunction.apply(global, args);
    }
  });
};

export default {
  extend,
  eventEmitterListenerCount,
  bufferAllocUnsafe,
  bufferFromString,
  BufferingLogger,
};
