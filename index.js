const express = require('express')
const puppeteer = require('puppeteer');
const app = express();
const port = process.env.WINDGURU_SCRAPPER_PORT || 3000;

app.get('/:station', async (req, res) => {
    const station = req.params.station;

    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox','--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.goto(`https://www.windguru.cz/station/${station}`);
    
    const stationData = await page.evaluate(async (station) => {
        response = await fetch(`https://www.windguru.cz/int/iapi.php?q=station_data_current&id_station=${station}&date_format=Y-m-d+H%3Ai%3As+T`)
        return response.json()
    }, station);

    await browser.close();
    
    res.status(200).json(stationData)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});