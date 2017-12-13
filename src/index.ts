import { getActualCoverage } from "./utils";

export interface VerifyCoverageSettings {
    file: string;
    minimum: number;
    readFile: ReadFile;
}

export type ReadFile = (filePath: string | number | Buffer) => Promise<string | Buffer>;

export type VerificationResult = FailedVerificationResult | SuccessfulVerificationResult | UnknownVerificationResult;

export enum VerificationStatus {
    Failed,
    Successful,
    Unknown,
}

export interface FailedVerificationResult {
    actual: number;
    file: string;
    fileContents: string;
    minimum: number;
    status: VerificationStatus.Failed;
}

export interface SuccessfulVerificationResult {
    file: string;
    fileContents: string;
    minimum: number;
    status: VerificationStatus.Successful;
}

export interface UnknownVerificationResult {
    error: string;
    file: string;
    status: VerificationStatus.Unknown;
}

export const defaultFilePath = "./coverage/lcov-report/index.html";

export const defaultMinimum = 100;

const fillInSettings = async (settings: Partial<VerifyCoverageSettings>): Promise<VerifyCoverageSettings> => ({
    file: settings.file === undefined ? defaultFilePath : settings.file,
    minimum: settings.minimum === undefined ? defaultMinimum : settings.minimum,
    readFile: settings.readFile === undefined ? (await import("mz/fs")).readFile : settings.readFile,
});

export const verifyCoverage =
    async (settings: Partial<VerifyCoverageSettings> = {}): Promise<VerificationResult> => {
        const { file, minimum, readFile } = await fillInSettings(settings);

        const fileContents = (await readFile(file)).toString();
        const actual = getActualCoverage(fileContents);
        if (actual === undefined) {
            return {
                error: "Could not parse coverage percentage from file.",
                file,
                status: VerificationStatus.Unknown,
            };
        }

        return actual < minimum
            ? {
                actual,
                file,
                fileContents,
                minimum,
                status: VerificationStatus.Failed,
            }
            : {
                file,
                fileContents,
                minimum,
                status: VerificationStatus.Successful,
            };
    };
