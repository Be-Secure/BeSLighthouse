/**

 *
 *
 * A simple utility for attaching showing and hiding a
 * data loading and preparation progress indicator. The utility
 * will create and attach all the necessary HTML to the page.
 *
 * Please see demos/loading.html for the usage example.
 *
 * @param foamtree the FoamTree instance whose loading and
 *        layout preparation progress should be monitored
 * @param indicatorHtml the HTML representing the loading message
 */
window.BeSSearchFoamTree.loader = function(foamtree, indicatorHtml) {
  var deferDataObjectChange = false, dataObjectToSet = undefined;
  var dataObjectToSetProvided = false;

  // Duration of the loading element CSS transition. You may
  // need to modify this value if you modified the default CSS transitions.
  var duration = 350;

  // On Webkit CSS transitions seem to continue running during JS processing.
  // Other browsers need to wait for the transition to complete.
  var waitForTransition = !/chrome|webkit/.test(navigator.userAgent.toLowerCase());

  // Create the indicator element
  var indicator = document.createElement("div");
  indicator.className = "visualization-loading fadeout";
  indicator.innerHTML = indicatorHtml;
  foamtree.get("element").appendChild(indicator);

  // Hide the indicator when rollout starts
  foamtree.on("rolloutStart", hideIndicator);

  return {
    /**
     * Call this method before data loading is initiated to
     * show the loading indicator.
     *
     * If FoamTree is set to perform a pullback animation,
     * the loading indicator will show after pullback is complete.
     */
    started: function() {
      dataObjectToSetProvided = false;
      if (isPullbackEnabled()) {
        // We'll defer setting of the new data object
        // until pullback completes. FoamTree does that
        // internally too, but we need to show the indicator
        // before we set the new data object. If we didn't
        // do that, the element would actually show after
        // the diagram computation completes, which wouldn't
        // make much sense.
        deferDataObjectChange = true;
        once("modelChanged", showIndicatorAndSetDataObject);

        // Set an empty data object to trigger a pullback
        foamtree.set("dataObject", null);
      } else {
        deferDataObjectChange = false;
        showIndicator();
      }
    },

    /**
     * Call this method when data loading completes. This method
     * will take care of setting the new data object on FoamTree
     * and hiding the indicator when the diagram is ready to show.
     *
     * @param dataObject new data object to set
     */
    complete: function (dataObject) {
      dataObjectToSetProvided = true;
      if (deferDataObjectChange) {
        // Just remember the new data object, we'll set it
        // after the pullback completes and the loading indicator
        // is made visible.
        dataObjectToSet = dataObject;
      } else {
        // Defer the update to give the browser a chance
        // to show the loading indicator.
        setTimeout(function() {
          foamtree.set("dataObject", dataObject);
          hideIndicatorIfDataObjectEmpty(dataObjectToSet);
        }, 1 + (waitForTransition ? duration + 50 : 1));
      }
    }
  };

  function showIndicatorAndSetDataObject() {
    showIndicator();
    if (dataObjectToSetProvided && deferDataObjectChange) {
      // Defer the update to give the browser a chance
      // to show the loading indicator.
      setTimeout(function() {
        foamtree.set("dataObject", dataObjectToSet);
        hideIndicatorIfDataObjectEmpty(dataObjectToSet);
      }, 5 + (waitForTransition ? duration + 50 : 1));
    }
    deferDataObjectChange = false;
  }

  function hideIndicatorIfDataObjectEmpty(dataObject) {
    if (!dataObject || !dataObject.groups || dataObject.groups.length == 0) {
      hideIndicator();
    }
  }

  function hideIndicator() {
    addClass(indicator, "fadeout");
  }

  function showIndicator() {
    // It would be good to defer showing of the indicator a bit
    // so that it's not shown when the loading process completes
    // very quickly. However, it's not currently possible to implement
    // because FoamTree diagram computation is performed in one
    // go and blocks until the computation completes. In the future,
    // it would be good to split the computation into chunks between
    // which FoamTree would yield to the UI thread to redraw the
    // DOM updates.
    removeClass(indicator, "fadeout");
  }

  function addClass(element, clazz) {
    var classes = element.className.split(/\s+/);
    if (classes.indexOf(clazz) < 0) {
      classes.push(clazz);
      element.className = classes.join(" ");
    }
  }

  function removeClass(element, clazz) {
    element.className = element.className.split(/\s+/).filter(function (c) {
      return c != clazz;
    }).join(" ");
  }

  function isPullbackEnabled() {
    return foamtree.get("pullbackDuration") > 0 || foamtree.get("fadeDuration") > 0;
  }

  function once(event, fn) {
    foamtree.on(event, function() {
      foamtree.off(event);
      fn();
    });
  }
};