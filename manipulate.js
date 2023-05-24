const { spawn } = require('child_process');
const seatAllocationController = require('./controllers/seatAllocationController');
const data = seatAllocationController.allocationDetails;

const manipulate = () => {
    // Convert the data object to JSON string
    const jsonData = JSON.stringify(data);

    // Invoke the Python script with JSON data as an argument
    const pythonProcess = spawn('python', ['arrange.py', jsonData]);

    pythonProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
}

module.exports = manipulate;