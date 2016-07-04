new (function Demo() {
  "use strict";
  var sheet;

  var demos = {
    "Clementi - Sonatina Op.36 No.1 Pt.1": "../data/MuzioClementi_SonatinaOpus36No1_Part1.xml",
    "Clementi - Sonatina Op.36 No.1 Pt.2": "../data/MuzioClementi_SonatinaOpus36No1_Part2.xml",
    "Clementi - Sonatina Op.36 No.3 Pt.1": "../data/MuzioClementi_SonatinaOpus36No3_Part1.xml",
    "Clementi - Sonatina Op.36 No.3 Pt.2": "../data/MuzioClementi_SonatinaOpus36No3_Part2.xml",
    "J.S. Bach - Air": "../data/JohannSebastianBach_Air.xml",
    "Telemann - Sonata, TWV 40:102 - 1. Dolce": "../data/TelemannWV40.102_Sonate-Nr.1.1-Dolce.xml",
  }

  var resize;
  var zoom = 1;
  var err;
  var canvas;
  var select;
  var zoomIn, zoomOut;

  var size;

  function init() {
    size = document.getElementById("size");
    // Create select
    select = document.getElementById("select");
    for (var name in demos) {
      if (demos.hasOwnProperty(name)) {
        var option = document.createElement("option");
        option.value = demos[name];
        option.textContent = name;
      }
      select.appendChild(option);
    }
    select.onchange = function() {
      loadMusicXML(select.value);
    }

    // Create zoom controls
    var btn = document.getElementById("zoom-in");
    btn.onclick = function() {
      zoom *= 1.2;
      scale(canvas);
    };
    zoomIn = btn;
    btn = document.getElementById("zoom-out");
    btn.onclick = function() {
      zoom /= 1.2;
      scale(canvas);
    };
    zoomOut = btn;

    // Create error displayer
    err = document.getElementById("err");

    // Create sheet object and canvas
    sheet = new window.osmd.MusicSheet();
    canvas = document.createElement("canvas");
    canvas.width = canvas.height = 0;
    document.body.appendChild(canvas);
    sheet.setCanvas(canvas);

    // Set resize
    resize = new window.Resize(
      function(){
        disable();
      },
      function() {
        var width = document.body.clientWidth;
        sheet.setWidth(width);
        enable();
      }
    );
  }

  function updateSize() {
    size.innerHTML = canvas.width + "&times;" + canvas.height;
  }

  function scale() {
    disable();
    window.setTimeout(function(){
      sheet.scale(zoom);
      enable();
    }, 0);
  }

  function loadMusicXML(url) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState == 4 && xhttp.status == 0) {
        xml(xhttp.responseXML);
      }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
  }

  function xml(data) {
    var tr = document.getElementById("error-tr");
    tr.style.display = "none";
    try {
      sheet.load(data);
    } catch (e) {
      err.textContent = "Error loading sheet: " + e;
      tr.style.display = "";
      canvas.width = canvas.height = 0;
      enable();
      throw e;
    }
    enable();
  }

  function disable() {
    document.body.style.opacity = 0.3;
    select.disabled = zoomIn.disabled = zoomOut.disabled = "disabled";
  }

  function enable() {
    document.body.style.opacity = 1;
    select.disabled = zoomIn.disabled = zoomOut.disabled = "";
    updateSize();
  }

  // Register events: load, drag&drop
  window.addEventListener("load", function() {
    init();
    loadMusicXML("../data/MuzioClementi_SonatinaOpus36No1_Part1.xml");
  });

  window.addEventListener("dragenter", function(event) {
    event.preventDefault();
    disable();
  });
  window.addEventListener("dragover", function(event) {
    event.preventDefault();
  });
  window.addEventListener("dragleave", function(event) {
    enable();
  });
  window.addEventListener("drop", function(event) {
    event.preventDefault();
    var reader = new FileReader();
    reader.onload = function (res) {
      var content = res.target.result;
      console.log("content", content.substr(0, 100));
      xml((new DOMParser()).parseFromString(content, "text/xml"));
    };
    reader.readAsText(event.dataTransfer.files[0]);
  });
})();
