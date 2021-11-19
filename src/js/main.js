const main = document.getElementById("main");
var currentInput;

var currentdir = "~/";

var handleInput;

/* bool */
function setup(mdiv) {
    if (!mdiv) return false;

    if (currentInput) {
        currentInput.id = "OLD-mainInput";
        currentInput.disabled = true;
        currentInput.blur();
    }

    const em = document.createElement("span");
    em.id = "mainText";
    const ae = document.createElement("rtext");
    ae.id = "rtxt";
    ae.innerText = currentdir;
    const aem = document.createElement("span");
    aem.id = "ae";
    const ie = document.createElement("input");
    ie.autofocus = true;
    ie.id = "mainInput";
    ie.type = "text";
    aem.appendChild(ie);
    em.appendChild(ae);
    em.appendChild(aem);

    mdiv.appendChild(em);
    currentInput = ie;

    mdiv.addEventListener("keyup", handleInput);
    currentInput.focus();

    return true;
}

/* bool */
function writeNewline(mdiv) {
    if (!mdiv) return false;
    mdiv.appendChild(document.createElement("br"));
    return true;
}

function encode(str, sub, replace) {
    return str.split(sub).join(replace);
}

/* bool */
function write(output, mdiv) {
    if (!mdiv || !output) return false;

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

    function esc(inc, txt = "\0", ccolor = "x", bcolor = "x", fw = "x") {
        const ne = document.createElement("div");
        ne.innerText = encodeWhiteSpaces(txt == "\0" ? current : txt);

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
                    esc(true, "Error: ", "#ff0000", "#00000000", "bold");
                    esc(true, "Unknown escape sequence", "#fff", "#00000000", "normal");
                    writeNewline();
                }
            }

            continue;
        } else if (mstr == "\n") {
            esc();
            writeNewline();
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
    writeNewline();

    for (var i = 0; i < lines.length; i++) {
        mdiv.appendChild(lines[i]);
    }

    return true;
}

/* array */
function genArgs(str) {
    const nstr = str.trim();
    const args = [];
    var cstr = "";

    var inside = false;
    for (var i = 0; i < nstr.length; i++) {
        if (nstr[i] == '"') {
            inside = !inside;
        } else if (nstr[i] == " ") {
            if (!inside) {
                args.push(cstr);
                cstr = "";
                continue;
            }
        }

        cstr += nstr[i];
    }

    args.push(cstr);
    return args;
}

/* private */
handleInput = (e) => {
    if (e.key === "Enter") {
        main.removeEventListener("keyup", handleInput);
        const args = genArgs(currentInput.value);
        switch (args[0]) {
            case "echo": {
                if (args[1]) {
                    if (args[1][0] == '"' && args[1][args[1].length - 1] == '"') {
                        const mstr = args[1].slice(1, args[1].length - 1);
                        const mstr2 = encode(encode(encode(mstr, "\\x1b", "\x1b"), "\\n", "\n"), "\\t", "    ");
                        write(mstr2, main);
                    } else {
                        write(`\x1b[31m\x1b[1mError: \x1b[0mInvalid argument provided for command \`echo\`.\n\tGot: \`${args[1]}\``, main);
                    }
                } else {
                    write("\x1b[31m\x1b[1mError: \x1b[0mNo string provided for command `echo` (parameter 1)", main);
                }
                break;
            }
            case "colors": {
                write("\x1b[30m\x1b[47mBlack text:\x1b[0m \\x1b[30m", main);
                write("\x1b[31mRed text:\x1b[0m \\x1b[31m", main);
                write("\x1b[32mGreen text:\x1b[0m \\x1b[32m", main);
                write("\x1b[33mYellow text:\x1b[0m \\x1b[33m", main);
                write("\x1b[34mBlue text:\x1b[0m \\x1b[34m", main);
                write("\x1b[35mViolet text:\x1b[0m \\x1b[35m", main);
                write("\x1b[36mCyan text:\x1b[0m \\x1b[36m", main);
                write("\x1b[37mWhite text:\x1b[0m \\x1b[37m", main);
                writeNewline(main);
                write("\x1b[40m\x1b[37mBlack BG text:\x1b[0m \\x1b[40m", main);
                write("\x1b[41mRed BG text:\x1b[0m \\x1b[41m", main);
                write("\x1b[42m\x1b[30mGreen BG text:\x1b[0m \\x1b[42m", main);
                write("\x1b[43m\x1b[30mYellow BG text:\x1b[0m \\x1b[43m", main);
                write("\x1b[44mBlue BG text:\x1b[0m \\x1b[44m", main);
                write("\x1b[45mViolet BG text:\x1b[0m \\x1b[45m", main);
                write("\x1b[46m\x1b[30mCyan BG text:\x1b[0m \\x1b[46m", main);
                write("\x1b[47m\x1b[30mWhite BG text:\x1b[0m \\x1b[47m", main);
                writeNewline(main);
                write("\x1b[0mDefault Text (reset):\x1b[0m \\x1b[0m", main);
                write("\x1b[1mBold Text:\x1b[0m \\x1b[1m", main);
                write("\x1b[2mLight Text:\x1b[0m \\x1b[2m", main);
                writeNewline(main);
                write(
                    "\x1b[36mNOTE: \x1b[0mMake sure you use the `reset` escape after all color changes.\nOtherwise the console's color will not go back to normal.",
                    main
                );
                writeNewline(main);
                write("These color escapes are generally true for all consoles.", main);

                break;
            }
            case "exit": {
                window.pax.close();
                break;
            }
            case "mkdir": {
                write("\x1b[33mWARN: \x1b[0m`mkdir` has not been setup yet.", main);
                break;
            }
            case "cd": {
                write("\x1b[33mWARN: \x1b[0m`cd` has not been setup yet.", main);
                break;
            }
            default: {
                write(`\x1b[31m\x1b[1mError: \x1b[0mUnknown command \`${args[0]}\` (parameter 0)`, main);
                break;
            }
        }

        setup(main);
    }
};

function focusInput() {
    if (
        (typeof window.getSelection == "undefined" && typeof document.selection == "undefined") ||
        (document.selection != "undefined" && document.selection.createRange().text == "") ||
        (window.getSelection != "undefined" && window.getSelection().toString() == "")
    ) {
        document.getElementById("mainInput").focus();
        return false;
    }
}

write("PAX CLI [version 1.0.0.1]\n(c) Starlight Interactive. All rights reserved.\n", main);
setup(main);
