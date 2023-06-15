const { spawn } = require('node:child_process');
const { promisify } = require('node:util');

const exec = promisify(require('node:child_process').exec);

async function isPackageInstalled(packageName) {
    try {
        await exec(`pip show ${packageName}`);
        return true;
    } catch (error) {
        return false;
    }
}

async function installPackage(packageName) {
    try {
        await exec(`pip install ${packageName}`);
        console.log(`${packageName} package installed successfully.`);
    } catch (error) {
        console.error(`Failed to install ${packageName} package: ${error}`);
    }
}

async function ensurePackageInstalled(packageName) {
    const isInstalled = await isPackageInstalled(packageName);
    if (!isInstalled) {
        console.log(`${packageName} package is not installed. Installing...`);
        await installPackage(packageName);
    }
}

async function createBranches(data) {
    // Ensure openpyxl package is installed
    await ensurePackageInstalled('openpyxl');
    return new Promise((resolve, reject) => {
        // Convert the data object to JSON string
        const jsonData = JSON.stringify(data);
        // Invoke the Python script with JSON data as an argument
        const pythonProcess = spawn('python', ['branches.py', jsonData]);

        pythonProcess.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        pythonProcess.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            resolve(code);
        });

        pythonProcess.on('error', (error) => {
            console.error(`child process encountered an error: ${error}`);
            reject(error);
        });
    });
}

module.exports = createBranches;