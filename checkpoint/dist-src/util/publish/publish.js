import execa from "execa";
import inquirer from "inquirer";
const pkgPublish = (pkgManager, options) => {
    const args = ["publish"];
    if (options.contents) {
        args.push(options.contents);
    }
    else {
        args.push('pkg');
    }
    if (options.yarn) {
        args.push("--new-version", options.version);
    }
    if (options.tag) {
        args.push("--tag", options.tag);
    }
    if (options.otp) {
        args.push("--otp", options.otp);
    }
    if (options.publishScoped) {
        args.push("--access", "public");
    }
    return execa(pkgManager, args);
};
async function handleError(error, pkgManager, task, options) {
    if (error.stderr.includes("one-time pass") ||
        error.message.includes("user TTY") ||
        error.message.includes("One-Time-Password")) {
        const answers = await inquirer.prompt([
            {
                type: "input",
                name: "otp",
                message: `[${task}] 2FA/OTP code required:`
            }
        ]);
        return pkgPublish(pkgManager, Object.assign({}, options, { otp: answers.otp })).catch((err) => {
            return handleError(err, pkgManager, task, options);
        });
    }
}
export function publish(pkgManager, task, options) {
    return pkgPublish(pkgManager, options).catch((err) => {
        return handleError(err, pkgManager, task, options);
    });
}
