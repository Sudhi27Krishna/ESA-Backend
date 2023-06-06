const { spawn } = require('node:child_process');

async function createBranches(data) {
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