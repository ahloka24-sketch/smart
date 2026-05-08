const express = require("express");

const cors = require("cors");

const app = express();

// Middleware

app.use(cors({ origin: "*" }));

app.use(express.json({ limit: "20mb" }));

// الصفحة الرئيسية للتأكد أن السيرفر يعمل

app.get("/", (req, res) => {

  res.json({

    status: "ok",

    message: "Smart Teacher AI API is running 🚀",

    endpoints: {

      health: "/health",

      chat: "/chat",

      solveHomework: "/solveHomework"

    }

  });

});

// فحص صحة السيرفر والمفتاح

app.get("/health", async (req, res) => {

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {

    return res.status(500).json({

      status: "error",

      message: "GEMINI_API_KEY is missing"

    });

  }

  try {

    const testResponse = await fetch(

      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`

    );

    const testData = await testResponse.json();

    if (testData.error) {

      return res.status(500).json({

        status: "error",

        message: testData.error.message

      });

    }

    res.json({

      status: "ok",

      message: "API key is valid ✅"

    });

  } catch (err) {

    res.status(500).json({

      status: "error",

      message: err.message

    });

  }

});

// دردشة نصية

app.post("/chat", async (req, res) => {

  try {

    const message = req.body.message;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {

      return res.status(500).json({

        error: "GEMINI_API_KEY is missing"

      });

    }

    if (!message) {

      return res.status(400).json({

        error: "No message provided"

      });

    }

    const response = await fetch(

      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,

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

                  text:

                    "You are Smart Teacher AI. Explain clearly and simply for students.\n\n" +

                    message

                }

              ]

            }

          ]

        })

      }

    );

    const data = await response.json();

    if (data.error) {

      return res.status(500).json({

        error: data.error.message

      });

    }

    const answer =

      data?.candidates?.[0]?.content?.parts

        ?.map((p) => p.text || "")

        .join("\n") || "No answer found.";

    res.json({ answer });

  } catch (err) {

    res.status(500).json({

      error: err.message

    });

  }

});

// حل الواجب باستخدام صورة + سؤال

app.post("/solveHomework", async (req, res) => {

  try {

    const { image, question } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {

      return res.status(500).json({

        error: "GEMINI_API_KEY is missing"

      });

    }

    if (!image) {

      return res.status(400).json({

        error: "No image provided"

      });

    }

    const prompt =

      question && question.trim()

        ? `You are a professional teacher. Solve the homework shown in the image and answer this request clearly for the student:\n\n${question}`

        : "You are a professional teacher. Solve the homework shown in the image clearly and simply for the student.";

    const response = await fetch(

      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,

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

                  text: prompt

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

    if (data.error) {

      return res.status(500).json({

        error: data.error.message

      });

    }

    const answer =

      data?.candidates?.[0]?.content?.parts

        ?.map((p) => p.text || "")

        .join("\n") || "No answer found.";

    res.json({ answer });

  } catch (err) {

    res.status(500).json({

      error: err.message

    });

  }

});

// تشغيل السيرفر

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(`Smart Teacher AI running on port ${PORT}`);

})
