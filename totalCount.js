const { spawn } = require('node:child_process');

async function totalCount(data) {
    console.log(data);
    return new Promise((resolve, reject) => {
        const jsonData = JSON.stringify(data);
        const pythonProcess = spawn('python', ['totalStudents.py', jsonData]);

        let result = '';

        // Capture the output from the Python script
        pythonProcess.stdout.on('data', (data) => {
            result += data.toString();
        });

        // Handle any error that occurs
        pythonProcess.stderr.on('data', (data) => {
            reject(data.toString());
        });

        // Resolve with the result when the Python script finishes
        pythonProcess.on('close', (code) => {
            if (code === 0) {
                const parsedResult = parseInt(result);
                if (!isNaN(parsedResult)) {
                    resolve(parsedResult);
                } else {
                    reject('Invalid output format from Python script');
                }
            } else {
                reject(`Python script exited with code ${code}`);
            }
        });

        pythonProcess.on('error', (error) => {
            console.error(`child process encountered an error: ${error}`);
            reject(error);
        });
    });
}

module.exports = totalCount;