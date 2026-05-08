const express = require("express");

const cors = require("cors");

const app = express();

// Middleware

app.use(cors({ origin: "*" }));

app.use(express.json({ limit: "10mb" }));

// Health check (عشان ما يظهرش Cannot GET /)

app.get("/", (req, res) => {

  res.json({

    status: "ok",

    message: "Chat API is running 🚀"

  });

});

// Chat endpoint

app.post("/chat", async (req, res) => {

  try {

    const message = req.body.message;

    if (!message) {

      return res.status(400).json({ error: "No message provided" });

    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {

      return res.status(500).json({

        error: "API key missing in environment variables"

      });

    }

    const response = await fetch(

      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,

      {

        method: "POST",

        headers: {

          "Content-Type": "application/json"

        },

        body: JSON.stringify({

          contents: [

            {

              parts: [

                {

                  text: `You are a smart teacher AI. Explain simply and clearly:\n\n${message}`

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

// Start server

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log("Chat server running on port", PORT);

});
