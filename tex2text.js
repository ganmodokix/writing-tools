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

        converted_lines.push(line);

    }

    return converted_lines.join("\n");

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