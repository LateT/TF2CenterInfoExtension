const port = 3001;
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const cors = require('cors');

app.use(cors({
    origin: "https://tf2center.com",
    methods: "GET,POST",
    optionsSuccessStatus: 200
}));

app.use(bodyParser.json());
app.post("/data", async (req,res) => {
    const postData = req.body;
    console.log(postData.steamid);
    const resData = await getEtf2l(postData.steamid);
    console.log(resData);
    res.send(resData);

})
// "https://api-v2.etf2l.org/player/" + steamId +"/results"

app.listen(port, () => {
    console.log("Listening ", port);
});

const getEtf2l = async (steamId) => {
    try {
        const r = await axios.get("https://api-v2.etf2l.org/player/" + steamId +"/results");
    const d = r.data;
    console.log(d);
    return d;
    } catch (err) {
        if (err == "AxiosError: Request failed with status code 404") {
            return "404";
        }
    }
    
}
