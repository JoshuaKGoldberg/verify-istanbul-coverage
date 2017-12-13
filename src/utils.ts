export const getActualCoverage = (fileContents: string): number | undefined => {
    // Corresponds to <h1>All files</h1>
    const indexOfH1 = fileContents.indexOf("</h1>");
    if (indexOfH1 === undefined) {
        return undefined;
    }

    // Corresponds to <span class="strong">XY% </span>
    const indexOfSpan = fileContents.indexOf("<span", indexOfH1);
    if (indexOfSpan === undefined) {
        return undefined;
    }

    // Corresponds to the starting > in the span
    const indexOfSpanContentsStart = fileContents.indexOf(">", indexOfSpan) + 1;
    if (indexOfSpanContentsStart === undefined) {
        return undefined;
    }

    // Corresponds to the ending < in the span
    const indexOfSpanContentsEnd = fileContents.indexOf("%", indexOfSpanContentsStart);
    if (indexOfSpanContentsEnd === undefined) {
        return undefined;
    }

    const sanitizedContents = fileContents
        .substring(indexOfSpanContentsStart, indexOfSpanContentsEnd)
        .trim();

    const percentage = parseInt(sanitizedContents, 10);

    return isFinite(percentage) ? percentage : undefined;
};
