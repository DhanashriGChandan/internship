function analyzeURL(inputURL) {
  try {
    const parsedURL = new URL(inputURL);

    const hostname = parsedURL.hostname;

    const features = {
      urlLength: inputURL.length,

      hasHTTPS: parsedURL.protocol === "https:",

      numberOfDots: (hostname.match(/\./g) || []).length,

      numberOfSubdomains: Math.max(
        hostname.split(".").length - 2,
        0
      ),

      hasIPAddress: /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname),

      hasAtSymbol: inputURL.includes("@"),

      hasHyphen: hostname.includes("-"),

      hasSuspiciousKeyword:
        /login|verify|account|secure|update|bank|password|signin/i.test(
          inputURL
        ),

      numberOfSpecialCharacters:
        (inputURL.match(/[^a-zA-Z0-9]/g) || []).length
    };

let riskScore = 0;

if (!features.hasHTTPS) {
  riskScore += 20;
}

if (features.urlLength > 75) {
  riskScore += 15;
}

if (features.numberOfSubdomains > 2) {
  riskScore += 15;
}

if (features.hasIPAddress) {
  riskScore += 25;
}

if (features.hasAtSymbol) {
  riskScore += 20;
}

if (features.hasHyphen) {
  riskScore += 5;
}

if (features.hasSuspiciousKeyword) {
  riskScore += 20;
}

if (features.numberOfSpecialCharacters > 10) {
  riskScore += 10;
}

riskScore = Math.min(riskScore, 100);

features.riskScore = riskScore;

features.classification =
  riskScore >= 50 ? "Suspicious" : "Likely Safe";
console.log("RISK SCORE TEST:", riskScore);
return features;

  } catch (error) {
    return {
      error: "Invalid URL"
    };
  }
}

module.exports = analyzeURL;
