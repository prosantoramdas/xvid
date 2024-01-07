const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 3000;

app.get('/getVideoContent', async (req, res) => {
    // Extract the URL parameter from the request
    const { url } = req.query;

    // Check if the URL parameter is provided
    if (!url) {
        return res.status(400).json({ error: 'URL parameter is required.' });
    }

    try {
        // Make a GET request to the specified URL using Axios
        const response = await axios.get(url);

        // Check if the request was successful (status code 200)
        if (response.status === 200) {
            // Load the HTML content using Cheerio
            const $ = cheerio.load(response.data);

            // Extract the content of the third <script> tag
            const thirdScriptContent = $('script').eq(2).html();

            // Parse the JSON string into a JavaScript object
            const jsonObject = JSON.parse(thirdScriptContent);

            // Get the content URL from the object
            const contentUrl = jsonObject.contentUrl;

            // Check if contentUrl is found
            if (contentUrl) {
                // Attempt to fetch the content from the specified URL
                const contentResponse = await axios.get(contentUrl, { responseType: 'arraybuffer' });

                // Check if the content fetch was successful
                if (contentResponse.status === 200) {
                    // Convert the buffer to a base64 string
                    const base64Data = Buffer.from(contentResponse.data).toString('base64');

                    // Respond with a data URI for embedding in the video tag
                    res.send(`data:video/mp4;base64,${base64Data}`);
                } else {
                    // Respond with an error if the content fetch fails
                    res.status(contentResponse.status).json({ error: `Failed to fetch content. Status code: ${contentResponse.status}` });
                }
            } else {
                // Respond with a 404 error if contentUrl is not found
                res.status(404).json({ error: 'Child img tag not found within element with itemprop="image".' });
            }
        } else {
            // Respond with the status code and error message if the request fails
            res.status(response.status).json({ error: `Failed to fetch the page. Status code: ${response.status}` });
        }
    } catch (error) {
        // Respond with a 500 error and the error message if an exception occurs
        res.status(500).json({ error: `Error: ${error.message}` });
    }
});

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
