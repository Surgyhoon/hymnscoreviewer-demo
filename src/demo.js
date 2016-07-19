/*jslint browser:true */
(function () {
    "use strict";
    // The MusicSheet object
    var sheet,
    // The folder of the demo files
        folder = "samples/",
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
        zoomDiv,
        custom,
        nextCursorBtn,
        showCursorBtn,
        hideCursorBtn;

    // Initialization code
    function init() {
        var name, option;

        err = document.getElementById("err");
        size = document.getElementById("size");
        zoomDiv = document.getElementById("zoom");
        custom = document.createElement("option");
        select = document.getElementById("select");
        zoomIn = document.getElementById("zoom-in");
        zoomOut = document.getElementById("zoom-out");
        canvas = document.createElement("div");
        nextCursorBtn = document.getElementById("nextCursorBtn");
        showCursorBtn = document.getElementById("showCursorBtn");
        hideCursorBtn = document.getElementById("hideCursorBtn");

        // Create select
        for (name in demos) {
            if (demos.hasOwnProperty(name)) {
                option = document.createElement("option");
                option.value = demos[name];
                option.textContent = name;
            }
            select.appendChild(option);
        }
        select.onchange = selectOnChange;

        custom.appendChild(document.createTextNode("Custom"));

        // Create zoom controls
        zoomIn.onclick = function () {
            zoom *= 1.2;
            scale();
        };
        zoomOut.onclick = function () {
            zoom /= 1.2;
            scale();
        };

        // Create sheet object and canvas
        sheet = new window.osmd.MusicSheet(canvas);
        document.body.appendChild(canvas);

        // Set resize event handler
        new window.Resize(
            function(){
                disable();
            },
            function() {
                var width = document.body.clientWidth;
                canvas.width = width;
                try {
                sheet.render();
                } catch (e) {};
                enable();
            }
        );

        window.addEventListener("keydown", function(e) {
            var event = window.event ? window.event : e;
            if (event.keyCode === 39) {
                sheet.cursor.next();
            }
        });
        nextCursorBtn.addEventListener("click", function() {
            sheet.cursor.next();
        });
        hideCursorBtn.addEventListener("click", function() {
            sheet.cursor.hide();
        });
        showCursorBtn.addEventListener("click", function() {
            sheet.cursor.show();
        });
    }

    function selectOnChange(str) {
        error();
        disable();
        var isCustom = typeof str === "string";
        if (!isCustom) {
            str = folder + select.value + ".xml";
        }
        sheet.load(str).then(
            function() {
                return sheet.render();
            },
            function(e) {
                error("Error reading sheet: " + e);
            }
        ).then(
            function() {
                return onLoadingEnd(isCustom);
            }, function(e) {
                error("Error rendering sheet: " + e);
                onLoadingEnd(isCustom);
            }
        );
    }

    function onLoadingEnd(isCustom) {
        // Remove option from select
        if (!isCustom && custom.parentElement === select) {
            select.removeChild(custom);
        }
        // Enable controls again
        enable();
    }

    function logCanvasSize() {
        size.innerHTML = canvas.offsetWidth;
        zoomDiv.innerHTML = Math.floor(zoom * 100.0);
    }

    function scale() {
        disable();
        window.setTimeout(function(){
            sheet.zoom = zoom;
            sheet.render();
            enable();
        }, 0);
    }

    function error(errString) {
        var tr = document.getElementById("error-tr");
        if (!errString) {
            tr.style.display = "none";
        } else {
            err.textContent = errString;
            tr.style.display = "";
            canvas.width = canvas.height = 0;
            enable();
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
            selectOnChange(res.target.result);
        };
        reader.readAsBinaryString(event.dataTransfer.files[0]);
    });
}());
