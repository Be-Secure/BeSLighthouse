/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 * Copyright 2002-2021,Be-Secure Community, All Rights Reserved.
 *
 *
 * A simple non-XHR JSON-P loading utility. The only way to match requests with
 * callbacks when the callback name is constant is to queue the requests and
 * execute them sequentially.
 */
var JSONP = (function() {
  var REMOTE_TIMEOUT = 20000;
  var LOCAL_TIMEOUT = 500;

  var queue = [];

  var scriptElement;
  var originalCallback;
  var failedTimeout;

  function schedule(url, callbackName, callback, failed) {
    var args = Array.prototype.slice.call(arguments, 0);
    args.unshift(false); // request sent flag
    queue.push(args);
    if (queue.length === 1) {
      advance();
    }
  }

  function advance() {
    if (queue.length > 0) {
      queue[0][0] = true; // request sent
      failedTimeout = setTimeout(failed, queue[0][1].indexOf("file://") === 0 ? LOCAL_TIMEOUT : REMOTE_TIMEOUT);
      request.apply(this, queue[0].slice(1));
    }
  }

  function request(url, callbackName) {
    originalCallback = window[callbackName];
    window[callbackName] = loaded;
    scriptElement = document.createElement('script');
    scriptElement.src = url;
    document.getElementsByTagName('head')[0].appendChild(scriptElement);
  }

  function loaded() {
    clearTimeout(failedTimeout);
    finish(3, arguments);
  }

  function failed() {
    finish(4, []);
  }

  function finish(callbackIndex, data) {
    var args = queue.shift();
    window[args[1]] = originalCallback;
    document.getElementsByTagName('head')[0].removeChild(scriptElement);
    args[callbackIndex] && args[callbackIndex].apply(this, data);
    advance();
  }

  // Static methods only
  return {
    load: schedule
  };
})();
