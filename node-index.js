const express = require('express')
const app = express()
const port = 3000
const fs = require('fs');
const textToSpeech = require('@google-cloud/text-to-speech');
const util = require('util');


const client = new textToSpeech.TextToSpeechClient();


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})
app.get("/speak", async (req, res) => {
    // let fileName = "output.mp3";
    // fileName = fileName.replaceAll("'", "")
    // let filePath = __dirname + "\\public\\audio-files\\" + fileName;
    // const request = {
    //     input: { text: req.query.speaktext },
    //     // Select the language and SSML voice gender (optional)
    //     voice: { languageCode: 'nl-NL', ssmlGender: 'FEMALE' },
    //     // select the type of audio encoding
    //     audioConfig: { audioEncoding: 'MP3' },
    // };

    // Performs the text-to-speech request
    // const [response] = await client.synthesizeSpeech(request);
    // // Write the binary audio content to a local file
    // const writeFile = util.promisify(fs.writeFile);
    // await writeFile(filePath, response.audioContent, 'binary');
    // console.log("Should have written file");
    var stat = fs.statSync(filePath);
    range = req.headers.range;
    var readStream;
    // if there is no request about range
    if (range !== undefined) {
        // remove 'bytes=' and split the string by '-'
        var parts = range.replace(/bytes=/, "").split("-");

        var partial_start = parts[0];
        var partial_end = parts[1];

        if ((isNaN(partial_start) && partial_start.length > 1) || (isNaN(partial_end) && partial_end.length > 1)) {
            return res.sendStatus(500);
        }
        // convert string to integer (start)
        var start = parseInt(partial_start, 10);
        // convert string to integer (end)
        // if partial_end doesn't exist, end equals whole file size - 1
        var end = partial_end ? parseInt(partial_end, 10) : stat.size - 1;
        // content length
        var content_length = (end - start) + 1;

        res.status(206).header({
            'Content-Type': 'audio/mpeg',
            'Content-Length': content_length,
            'Content-Range': "bytes " + start + "-" + end + "/" + stat.size
        });

        // Read the stream of starting & ending part
        readStream = fs.createReadStream(filePath, { start: start, end: end });
    } else {
        res.header({
            'Content-Type': 'audio/mpeg',
            'Content-Length': stat.size
        });
        readStream = fs.createReadStream(filePath);
    }
    readStream.pipe(res);
    res.sendFile(filePath);
    // res.sendFile(__dirname + '/public/audio-files/test.mp3')

})
app.use(express.static('public'));
app.get("/test", async (req, res) => {
    var fileName = __dirname + '\\output.mp3'; // filepath
    var stat = fs.statSync(fileName);
    range = req.headers.range;
    var readStream;
    // if there is no request about range
    if (range !== undefined) {
        // remove 'bytes=' and split the string by '-'
        var parts = range.replace(/bytes=/, "").split("-");

        var partial_start = parts[0];
        var partial_end = parts[1];

        if ((isNaN(partial_start) && partial_start.length > 1) || (isNaN(partial_end) && partial_end.length > 1)) {
            return res.sendStatus(500);
        }
        // convert string to integer (start)
        var start = parseInt(partial_start, 10);
        // convert string to integer (end)
        // if partial_end doesn't exist, end equals whole file size - 1
        var end = partial_end ? parseInt(partial_end, 10) : stat.size - 1;
        // content length
        var content_length = (end - start) + 1;

        res.status(206).header({
            'Content-Type': 'audio/mpeg',
            'Content-Length': content_length,
            'Content-Range': "bytes " + start + "-" + end + "/" + stat.size
        });

        // Read the stream of starting & ending part
        readStream = fs.createReadStream(fileName, { start: start, end: end });
    } else {
        res.header({
            'Content-Type': 'audio/mpeg',
            'Content-Length': stat.size
        });
        readStream = fs.createReadStream(fileName);
    }
    readStream.pipe(res);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})