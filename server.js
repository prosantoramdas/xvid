const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

app.post('/:url', async (req, res) => {
    try {
        const {url} = req.params;
        const response = await axios.get(url);
        const html = response.data;

        // Use cheerio to parse the HTML
        const $ = cheerio.load(html);

        // Select the third script tag and get its content
        const thirdScriptContent = $('script').eq(2).html();

        // Parse the JSON string into a JavaScript object
        const jsonObject = JSON.parse(thirdScriptContent);

        // Get the content URL from the object
        const contentUrl = jsonObject.contentUrl;

        // Send the content URL as a JSON response
        res.json({ contentUrl });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
