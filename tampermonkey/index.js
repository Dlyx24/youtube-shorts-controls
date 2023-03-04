// ==UserScript==
// @name         Youtube shorts controls
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes youtube shorts overlay and adds controls so you can go back or forward on the video.
// @author       Dlyx24
// @match        https://www.youtube.com/shorts/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// ==/UserScript==

const videoId = "shorts-controls";

const addControls = () => {
  "use strict";

  const thumbnail = document.getElementsByClassName(
    "ytp-cued-thumbnail-overlay"
  );

  if (thumbnail[0] && thumbnail[0].style.display !== "none") {
    // Video not started, re-runs the function until it has.
    return setTimeout(() => addControls(), 500);
  }

  const video = document.getElementsByClassName(
    "video-stream html5-main-video"
  );
  const myVideo = video[0];

  if (!myVideo) {
    // for any reason video wasn't loaded yet, we re-run the script.
    return setTimeout(() => addControls(), 500);
  } else {
    const infoPanel = document.getElementById("info-panel");
    const headers = document.getElementsByTagName(
      "ytd-reel-player-header-renderer"
    );
    const overlays = document.getElementsByClassName(
      "style-scope ytd-reel-player-overlay-renderer"
    );
    const filteredOverlays = Array.from(overlays).filter(
      (overlay) => overlay.id === "overlay"
    );
    const filteredheadersBloat = Array.from(
      document.getElementsByClassName(
        "style-scope ytd-reel-player-header-renderer"
      )
    ).filter(
      ({ id }) =>
        id === "suggested-action" ||
        id === "badge" ||
        id === "multimix-attribution-label"
    );

    // removes all unnecessary divs for better styles
    for (let i = 0; i < filteredheadersBloat.length; i++) {
      filteredheadersBloat[i].remove();
    }

    // iterate through the filtered overlays and set hide them.
    for (let i = 0; i < filteredOverlays.length; i++) {
      filteredOverlays[i].style.marginBottom = "10%";
      filteredOverlays[i].style.background = "none";
      filteredOverlays[i].style.height = "93%";
    }
    for (let i = 0; i < headers.length; i++) {
      headers[i].style.paddingTop = "8px";
      headers[i].style.flexDirection = "column-reverse";
      headers[i].style.justifyContent = "space-between";
    }
    const playerControls = document.getElementsByClassName("player-controls");

    myVideo.setAttribute("controls", "true");
    myVideo.style.cursor = "pointer";

    // Removes most of youtube divs that are full of crap.
    if (infoPanel) infoPanel.remove();
    if (playerControls.length > 0) playerControls[0].remove();
  }

  if (myVideo.getAttribute("id") === videoId) {
    // video has id property set so we don't need to do anything else.
    return;
  }

  myVideo.addEventListener("loadedmetadata", () => {
    // video src attribute was changes, this means the video changed and we need to re-run the script.
    setTimeout(() => addControls(), 150);
  });
  myVideo.setAttribute("id", videoId);

  // Add event listener to myVideo to prevent controls attribute from being removed
  myVideo.addEventListener("DOMAttrModified", (e) => {
    if (e.attrName === "controls" && !e.newValue) {
      myVideo.setAttribute("controls", "true");
    }
  });
};

addControls();
