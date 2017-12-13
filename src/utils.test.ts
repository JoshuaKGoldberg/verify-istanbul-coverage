import { getActualCoverage } from "./utils";

export const stubReportContents = (actual: number | string | undefined) => `
    <!doctype html>
    <html lang="en">
    <head>
        <title>Coverage</title>
    </head>
    <body>
        <h1>
            Coverage
        </h1>
        <span class="strong">${actual}% </span>
    </body>
    `;

it("retrieves 100 when the coverage is correctly formatted as 100%", () => {
    // Arrange
    const expected = 100;
    const contents = stubReportContents(expected);

    // Act
    const coverage = getActualCoverage(contents);

    // Assert
    expect(coverage).toBe(expected);
});

it("retrieves 12 when the coverage is correctly formatted as 12%", () => {
    // Arrange
    const expected = 12;
    const contents = stubReportContents(expected);

    // Act
    const coverage = getActualCoverage(contents);

    // Assert
    expect(coverage).toBe(expected);
});

it("retrieves nothing when the coverage is missing", () => {
    // Arrange
    const contents = stubReportContents(undefined);

    // Act
    const coverage = getActualCoverage(contents);

    // Assert
    expect(coverage).toBeUndefined();
});

it("retrieves nothing when the coverage is incorrectly formatted", () => {
    // Arrange
    const contents = stubReportContents("<12");

    // Act
    const coverage = getActualCoverage(contents);

    // Assert
    expect(coverage).toBeUndefined();
});
