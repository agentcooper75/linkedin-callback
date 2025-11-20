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
          redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
          client_id: process.env.LINKEDIN_CLIENT_ID,
          client_secret: process.env.LINKEDIN_CLIENT_SECRET
        }
      }
    );

    const accessToken = tokenResponse.data.access_token;
    const expiresIn = tokenResponse.data.expires_in;

    console.log("Access Token erhalten:", accessToken);

    // 🔹 WICHTIG: Redirect in die App (Scheme = pia://)
    const appUrl = `pia://linkedin-callback?access_token=${encodeURIComponent(accessToken)}&expires_in=${expiresIn}`;

    console.log("Redirecting to iOS App:", appUrl);
    return res.redirect(appUrl);
  } catch (e) {
    console.error(e.response?.data || e.message);
    return res.status(500).send("Error exchanging code");
  }
});

