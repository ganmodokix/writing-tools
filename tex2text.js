function convert(text, singleLine) {

    const textLines = text.split(/\r?\n/g);

    const convertedLines = [];

    let skippingLines = 0;

    for (let line of textLines) {

        // remove a comment at the ending of the line
        line = line.replace(/\s*%.*$/, "");

        // replace spaces
        line = line.replace(/~/g, " ");

        // replace citations with dummy one
        // e.g. the previous studies~\cite{Foobars1919}. -> the previous studies [42]
        line = line.replace(/\\cite{.*?}/g, "[42]");

        // replace references with dummy one
        // e.g. Just look at Fig.~\ref{fig:hoge}. -> Just look at Fig. 42.
        line = line.replace(/\\cref\{fig:.*?\}/g, "Fig. 42");
        line = line.replace(/\\cref{tab:.*?}/g, "Table 42");
        line = line.replace(/\\cref{sec:.*?}/g, "Section 42");
        line = line.replace(/\\cref{eq:.*?}/g, "Eq. (42)");
        line = line.replace(/\\ref{.*?}/g, "42");

        // sections
        line = line.replace(/\\section{(.*?)}/g, (match, p1, offset, string) => { skippingLines = 2; return `42. ${p1}`; });
        line = line.replace(/\\subsection{(.*?)}/g, (match, p1, offset, string) => { skippingLines = 2; return `42.1 ${p1}`; });
        line = line.replace(/\\subsubsection{(.*?)}/g, (match, p1, offset, string) => { skippingLines = 2; return `42.1.1 ${p1}`; });

        // remove newcommands
        line = line.replace(/\\newcommand{.*}/g, "");

        // miscellaneous
        line = line.replace(/\\text(it|bf){(.*?)}/g, "$2");
        line = line.replace(/\\emph{(.*?)}/g, "$1");
        line = line.replace(/\\etal/g, "et al.");
        line = line.replace(/\\ie/g, "i.e.");
        line = line.replace(/\\eg/g, "e.g.");
        line = line.replace(/\\etc/g, "etc.");
        line = line.replace(/\$\\alpha\$/g, "α");
        line = line.replace(/\$\\beta\$/g, "β");
        line = line.replace(/\$\\gamma\$/g, "γ");
        line = line.replace(/\$\\delta\$/g, "δ");
        line = line.replace(/\$\\epsilon\$/g, "ε");
        line = line.replace(/``|''/g, "\"");
        line = line.replace(/\\label{.*?}/g, "");
        line = line.replace(/\\editedpart{(.*?)}/g, "$1");
        line = line.replace(/\\@/g, "");
        line = line.replace(/\\[gG]ls{(.*?)}/g, (matched, term) => term.toUpperCase());
        line = line.replace(/\\[gG]lspl{(.*?)}/g, (matched, term) => term.toUpperCase() + "s");
        line = line.replace(/\\newacronym{.*?}{.*?}{.*?}/g, "");
        line = line.replace(/\\item/g, "");
        line = line.replace(/\\(begin|end)\{[^}]*?\}/g, "");

        // remove maths
        line = line.replace(/\$.*?\$/g, "[Math]");

        // remove indents
        line = line.replace(/^\s+/, "");

        // remove lines without anything but comments
        if (line.match(/^\s*$/)) {
            skippingLines++;
            continue;
        }

        if (singleLine) {
            line += skippingLines >= 2 ? "\n" : " ";
        } else {
            line += "\n";
        }

        convertedLines.push(line);
        skippingLines = 0;

    }

    const raw_result = convertedLines.join("");

    let result = raw_result;

    // result = result.replace(/\\begin{(.*?)}[^]*?\\end{\1}/g, "\n\n");
    result = result.replace(/\n{3,}/g, "\n\n");

    return result;

}

window.addEventListener("DOMContentLoaded", () => {

    /** @type {HTMLTextAreaElement} */
    const textareaIn = document.querySelector("textarea#in");
    /** @type {HTMLTextAreaElement} */
    const textareaOut = document.querySelector("textarea#out");
    
    /** @type {HTMLInputElement} */
    const checkSingleLine = document.querySelector("#singleLine")

    function requestUpdate() {

        window.requestAnimationFrame(() => {

            const rawTeX = textareaIn.value;
            const singleLine = checkSingleLine.checked;
            const convertedText = convert(rawTeX, !!singleLine);

            textareaOut.value = convertedText;

        });

    }

    checkSingleLine.addEventListener("change", requestUpdate);
    textareaIn.addEventListener("keyup", requestUpdate);

}, {once: true})
