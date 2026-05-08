const express = require("express");

const cors = require("cors");

const app = express();

app.use(cors({ origin: "*" }));

app.use(express.json());

app.post("/chat", async (req, res) => {

  try {

    const message = req.body.message;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!message) {

      return res.status(400).json({ error: "No message provided" });

    }

    const response = await fetch(

      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,

      {

        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({

          contents: [

            {

              parts: [

                {

                  text: `You are a smart teacher. Answer clearly and simply:\n\n${message}`

                }

              ]

            }

          ]

        })

      }

    );

    const data = await response.json();

    const answer =

      data?.candidates?.[0]?.content?.parts

        ?.map(p => p.text || "")

        .join("\n") ||

      data?.error?.message ||

      "No answer found.";

    res.json({ answer });

  } catch (err) {

    res.status(500).json({ error: err.message });

  }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log("Chat server running on", PORT);

});
