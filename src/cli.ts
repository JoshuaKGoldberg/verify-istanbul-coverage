import chalk from "chalk";

import { VerificationStatus, verifyCoverage } from "./index";

// tslint:disable no-console

interface Logger {
    error(message: string): void;
    log(message: string): void;
}

const enum ExitCode {
    Error = 1,
    InvalidInput = 2,
    NotEnoughCoverage = 3,
    Success = 0,
    Unknown = 4,
}

const getArgValue = (args: string[], key: string, shorthand: string): string | undefined => {
    for (let i = 0; i < args.length; i += 1) {
        if (args[i] === `--${key}` || args[i] === `-${shorthand}`) {
            return args[i + 1];
        }
    }

    return undefined;
};

export const runCli = async (args: string[], logger: Logger): Promise<ExitCode> => {
    if (getArgValue(args, "help", "h")) {
        logger.log(chalk.bold("verify-istanbul-coverage"));
        logger.log("Usage:");
        logger.log("    verify-istanbul-coverage [--file <coverage-file>] [--minimum <number>]");

        return ExitCode.Success;
    }

    const file = getArgValue(args, "file", "f");
    const rawMinimum = getArgValue(args, "minimum", "m");
    const minimum = rawMinimum === undefined
        ? undefined
        : parseInt(rawMinimum, 10);

    if (rawMinimum !== undefined && minimum !== undefined && !isFinite(minimum)) {
        logger.error([
            chalk.red("Unknown --minimum/-m: "),
            chalk.redBright(rawMinimum),
        ].join(""));

        return ExitCode.InvalidInput;
    }

    const result = await verifyCoverage({ file, minimum });

    switch (result.status) {
        case VerificationStatus.Failed:
            logger.error([
                chalk.red("Coverage does not meet the minimum bar of "),
                chalk.redBright(`${result.minimum}`),
                chalk.red("%. Found "),
                chalk.redBright(`${result.actual}`),
                chalk.red("%."),
            ].join(""));

            return ExitCode.NotEnoughCoverage;

        case VerificationStatus.Successful:
            logger.log([
                chalk.green("Coverage meets the minimum bar of "),
                chalk.greenBright(`${result.minimum}`),
                chalk.green("%."),
            ].join(""));

            return ExitCode.Success;

        case VerificationStatus.Unknown:
            logger.error([
                chalk.red("Could not calculate coverage: "),
                chalk.redBright(`${result.error}`),
            ].join(""));

            return ExitCode.Unknown;
    }
};
