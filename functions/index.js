const express = require("express");

const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json({ limit: "10mb" }));

app.post("/solveHomework", async (req, res) => {

  try {

    const image = req.body.image;

    const apiKey = process.env.GEMINI_API_KEY;

    const response = await fetch(

      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,

      {

        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({

          contents: [

            {

              parts: [

                {

                  text: "Solve this homework image clearly for a student. Give direct answers."

                },

                {

                  inline_data: {

                    mime_type: "image/jpeg",

                    data: image

                  }

                }

              ]

            }

          ]

        })

      }

    );

    const data = await response.json();

    const answer =

      data.candidates?.[0]?.content?.parts?.[0]?.text || "No answer found.";

    res.json({ answer });

  } catch (err) {

    res.status(500).json({ error: err.message });

  }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log("Server running on", PORT));
