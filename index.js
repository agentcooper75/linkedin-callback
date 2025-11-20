const express = require("express");
const axios = require("axios");
const app = express();

const { LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET, LINKEDIN_REDIRECT_URI } = process.env;

app.get("/linkedin/callback", async (req, res) => {
  const code = req.query.code;

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
          client_secret: LINKEDIN_CLIENT_SECRET,
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;
    const expiresIn = tokenResponse.data.expires_in;

    console.log("Access Token:", accessToken);

    // iOS Redirect (nur für Testzwecke!)
    const appUrl = `pia://linkedin-callback?access_token=${encodeURIComponent(accessToken)}&expires_in=${expiresIn}`;

    console.log("Redirecting to:", appUrl);
    return res.redirect(appUrl);
  } catch (e) {
    console.error(e?.response?.data || e.message);
    return res.status(500).send("Error exchanging code");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});


