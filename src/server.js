const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3009;

app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})

app.post('/delete-file', (req, res) => {
    const fileName = req.body.filename;
    const filePath = path.join(__dirname, fileName);

    let message = '';

    try {
        fs.unlink(filePath, (err)=>{});
        message = `<p style="green">File ${fileName} deleted successfully.`;
    }
    catch (err) {
        if (err.code === 'ENOENT') message = `<p style="orange">File ${fileName} NOT FOUND!`;
        message = `<p style="red">Error deleting file ${fileName}: ${err.message}`
    }

    fs.readFile(path.join(__dirname, 'index.html'), 'utf8', (err, data) => {
        const finalHTML = data.replace('<p id="confirmation-message"></p>', `<p id="confirmation-message">${message}</p>`);
        res.send(finalHTML);
    })

})

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})