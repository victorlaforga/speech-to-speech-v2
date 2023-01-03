// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');
const googleAuth = require('google-auth-library');
// Import other required libraries
const fs = require('fs');
const util = require('util');


const client = new textToSpeech.TextToSpeechClient(
    {
        "type": "service_account",
        "project_id": "careful-airfoil-372120",
        "private_key_id": "37289c1605a3dd1f002fa1326efce0d5eeb2a38e",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDe0Kj9vnx9bg4A\noA0fsAC0lZ/Ch/mu+43zAMs8/f6I5MwcgQS0IHPQx8JFtOLfdVRVC9Bwk43WFR2B\nqbOIfpFQGLzn6lHfVh6ZB7vdE28nr3uLeRJEXXKQ/dS5WUwB91bk8F/3GgMpjH3s\nuNmpQn9nKCh8a/qF8uSoSNBR/tfD2p13nemcj8x+nvmYqNjHkddAuXTYt/1PKQ/b\nVrizPifOYlf7H11Jv5SmhXwLVCyJ6H0SXSCZttW9u38OOyYp9gSjI199PwIYui9p\na98o00DetzQArAkS/M+XsaLgjPPXW5YjK2wTELtlHJAAPD6Znl9GXvP7DGal6Ilz\nnOdIsH5FAgMBAAECggEAFIpEwduBC2kNVmZqv0yQzBTs/NhfHo/nBotAsRczEziQ\nTmJgZiCFvK3ljVp+/Z2J0Cs+JFqd3SnmJfFYcRFF4Q3ewDxcHswIFxBc86TaftyQ\n9YsMMYwxxwb3SLzgImBEPOeh2RwnRXnDlAJ4Yj+UkhRkIxArMJTzGkZYGe71wgKl\nl4vfhUnIuKOOENG31bhnUVQuqIMA6i0kC/mYzRqsEBUi31NPuEDJpmWjtvB3oJYw\n8SBWjpWW0z01+bN/SBeWIC92J+DRNVRkNWZWMjyBD44ZiGMC+LhdndDd5GiCzihr\nwBUnTRYOpZf95Gz1UjxhG8Tjpa1M3awfo1V4dSTHAQKBgQD/CQZvXFIbXEL86YLI\nBL7mjYDm/7UeOkeIQIBa/R0OVuj+g7ep5BkX8V3Ldr658V68BBnxOY08rfdek4V8\nNHTVHUl0b2pd7mFoLPlqDzaU2WimEQJNq+f0jPBSyr7dQveYqlZr9KxV48WB/sMH\nj+dIOriYenE6Vy5p3Ufc48Q2gQKBgQDfqG7hfMI8cM1kKnGcbU3Sb3ybSwgbj+53\nI0YzDc0mfFwXqXDETSh44t0mYCjyf4ueCquFsaQE3gScQZzFKLf8lAruEcBXNXHG\n7VrZ7MWyvAPTLNk9JAg8N9dhclpgyjIJGnhbBWXTzBo081kmH2bnlK+kCwr5VVEL\ngQOAYO4NxQKBgQCx+fNirXOjIlyhMLgSq7UpIaDOE66qfJNE03Z/iNnJEv+f9f2q\n8sJMQiVpguGQ049/+AC+paIZsXHKr3pc9iJ+QuTq+4GoMV4KnDAmQp2dfKcaFQ6d\nc5T4xY5EyLYvpLcy89RBnErT2ZMQp+Akm9kUP95okjIIO6TpPgITdWONgQKBgQCA\nkClspHJim9T0xxEXgh1B4aQXAEJg1ZOWGEi6ACz0+ndVgqi3rkKdeor1DEF9Y6O1\n7Rw7dal6wsSTrYOYMZfRMKg3wSx29Nm6J6YZrujVnQ31zcnyQ0wYkWDVOw6IpLGu\nWfDlIW0vGhvWZCvSpipY5DcybMaaHFjB7B8/JHiyoQKBgQDa6m9gEe5YLWTOV067\nVN82sQdANhK7084ncNDgsXCLem2eO7rh9l47faWRdF3GAkuh/aUB9O8IZ3pcxmJM\n5gbVFFLsdpm5UHt5GWBc37ZbMj+Jqzp2E7vady6u+tKDptp+gIp/1v6HSYp3Q6pG\nCeOy5B/cnME+G+xHmcZ2EuXtCQ==\n-----END PRIVATE KEY-----\n",
        "client_email": "afstudeer-app@careful-airfoil-372120.iam.gserviceaccount.com",
        "client_id": "110031236783182593175",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/afstudeer-app%40careful-airfoil-372120.iam.gserviceaccount.com"
    }


);
async function quickStart() {
    // The text to synthesize
    const text = 'hello, world!';

    // Construct the request
    const request = {
        input: { text: text },
        // Select the language and SSML voice gender (optional)
        voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
        // select the type of audio encoding
        audioConfig: { audioEncoding: 'MP3' },
    };

    // Performs the text-to-speech request
    const [response] = await client.synthesizeSpeech(request);
    // Write the binary audio content to a local file
    const writeFile = util.promisify(fs.writeFile);
    await writeFile('output.mp3', response.audioContent, 'binary');
    console.log('Audio content written to file: output.mp3');
}
quickStart();
