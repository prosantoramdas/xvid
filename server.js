const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 3000;

app.get('/getImageSrc', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL parameter is required.' });
    }

    try {
        const response = await axios.get(url);

        if (response.status === 200) {
            const $ = cheerio.load(response.data);
            const thirdScriptContent = $('script').eq(2).html();

            // Parse the JSON string into a JavaScript object
            const jsonObject = JSON.parse(thirdScriptContent);

            // Get the content URL from the object
            const contentUrl = jsonObject.contentUrl;

            if (contentUrl) {
                res.send(contentUrl);
            } else {
                res.status(404).json({ error: 'Child img tag not found within element with itemprop="image".' });
            }
        } else {
            res.status(response.status).json({ error: `Failed to fetch the page. Status code: ${response.status}` });
        }
    } catch (error) {
        res.status(500).json({ error: `Error: ${error.message}` });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
