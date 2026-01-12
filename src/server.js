const express = require('express');
const path = require('path');
const fs = require('fs/promises');

const app = express();
const port = 3009;

app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})

app.post('/delete-file', async (req, res) => {
    const fileName = req.body.filename;
    const filePath = path.join(__dirname, fileName);

    let message = '';

    try {
        await fs.unlink(filePath);
        message = `<p style="color: green">File ${fileName} deleted successfully.`;
    }
    catch (err) {
        if (err.code === 'ENOENT') {
            message = `<p style="color: orange">File ${fileName} NOT FOUND!</p>`;
        }
        else {
            message = `<p style="color: red">Error deleting file ${fileName}: ${err.message}</p>`;
        }
    }

    const data = await fs.readFile(path.join(__dirname, 'index.html'), 'utf8');
    const finalHTML = data.replace('<p id="confirmation-message"></p>', `<p id="confirmation-message">${message}</p>`);
    res.send(finalHTML);

})

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})