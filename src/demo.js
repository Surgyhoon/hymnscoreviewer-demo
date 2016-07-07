/*jslint browser:true */
new (function () {
    "use strict";
    // The MusicSheet object
    var sheet,
    // The folder of the demo files
        folder = "../samples/",
    // The available demos
        demos = {
            "M. Clementi - Sonatina Op.36 No.1 Pt.1": "MuzioClementi_SonatinaOpus36No1_Part1",
            "M. Clementi - Sonatina Op.36 No.1 Pt.2": "MuzioClementi_SonatinaOpus36No1_Part2",
            "M. Clementi - Sonatina Op.36 No.3 Pt.1": "MuzioClementi_SonatinaOpus36No3_Part1",
            "M. Clementi - Sonatina Op.36 No.3 Pt.2": "MuzioClementi_SonatinaOpus36No3_Part2",
            "J.S. Bach - Air": "JohannSebastianBach_Air",
            "G.P. Telemann - Sonata, TWV 40:102 - 1. Dolce": "TelemannWV40.102_Sonate-Nr.1.1-Dolce",
            "C. Gounod - Meditation": "CharlesGounod_Meditation",
            "J.S. Bach - Praeludium In C Dur BWV846 1": "JohannSebastianBach_PraeludiumInCDur_BWV846_1",
            "J. Haydn - Concertante Cello": "JosephHaydn_ConcertanteCello",
            "P. Koen - Fugue in G Major": "PeterKoen-FugueInGMajor",
            "S. Joplin - Elite Syncopations": "ScottJoplin_EliteSyncopations",
            "S. Joplin - The Entertainer": "ScottJoplin_The_Entertainer"
        },

        zoom = 1.0,
    // HTML Elements in the page
        err,
        canvas,
        select,
        zoomIn,
        zoomOut,
        size,
        custom;


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
        select.onchange = selectOnChange;
        custom = document.createElement("option");
        custom.appendChild(document.createTextNode("Custom"));

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
        new window.Resize(
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

    function selectOnChange() {
        loadMusicXML(folder + select.value + ".xml");
    }

    function logCanvasSize() {
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
        if (!data) {
            return error("Error parsing the XML document");
        }
        error();
        try {
            sheet.load(data);
        } catch (e) {
            error("Error loading sheet: " + e);
            canvas.width = canvas.height = 0;
            enable();
            throw e;
        }
        // Remove option from select
        if (custom.parentElement === select) {
            select.removeChild(custom);
        }
        // Enable controls again
        enable();
    }

    function error(errString) {
        var tr = document.getElementById("error-tr");
        if (!errString) {
            tr.style.display = "none";
        } else {
            err.textContent = errString;
            tr.style.display = "";
        }
    }

    // Enable/Disable Controls
    function disable() {
        document.body.style.opacity = 0.3;
        select.disabled = zoomIn.disabled = zoomOut.disabled = "disabled";
    }
    function enable() {
        document.body.style.opacity = 1;
        select.disabled = zoomIn.disabled = zoomOut.disabled = "";
        logCanvasSize();
    }

    // Register events: load, drag&drop
    window.addEventListener("load", function() {
        init();
        selectOnChange();
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
        if (!event.dataTransfer || !event.dataTransfer.files || event.dataTransfer.files.length === 0) {
            return;
        }
        // Add "Custom..." score
        select.appendChild(custom);
        custom.selected = "selected";
        // Read dragged file
        var reader = new FileReader();
        reader.onload = function (res) {
            var content = res.target.result;
            xml((new DOMParser()).parseFromString(content, "text/xml"));
        };
        reader.readAsText(event.dataTransfer.files[0]);
    });
})();
