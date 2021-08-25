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
 * A simple utility for attaching a visualization relaxation
 * progress monitor to FoamTree. Currently, progress reporting
 * works only with relaxationVisible option set to true.
 *
 * This utility varies the width of the provided element to
 * reflect the progress of relaxation. Feel free to modify
 * this utility to show progress in a different fashion.
 *
 * Please see demos/relaxation-progress.html for the usage example.
 *
 * @param foamtree the FoamTree instance whose relaxation progress
 *        should be monitored
 * @param element the HTML element whose width will be modified
 *        from 0% to 100% to reflect the relaxation progress
 */
window.BeSSearchFoamTree.relaxationProgress = function(foamtree, element) {
  // Initialize the element
  var style = element.style;
  var progressBarShowing = false;
  var opacityTimeout;

  foamtree.on("modelChanged", start);
  foamtree.on("relaxationStep", progress);

  function start() {
    if (!foamtree.get("relaxationVisible")) {
      style.display = "none";
      return;
    }
    progressBarShowing = true;
    window.clearTimeout(opacityTimeout);
    disableTransitions();
    style.display = "block";
    style.backgroundColor = "red";
    style.width = "0%";
    style.opacity = 1.0;
    window.setTimeout(enableTransitions, 1);
  }

  function progress(progress, complete, timeout) {
    if (!progressBarShowing) {
      start();
    }

    if (complete || timeout) {
      style.backgroundColor = "green";
      style.width = "100%";
      opacityTimeout = window.setTimeout(function() {
        style.opacity = 0;
        progressBarShowing = false;
      }, 2000);
    } else {
      // Bend the characteristics a bit so that
      // values close to 1.0 take more space.
      var width = 1 - Math.pow(1 - progress, 0.5);
      style.width = (100 * width) + "%";
    }
  }

  function enableTransitions() {
    style.WebkitTransition = "width 0.5s, background-color 1s, opacity 0.5s";
    style.transition = "background-color 1s, opacity 0.5s";
  }

  function disableTransitions() {
    style.WebkitTransition = "";
    style.transition = "";
  }
};