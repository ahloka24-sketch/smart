const functions = require("firebase-functions");

const cors = require("cors")({ origin: true });

exports.solveHomework = functions.https.onRequest(async (req, res) => {

  cors(req, res, async () => {

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

                    text: "Solve this homework image clearly for a student. Give direct final answers and simple explanation."

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

    } catch (error) {

      res.status(500).json({ error: error.message });

    }

  });

});
