const express = require("express");
const axios = require("axios");
const app = express();

const { LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET, LINKEDIN_REDIRECT_URI } = process.env;

app.get("/linkedin/callback", async (req, res) => {
  const code = req.query.code;
  const state = req.query.state;

  if (!code) {
    return res.status(400).send("Missing 'code'");
  }

  try {
    const tokenResponse = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      null,
      {
        params: {
          grant_type: "authorization_code",
          code,
          redirect_uri: LINKEDIN_REDIRECT_URI,
          client_id: LINKEDIN_CLIENT_ID,
          client_secret: LINKEDIN_CLIENT_SECRET
        }
      }
    );

    const accessToken = tokenResponse.data.access_token;
    console.log("Access token:", accessToken);

    res.send(`
      <h1>LinkedIn OAuth Test OK</h1>
      <p>Token wurde erfolgreich geholt (siehe Logs auf Render).</p>
    `);
  } catch (e) {
    console.error(e.response?.data || e.message);
    res.status(500).send("Error exchanging code");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
