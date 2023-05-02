const path = require('path');

const fileUpload = (req, res) => {
    const files = req.files
        console.log(files)

        Object.keys(files).forEach(key => {
            // filepath needs to be changed
            const filepath = path.join(__dirname, 'uploadedExcels', files[key].name);
            files[key].mv(filepath, (err) => {
                if(err) return res.status(500).json({status: "error", message: err});
            })
        })

        manipulate(); // function for manipulation, needs to changed

        return res.json({ status: 'success', message: Object.keys(files).toString() });
}

module.exports = { fileUpload };