const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = process.env.PORT || 3000;
app.get('/', (req,res) =>{
  res.send('hi')
})

app.get('/scrape', async (req, res) => {
  try {
    const urlParam = req.query.url;
    if (!urlParam) {
      return res.status(400).json({ error: 'URL parameter is missing' });
    }

    // Launch a headless browser with Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to the specified URL
    await page.goto(urlParam);

    // Extract data from the page using Puppeteer
    const jsonData = await page.evaluate(() => {
      const thirdScript = document.querySelectorAll('script')[2].innerText;
      const parsedData = JSON.parse(thirdScript);

      return {
        videoName: parsedData.name,
        description: parsedData.description,
        thumbnailUrl: parsedData.thumbnailUrl[0],
        uploadDate: parsedData.uploadDate,
        contentUrl: parsedData.contentUrl,
        userInteractionCount: parsedData.interactionStatistic.userInteractionCount,
      };
    });

    // Respond with the extracted data
    res.json(jsonData);

    // Close the browser
    await browser.close();
  } catch (error) {
    res.status(500).json({ error: 'Error fetching the page' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
