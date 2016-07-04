new (function Demo() {
  //"use strict";
  var sheet;

  var demos = {
    "Clementi - Sonatina Op.36 Pt.1": "../data/MuzioClementi_SonatinaOpus36No1_Part1.xml",
    "Clementi - Sonatina Op.36 Pt.2": "../data/MuzioClementi_SonatinaOpus36No1_Part2.xml",
    "Bach - Air": "../data/JohannSebastianBach_Air.xml",
    "Telemann": "../data/TelemannWV40.102_Sonate-Nr.1.1-Dolce.xml",
  }

  var resize;
  var zoom = 1;
  var err;

  function init() {
    // Create heading
    var h1 = document.createElement("h1");
    h1.textContent = "Open Sheet Music Display Demo";
    document.body.appendChild(h1);

    // Create select
    var select = document.createElement("select");
    document.body.appendChild(select);
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
    var btn = document.createElement("input");
    btn.type = "button";
    btn.value = "+";
    btn.onclick = function() {
      zoom *= 1.2;
      sheet.scale(zoom);
    };
    document.body.appendChild(btn);
    btn = document.createElement("input");
    btn.type = "button";
    btn.value = "-";
    btn.onclick = function() {
      zoom /= 1.2;
      sheet.scale(zoom);
    };
    document.body.appendChild(btn);

    document.body.appendChild(document.createElement("br"));

    // Create error displayer
    err = document.createElement("div");
    err.style.color = "red";
    document.body.appendChild(err);

    // Create sheet object and canvas
    sheet = new window.osmd.MusicSheet();
    var canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    sheet.setCanvas(canvas);

    // Set resize
    resize = new window.Resize(
      function(){

      },
      function() {
        var width = document.body.clientWidth;
        sheet.setWidth(width);
      }
    );
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
    err.textContent = "";
    try {
      sheet.load(data);
    } catch (e) {
      err.textContent = "Error loading sheet: " + e;
    }
  }


  window.addEventListener("load", function () {
    init();
    loadMusicXML("../data/MuzioClementi_SonatinaOpus36No1_Part1.xml");
  });
})();
