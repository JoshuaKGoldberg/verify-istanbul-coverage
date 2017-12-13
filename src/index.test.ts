import { VerificationStatus, verifyCoverage, VerifyCoverageSettings } from "./index";
import { stubReportContents } from "./utils.test";

const stubSettings = (minimum: number, actual: number | string | undefined) => {
    const fileContents = stubReportContents(actual);
    const settings = {
        file: "test",
        minimum,
        readFile: () => Promise.resolve(fileContents),
    };

    return { fileContents, settings };
};

it("gives a passing result when coverage meets the minimum", async () => {
    // Arrange
    const minimum = 100;
    const actual = 100;
    const { fileContents, settings } = stubSettings(minimum, actual);

    // Act
    const result = await verifyCoverage(settings);

    // Assert
    expect(result).toEqual({
        file: settings.file,
        fileContents,
        minimum,
        status: VerificationStatus.Successful,
    });
});

it("gives a failing result when coverage doesn't meet the minimum", async () => {
    // Arrange
    const minimum = 100;
    const actual = 99;
    const { fileContents, settings } = stubSettings(minimum, actual);

    // Act
    const result = await verifyCoverage(settings);

    // Assert
    expect(result).toEqual({
        actual,
        file: settings.file,
        fileContents,
        minimum,
        status: VerificationStatus.Failed,
    });
});

it("gives an unknown result when coverage is incorrectly formatted", async () => {
    // Arrange
    const minimum = 100;
    const actual = 99;
    const { fileContents, settings } = stubSettings(minimum, undefined);

    // Act
    const result = await verifyCoverage(settings);

    // Assert
    expect(result).toEqual({
        error: "Could not parse coverage percentage from file.",
        file: settings.file,
        status: VerificationStatus.Unknown,
    });
});
