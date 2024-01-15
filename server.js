const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = process.env.PORT || 3000;

app.get('/scrape', async (req, res) => {
  try {
    const urlParam = req.query.url;
    if (!urlParam) {
      return res.status(400).json({ error: 'URL parameter is missing' });
    }

    const response = await axios.get(urlParam);

    if (response.status === 200) {
      const html = response.data;
      const $ = cheerio.load(html);

      // Now you can use Cheerio to select and manipulate elements
      // For example, let's extract the content of the third script tag
      const thirdScript = $('script').eq(2).html();

      // Parse the JSON data
      const jsonData = JSON.parse(thirdScript);

      // Respond with the extracted data
      res.json({
        videoName: jsonData.name,
        description: jsonData.description,
        thumbnailUrl: jsonData.thumbnailUrl[0],
        uploadDate: jsonData.uploadDate,
        contentUrl: jsonData.contentUrl,
        userInteractionCount: jsonData.interactionStatistic.userInteractionCount
      });
    } else {
      res.status(response.status).json({ error: `Error: ${response.status}` });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching the page' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
