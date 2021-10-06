function convert(text) {

    const text_lines = text.split(/\r?\n/g);

    const converted_lines = [];

    for (let line of text_lines) {

        // remove lines without anything but comments
        if (line.match(/^\s*%.*/)) {
            continue;
        }

        // remove a comment at the ending of the line
        line = line.replace(/\s*%.*$/, "");

        // replace spaces
        line = line.replace(/~/g, " ");

        // replace citations with dummy one
        // e.g. the previous studies~\cite{Foobars1919}. -> the previous studies [42]
        line = line.replace(/\\cite{.*?}/g, "[42]");

        // replace references with dummy one
        // e.g. Just look at Fig.~\ref{fig:hoge}. -> Just look at Fig. 42.
        line = line.replace(/\\ref{.*?}/g, "42");

        // sections
        line = line.replace(/\\section{(.*?)}/g, (match, p1, offset, string) => { return `42. ${p1}`; });
        line = line.replace(/\\subsection{(.*?)}/g, (match, p1, offset, string) => { return `42.1 ${p1}`; });
        line = line.replace(/\\subsubsection{(.*?)}/g, (match, p1, offset, string) => { return `42.1.1 ${p1}`; });

        // remove newcommands
        line = line.replace(/\\newcommand{.*}/g, "");

        // miscellaneous
        line = line.replace(/\\text(it|bm){(.*?)}/g, "$2");
        line = line.replace(/\\etal/g, "et al.");
        line = line.replace(/\\ie/g, "i.e.");
        line = line.replace(/\\eg/g, "e.g.");
        line = line.replace(/\$\\alpha\$/g, "α");
        line = line.replace(/\$\\beta\$/g, "β");
        line = line.replace(/\$\\gamma\$/g, "γ");
        line = line.replace(/\$\\delta\$/g, "δ");
        line = line.replace(/\$\\epsilon\$/g, "ε");
        line = line.replace(/``|''/g, "\"");
        line = line.replace(/\\label{.*?}/g, "");

        // remove maths
        line = line.replace(/\$.*?\$/g, "[Math]");

        converted_lines.push(line);

    }

    const raw_result = converted_lines.join("\n");

    let result = raw_result;

    result = result.replace(/\\begin{(.*?)}[^]*?\\end{\1}/g, "\n\n");
    result = result.replace(/\n{3,}/g, "\n\n");

    return result;

}

window.addEventListener("DOMContentLoaded", () => {

    const textareaIn = document.querySelector("textarea#in");
    const textareaOut = document.querySelector("textarea#out");

    textareaIn.addEventListener("keyup", () => {

        window.requestAnimationFrame(() => {

            const rawTeX = textareaIn.value;
            const convertedText = convert(rawTeX);

            textareaOut.value = convertedText;

        });

    });

}, {once: true})