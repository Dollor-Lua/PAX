const main = document.getElementById("main");

/* bool */
function write(output, mdiv, arrows = true, abr = true) {
    if (!mdiv) return false;

    var current = "";

    var lines = [];
    var cline = 0;

    var color = "#fff";
    var bgcolor = "#00000000";
    var bold = "normal";

    function encodeWhiteSpaces(str) {
        return str
            .split("")
            .map(function (c) {
                return c === " " ? "\u00A0" : c;
            })
            .join("");
    }

    function esc(inc = false, same = false, txt = "\0", ccolor = "x", bcolor = "x", fw = "x") {
        if (!same && abr) lines[cline].appendChild(document.createElement("br"));
        const ne = document.createElement("div");
        ne.innerText = encodeWhiteSpaces((same || !arrows ? "" : "⇨ ") + (txt == "\0" ? current : txt));

        ne.style.color = ccolor == "x" ? color : ccolor;
        ne.style.backgroundColor = bcolor == "x" ? bgcolor : bcolor;
        ne.style.fontWeight = fw == "x" ? bold : fw;

        ne.style.height = "inherit";
        ne.style.width = "fit-content";
        ne.style.margin = "0";

        // place objects on the same line until console needs to wrap
        ne.style.display = "inline-block";

        lines[cline].appendChild(ne);
        if (!inc) current = "";
    }

    for (var i = 0; i < output.length; i++) {
        if (lines.length != cline + 1) {
            const ee = document.createElement("div");
            ee.style.width = "100%";
            ee.style.height = "18px";
            ee.style.fontSize = "15px";
            lines[cline] = ee;
        }
        const mstr = output[i];
        if (mstr == "\x1b") {
            if (current != "") esc();
            var ttl = "";
            var ttl1 = 0;
            for (var x = i + 1; x < output.length; x++) {
                ttl1++;
                ttl = ttl + output[x];
                if (output[x] == "m") break;
            }

            i += ttl1;

            console.log(ttl);

            switch (
                ttl // lmao this is so long (stupid escapes)
            ) {
                case "[0m": {
                    color = "#fff";
                    bgcolor = "#00000000";
                    bold = "normal";
                    break;
                }
                case "[1m": {
                    bold = "bold";
                    break;
                }
                case "[2m": {
                    bold = "lighter";
                    break;
                }

                // colors
                case "[30m": {
                    color = "#000";
                    break;
                }
                case "[31m": {
                    color = "#ff0000";
                    break;
                }
                case "[32m": {
                    color = "#00ff00";
                    break;
                }
                case "[33m": {
                    color = "#ffff00";
                    break;
                }
                case "[34m": {
                    color = "#0000ff";
                    break;
                }
                case "[35m": {
                    color = "#ff00ff";
                    break;
                }
                case "[36m": {
                    color = "#00ffff";
                    break;
                }
                case "[37m": {
                    color = "#fff";
                    break;
                }

                // background colors
                case "[40m": {
                    bgcolor = "#000";
                    break;
                }
                case "[41m": {
                    bgcolor = "#ff0000";
                    break;
                }
                case "[42m": {
                    bgcolor = "#00ff00";
                    break;
                }
                case "[43m": {
                    bgcolor = "#ffff00";
                    break;
                }
                case "[44m": {
                    bgcolor = "#0000ff";
                    break;
                }
                case "[45m": {
                    bgcolor = "#ff00ff";
                    break;
                }
                case "[46m": {
                    bgcolor = "#00ffff";
                    break;
                }
                case "[47m": {
                    bgcolor = "#fff";
                    break;
                }

                default: {
                    esc(true, cline != 0 ? true : false, "Error: ", "#ff0000", "#00000000", "normal");
                    esc(true, true, "Unknown escape sequence", "#fff", "#00000000", "normal");
                }
            }

            continue;
        } else if (mstr == "\n") {
            esc();
            cline++;
            continue;
        }

        current += output.charAt(i);
    }

    if (lines.length != cline + 1) {
        const ee = document.createElement("div");
        ee.style.width = "100%";
        ee.style.height = "18px";
        ee.style.fontSize = "15px";
        lines[cline] = ee;
    }
    esc();

    for (var i = 0; i < lines.length; i++) {
        mdiv.appendChild(lines[i]);
    }

    return true;
}

write("PAX CLI [version 1.0.0.1]\n(c) Starlight Interactive. All rights reserved.\n", main, false, false);
write("\x1b[30m\x1b[47mBlack text!\x1b[0m with normal text after", main);
write("\x1b[31mRed text!\x1b[0m with normal text after", main);
write("\x1b[32mGreen text!\x1b[0m with normal text after", main);
write("\x1b[33mYellow text!\x1b[0m with normal text after", main);
write("\x1b[34mBlue text!\x1b[0m with normal text after", main);
write("\x1b[35mViolet text!\x1b[0m with normal text after", main);
write("\x1b[36mCyan text!\x1b[0m with normal text after", main);
write("\x1b[37mWhite text!\x1b[0m with normal text after", main);
write("\n", main, false, false);
write("\x1b[40m\x1b[37mBlack BG text!\x1b[0m with normal text after", main);
write("\x1b[41mRed BG text!\x1b[0m with normal text after", main);
write("\x1b[42m\x1b[30mGreen BG text!\x1b[0m with normal text after", main);
write("\x1b[43m\x1b[30mYellow BG text!\x1b[0m with normal text after", main);
write("\x1b[44mBlue BG text!\x1b[0m with normal text after", main);
write("\x1b[45mViolet BG text!\x1b[0m with normal text after", main);
write("\x1b[46m\x1b[30mCyan BG text!\x1b[0m with normal text after", main);
write("\x1b[47m\x1b[30mWhite BG text!\x1b[0m with normal text after", main);
write("\n", main, false, false);
write("\x1b[1mBold Text!\x1b[0m with normal text after", main);
write("\x1b[2mLight Text!\x1b[0m with normal text after", main);
