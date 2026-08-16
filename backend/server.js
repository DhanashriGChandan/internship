const express = require("express");
const cors = require("cors");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const analyzeURL = require("./utils/urlAnalyzer");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

const databasePath = path.join(__dirname, "database.json");




function readDatabase() {
  try {
    if (!fs.existsSync(databasePath)) {
      fs.writeFileSync(
        databasePath,
        JSON.stringify({ scans: [] }, null, 2)
      );
    }

    const data = fs.readFileSync(databasePath, "utf8");

    return JSON.parse(data);
  } catch (error) {
    console.error("Database read error:", error);

    return {
      scans: []
    };
  }
}


function writeDatabase(data) {
  fs.writeFileSync(
    databasePath,
    JSON.stringify(data, null, 2)
  );
}




app.get("/", (req, res) => {
  res.json({
    message: "PhishGuard Backend is Running"
  });
});




app.post("/api/scan", async (req, res) => {

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({
      message: "URL is required"
    });
  }

  try {




    const features = analyzeURL(url);

    if (features.error) {
      return res.status(400).json({
        message: features.error
      });
    }




    const mlResponse = await axios.post(
      "http://127.0.0.1:8000/predict",
      {
        URLLength: features.urlLength,

        IsHTTPS:
          features.hasHTTPS ? 1 : 0,

        NoOfSubDomain:
          features.numberOfSubdomains,

        NoOfOtherSpecialCharsInURL:
          features.numberOfSpecialCharacters,

        HasObfuscation: 0,

        NoOfObfuscatedChar: 0,

        NoOfQMarkInURL: 0,

        NoOfAmpersandInURL: 0,

        NoOfEqualsInURL: 0
      }
    );




    const mlPrediction =
      mlResponse.data;




    const scan = {

      id: Date.now(),

      url: url,

      timestamp:
        new Date().toISOString(),

      riskScore:
        features.riskScore,

      classification:
        features.classification,

      mlPrediction:
        mlPrediction.prediction,

      mlLabel:
        mlPrediction.label,

      confidence:
        mlPrediction.confidence,

      features: features
    };




    const database =
      readDatabase();

    database.scans.unshift(scan);

    database.scans =
      database.scans.slice(0, 500);

    writeDatabase(database);




    res.json({

      message:
        "URL analyzed successfully",

      url: url,

      features: features,

      mlPrediction:
        mlPrediction,

      scanId:
        scan.id

    });

  } catch (error) {

    console.error(
      "ML API Error:",
      error.message
    );

    res.status(500).json({

      message:
        "ML model service unavailable"

    });

  }

});




app.get("/api/history", (req, res) => {

  const database =
    readDatabase();

  res.json({
    scans: database.scans
  });

});




app.get("/api/stats", (req, res) => {

  const database =
    readDatabase();

  const scans =
    database.scans;


  const total =
    scans.length;


  const phishing =
    scans.filter(
      scan =>
        scan.mlPrediction === 1
    ).length;


  const suspicious =
    scans.filter(
      scan =>
        scan.mlPrediction !== 1 &&
        scan.riskScore >= 50
    ).length;


  const safe =
    total -
    phishing -
    suspicious;


  const averageRisk =
    total === 0
      ? 0
      : scans.reduce(
          (sum, scan) =>
            sum + scan.riskScore,
          0
        ) / total;


  const averageConfidence =
    total === 0
      ? 0
      : scans.reduce(
          (sum, scan) =>
            sum + scan.confidence,
          0
        ) / total;


  res.json({

    totalScans: total,

    phishingDetected:
      phishing,

    suspiciousDetected:
      suspicious,

    safeScans:
      safe,

    averageRisk:
      Number(averageRisk.toFixed(1)),

    averageConfidence:
      Number(
        (averageConfidence * 100)
          .toFixed(1)
      )

  });

});


app.delete(
  "/api/history",
  (req, res) => {

    writeDatabase({
      scans: []
    });

    res.json({
      message:
        "Scan history cleared"
    });

  }
);



app.listen(
  PORT,
  () => {

    console.log(
      `PhishGuard backend running on http://localhost:${PORT}`
    );

  }
);
