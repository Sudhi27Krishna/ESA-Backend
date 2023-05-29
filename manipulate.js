const { spawn } = require('child_process');

async function manipulate(data) {
    return new Promise((resolve, reject) => {
        const jsonData = JSON.stringify(data);
        const pythonProcess = spawn('python', ['arrange.py', jsonData]);

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

module.exports = manipulate;