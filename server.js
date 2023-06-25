const express = require('express');
const axios = require('axios');
const fs = require('fs');
const util = require('util');
const app = express();
const port = 3000; // Choose the port you want to use

app.use(express.json());

// Create a Text-to-Speech client
const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
const client = new TextToSpeechClient();

// Define your API routes
app.post('/api/generate-audio', async (req, res) => {
  try {
    const { text } = req.body;

    // Set the text input to be synthesized
    const synthesisInput = {
      text: text,
    };

    // Select the language and voice type
    const voice = {
      languageCode: 'en-US',
      ssmlGender: 'FEMALE',
    };

    // Configure the audio encoding
    const audioConfig = {
      audioEncoding: 'MP3',
    };

    // Perform the text-to-speech request
    const [response] = await client.synthesizeSpeech({
      input: synthesisInput,
      voice: voice,
      audioConfig: audioConfig,
    });

    // Generate a unique filename for the audio file
    const filename = `audio_${Date.now()}.mp3`;
    const filePath = `path/to/save/${filename}`;

    // Use the "writeFile" function from the "fs" module
    const writeFile = util.promisify(fs.writeFile);
    await writeFile(filePath, response.audioContent, 'binary');

    // Return the URL of the generated audio file
    res.json({ audioUrl: `http://localhost:3000/${filename}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
