import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:5000";

function App() {
  const [page, setPage] = useState("dashboard");
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({
    totalScans: 0,
    phishingDetected: 0,
    suspiciousDetected: 0,
    safeScans: 0,
    averageRisk: 0,
    averageConfidence: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [historyResponse, statsResponse] = await Promise.all([
        fetch(`${API}/api/history`),
        fetch(`${API}/api/stats`),
      ]);

      const historyData = await historyResponse.json();
      const statsData = await statsResponse.json();

      setHistory(historyData.scans || []);
      setStats(statsData);
    } catch (error) {
      console.error("Unable to load dashboard data:", error);
    }
  };

  const scanURL = async () => {
    if (!url.trim()) {
      alert("Please enter a URL");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${API}/api/scan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Scan failed");
      }

      setResult(data);

      await loadData();
    } catch (error) {
      console.error(error);

      setResult({
        error: true,
        message: error.message || "Unable to connect to backend",
      });
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear all scan history?"
    );

    if (!confirmed) return;

    try {
      await fetch(`${API}/api/history`, {
        method: "DELETE",
      });

      setHistory([]);

      await loadData();
    } catch (error) {
      console.error(error);
      alert("Unable to clear history");
    }
  };

  return (
    <div className="app">

      <div className="background-grid"></div>

      {}

      <header className="navbar">

        <div className="brand">
          <div className="brand-mark">
            ðŸ›¡
          </div>

          <div>
            <h1>
              PHISH<span>GUARD</span>
            </h1>

            <p>
              URL THREAT INTELLIGENCE
            </p>
          </div>
        </div>

        <div className="system-status">
          <span className="online-dot"></span>
          SYSTEM OPERATIONAL
        </div>

      </header>

      <div className="layout">

        {}

        <aside className="sidebar">

          <div className="sidebar-section">

            <span className="sidebar-title">
              SECURITY
            </span>

            <NavButton
              active={page === "dashboard"}
              onClick={() => setPage("dashboard")}
              icon="â—ˆ"
              text="Dashboard"
            />

            <NavButton
              active={page === "scanner"}
              onClick={() => setPage("scanner")}
              icon="âŒ•"
              text="URL Scanner"
            />

            <NavButton
              active={page === "history"}
              onClick={() => setPage("history")}
              icon="â—·"
              text="Scan History"
            />

          </div>

          <div className="sidebar-section">

            <span className="sidebar-title">
              INTELLIGENCE
            </span>

            <NavButton
              active={page === "analytics"}
              onClick={() => setPage("analytics")}
              icon="â–¥"
              text="Analytics"
            />

            <NavButton
              active={page === "threats"}
              onClick={() => setPage("threats")}
              icon="â—‰"
              text="Threat Monitor"
            />

          </div>

          <div className="sidebar-bottom">

            <div className="engine-card">

              <div className="engine-header">
                <span className="engine-dot"></span>
                AI ENGINE
              </div>

              <strong>
                Random Forest
              </strong>

              <p>
                Detection engine online
              </p>

            </div>

            <div className="version">
              PHISHGUARD v1.0
            </div>

          </div>

        </aside>

        {}

        <main className="main-content">

          {page === "dashboard" && (
            <Dashboard
              stats={stats}
              history={history}
              setPage={setPage}
            />
          )}

          {page === "scanner" && (
            <Scanner
              url={url}
              setUrl={setUrl}
              result={result}
              loading={loading}
              scanURL={scanURL}
            />
          )}

          {page === "history" && (
            <History
              history={history}
              clearHistory={clearHistory}
            />
          )}

          {page === "analytics" && (
            <Analytics
              stats={stats}
              history={history}
            />
          )}

          {page === "threats" && (
            <ThreatMonitor
              history={history}
              stats={stats}
            />
          )}

        </main>

      </div>

    </div>
  );
}




function NavButton({
  active,
  onClick,
  icon,
  text,
}) {
  return (
    <button
      className={`side-item ${
        active ? "active" : ""
      }`}
      onClick={onClick}
    >
      <span>{icon}</span>
      {text}
    </button>
  );
}




function Dashboard({
  stats,
  history,
  setPage,
}) {
  return (
    <>
      <PageHeading
        eyebrow="SECURITY CENTER"
        title="Security Dashboard"
        description="Real-time overview of your URL threat detection environment."
      />

      <div className="dashboard-grid">

        <StatCard
          title="TOTAL SCANS"
          value={stats.totalScans}
          description="URLs analyzed"
          icon="âŒ•"
        />

        <StatCard
          title="THREATS DETECTED"
          value={stats.phishingDetected}
          description="Phishing URLs"
          icon="âš "
          danger
        />

        <StatCard
          title="SUSPICIOUS"
          value={stats.suspiciousDetected}
          description="Requires attention"
          icon="!"
          warning
        />

        <StatCard
          title="SAFE URLS"
          value={stats.safeScans}
          description="Likely legitimate"
          icon="âœ“"
          safe
        />

      </div>

      <div className="dashboard-two-column">

        <div className="dashboard-panel">

          <PanelTitle
            eyebrow="SYSTEM PERFORMANCE"
            title="Detection Metrics"
          />

          <MetricRow
            label="Average Risk Score"
            value={`${stats.averageRisk}%`}
          />

          <MetricRow
            label="Average AI Confidence"
            value={`${stats.averageConfidence}%`}
          />

          <MetricRow
            label="Detection Engine"
            value="Random Forest"
          />

          <MetricRow
            label="ML Service"
            value="ONLINE"
            green
          />

        </div>

        <div className="dashboard-panel">

          <PanelTitle
            eyebrow="RECENT ACTIVITY"
            title="Latest Scans"
          />

          {history.length === 0 ? (
            <EmptyState text="No scans yet" />
          ) : (
            history.slice(0, 5).map((scan) => (
              <MiniScan
                key={scan.id}
                scan={scan}
              />
            ))
          )}

          <button
            className="secondary-button"
            onClick={() => setPage("history")}
          >
            VIEW ALL SCANS â†’
          </button>

        </div>

      </div>
    </>
  );
}




function Scanner({
  url,
  setUrl,
  result,
  loading,
  scanURL,
}) {
  const features = result?.features;
  const ml = result?.mlPrediction;

  const riskScore =
    features?.riskScore ?? 0;

  const isPhishing =
    ml?.prediction === 1;

  const isSuspicious =
    !isPhishing &&
    features?.classification ===
      "Suspicious";

  return (
    <>
      <PageHeading
        eyebrow="SECURITY CENTER"
        title="URL Threat Analyzer"
        description="Analyze website URLs using machine learning and security heuristics."
      />

      <div className="scanner-card">

        <div className="scanner-label">
          <span>01</span>
          TARGET URL
        </div>

        <div className="scanner-input-row">

          <div className="url-input-container">

            <span className="input-icon">
              â†—
            </span>

            <input
              value={url}
              onChange={(e) =>
                setUrl(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  scanURL();
                }
              }}
              placeholder="https://example.com"
            />

            {url && (
              <button
                className="clear-button"
                onClick={() => setUrl("")}
              >
                Ã—
              </button>
            )}

          </div>

          <button
            className="analyze-button"
            onClick={scanURL}
            disabled={loading}
          >
            {loading
              ? "ANALYZING..."
              : "ANALYZE URL â†’"}
          </button>

        </div>

        <div className="scanner-footer">
          Secure URL analysis powered by PhishGuard AI
        </div>

      </div>

      {result?.error && (
        <div className="error-box">
          <strong>SCAN ERROR</strong>
          <span>{result.message}</span>
        </div>
      )}

      {features && (
        <>

          <div className="result-top">

            <div>
              <div className="eyebrow">
                ANALYSIS COMPLETE
              </div>

              <h3>
                Threat Assessment
              </h3>
            </div>

            <div
              className={`verdict ${
                isPhishing
                  ? "danger"
                  : isSuspicious
                  ? "warning"
                  : "safe"
              }`}
            >
              {isPhishing
                ? "âš  PHISHING DETECTED"
                : isSuspicious
                ? "âš  SUSPICIOUS"
                : "âœ“ LIKELY SAFE"}
            </div>

          </div>

          <div className="assessment-grid">

            <div className="risk-panel">

              <div className="panel-label">
                RISK SCORE
              </div>

              <div className="large-score">
                {riskScore}
                <span>/100</span>
              </div>

              <div className="risk-bar">
                <div
                  style={{
                    width: `${riskScore}%`,
                  }}
                ></div>
              </div>

              <p>
                {riskScore < 30
                  ? "Low risk URL"
                  : riskScore < 60
                  ? "Moderate risk URL"
                  : "High risk URL"}
              </p>

            </div>

            <div className="ai-panel">

              <div className="panel-label">
                AI MODEL PREDICTION
              </div>

              <div className="ai-result-large">
                {ml?.label ||
                  "Unavailable"}
              </div>

              <div className="confidence-text">
                Confidence:{" "}
                {ml?.confidence
                  ? `${(
                      ml.confidence *
                      100
                    ).toFixed(1)}%`
                  : "N/A"}
              </div>

              <div className="model-name">
                Random Forest
              </div>

            </div>

          </div>

          <div className="url-information">

            <div className="panel-label">
              ANALYZED TARGET
            </div>

            <div className="target-url">
              {result.url}
            </div>

          </div>

          <div className="signals-heading">

            <div>
              <div className="eyebrow">
                FEATURE ANALYSIS
              </div>

              <h3>
                Security Indicators
              </h3>
            </div>

          </div>

          <div className="signals-grid">

            <SecurityCard
              title="HTTPS"
              value={
                features.hasHTTPS
                  ? "Enabled"
                  : "Not Enabled"
              }
              status={
                features.hasHTTPS
              }
            />

            <SecurityCard
              title="URL LENGTH"
              value={
                `${features.urlLength} chars`
              }
              status={
                features.urlLength <= 75
              }
            />

            <SecurityCard
              title="SUBDOMAINS"
              value={
                features.numberOfSubdomains
              }
              status={
                features.numberOfSubdomains <= 2
              }
            />

            <SecurityCard
              title="IP ADDRESS"
              value={
                features.hasIPAddress
                  ? "Detected"
                  : "Not Detected"
              }
              status={
                !features.hasIPAddress
              }
            />

            <SecurityCard
              title="@ SYMBOL"
              value={
                features.hasAtSymbol
                  ? "Detected"
                  : "Not Detected"
              }
              status={
                !features.hasAtSymbol
              }
            />

            <SecurityCard
              title="HYPHEN"
              value={
                features.hasHyphen
                  ? "Present"
                  : "Not Present"
              }
              status={
                !features.hasHyphen
              }
            />

            <SecurityCard
              title="SUSPICIOUS KEYWORD"
              value={
                features.hasSuspiciousKeyword
                  ? "Detected"
                  : "Not Detected"
              }
              status={
                !features.hasSuspiciousKeyword
              }
            />

            <SecurityCard
              title="SPECIAL CHARACTERS"
              value={
                features.numberOfSpecialCharacters
              }
              status={
                features.numberOfSpecialCharacters <= 10
              }
            />

            <SecurityCard
              title="DOMAIN DOTS"
              value={
                features.numberOfDots
              }
              status={
                features.numberOfDots <= 3
              }
            />

          </div>

        </>
      )}
    </>
  );
}




function History({
  history,
  clearHistory,
}) {
  return (
    <>
      <PageHeading
        eyebrow="SECURITY LOG"
        title="Scan History"
        description="Review previously analyzed URLs and their threat classifications."
      />

      <div className="history-header">

        <span>
          {history.length} scan
          {history.length !== 1
            ? "s"
            : ""}
        </span>

        {history.length > 0 && (
          <button
            className="danger-button"
            onClick={clearHistory}
          >
            CLEAR HISTORY
          </button>
        )}

      </div>

      <div className="history-panel">

        {history.length === 0 ? (
          <EmptyState text="No scan history available" />
        ) : (
          history.map((scan) => (
            <HistoryRow
              key={scan.id}
              scan={scan}
            />
          ))
        )}

      </div>
    </>
  );
}




function Analytics({
  stats,
  history,
}) {
  const total =
    stats.totalScans || 1;

  const phishingPercent =
    (stats.phishingDetected /
      total) *
    100;

  const suspiciousPercent =
    (stats.suspiciousDetected /
      total) *
    100;

  const safePercent =
    (stats.safeScans /
      total) *
    100;

  return (
    <>
      <PageHeading
        eyebrow="THREAT INTELLIGENCE"
        title="Security Analytics"
        description="Analyze your URL scanning activity and threat distribution."
      />

      <div className="analytics-cards">

        <StatCard
          title="TOTAL SCANS"
          value={stats.totalScans}
          description="All analyzed URLs"
        />

        <StatCard
          title="AVG RISK"
          value={`${stats.averageRisk}%`}
          description="Average threat score"
        />

        <StatCard
          title="AI CONFIDENCE"
          value={`${stats.averageConfidence}%`}
          description="Average model confidence"
        />

      </div>

      <div className="analytics-panel">

        <PanelTitle
          eyebrow="THREAT DISTRIBUTION"
          title="Classification Breakdown"
        />

        <AnalyticsBar
          label="Phishing"
          value={phishingPercent}
          count={stats.phishingDetected}
          type="danger"
        />

        <AnalyticsBar
          label="Suspicious"
          value={suspiciousPercent}
          count={stats.suspiciousDetected}
          type="warning"
        />

        <AnalyticsBar
          label="Safe"
          value={safePercent}
          count={stats.safeScans}
          type="safe"
        />

      </div>

      <div className="analytics-panel">

        <PanelTitle
          eyebrow="ACTIVITY"
          title="Recent Analysis Volume"
        />

        <div className="activity-number">
          {history.length}
        </div>

        <p className="activity-description">
          Total URLs currently stored in
          the PhishGuard security database.
        </p>

      </div>
    </>
  );
}




function ThreatMonitor({
  history,
  stats,
}) {
  const threats =
    history.filter(
      (scan) =>
        scan.mlPrediction === 1 ||
        scan.riskScore >= 50
    );

  return (
    <>
      <PageHeading
        eyebrow="LIVE THREAT INTELLIGENCE"
        title="Threat Monitor"
        description="Monitor phishing and high-risk URLs detected by PhishGuard."
      />

      <div className="threat-overview">

        <div className="threat-stat danger">
          <span>PHISHING</span>
          <strong>
            {stats.phishingDetected}
          </strong>
        </div>

        <div className="threat-stat warning">
          <span>SUSPICIOUS</span>
          <strong>
            {stats.suspiciousDetected}
          </strong>
        </div>

        <div className="threat-stat">
          <span>TOTAL SCANS</span>
          <strong>
            {stats.totalScans}
          </strong>
        </div>

      </div>

      <div className="history-panel">

        <div className="panel-label">
          DETECTED THREATS
        </div>

        {threats.length === 0 ? (
          <EmptyState
            text="No threats detected"
          />
        ) : (
          threats.map((scan) => (
            <HistoryRow
              key={scan.id}
              scan={scan}
            />
          ))
        )}

      </div>
    </>
  );
}




function PageHeading({
  eyebrow,
  title,
  description,
}) {
  return (
    <section className="page-heading">

      <div>

        <div className="eyebrow">
          {eyebrow}
        </div>

        <h2>{title}</h2>

        <p>
          {description}
        </p>

      </div>

      <div className="scan-time">
        <span></span>
        SYSTEM ONLINE
      </div>

    </section>
  );
}


function StatCard({
  title,
  value,
  description,
  danger,
  warning,
  safe,
}) {
  return (
    <div
      className={`stat-card ${
        danger
          ? "danger"
          : warning
          ? "warning"
          : safe
          ? "safe"
          : ""
      }`}
    >

      <span className="stat-title">
        {title}
      </span>

      <strong>{value}</strong>

      <p>{description}</p>

    </div>
  );
}


function PanelTitle({
  eyebrow,
  title,
}) {
  return (
    <div className="panel-title">

      <div className="eyebrow">
        {eyebrow}
      </div>

      <h3>{title}</h3>

    </div>
  );
}


function MetricRow({
  label,
  value,
  green,
}) {
  return (
    <div className="metric-row">

      <span>{label}</span>

      <strong
        className={
          green ? "green-text" : ""
        }
      >
        {value}
      </strong>

    </div>
  );
}


function MiniScan({ scan }) {
  return (
    <div className="mini-scan">

      <div>
        <strong>
          {scan.url}
        </strong>

        <span>
          {new Date(
            scan.timestamp
          ).toLocaleString()}
        </span>
      </div>

      <b
        className={
          scan.mlPrediction === 1
            ? "red-text"
            : "green-text"
        }
      >
        {scan.mlLabel}
      </b>

    </div>
  );
}


function HistoryRow({ scan }) {
  const phishing =
    scan.mlPrediction === 1;

  return (
    <div className="history-row">

      <div className="history-status">
        <span
          className={
            phishing
              ? "status-icon danger"
              : "status-icon safe"
          }
        >
          {phishing ? "!" : "âœ“"}
        </span>

        <div>
          <strong>
            {scan.url}
          </strong>

          <small>
            {new Date(
              scan.timestamp
            ).toLocaleString()}
          </small>
        </div>
      </div>

      <div className="history-risk">
        <span>RISK</span>
        <strong>
          {scan.riskScore}%
        </strong>
      </div>

      <div
        className={
          phishing
            ? "history-verdict danger"
            : "history-verdict safe"
        }
      >
        {scan.mlLabel}
      </div>

    </div>
  );
}


function SecurityCard({
  title,
  value,
  status,
}) {
  return (
    <div className="security-card">

      <div
        className={
          status
            ? "security-icon positive"
            : "security-icon negative"
        }
      >
        {status ? "âœ“" : "!"}
      </div>

      <div className="security-info">

        <span>{title}</span>

        <strong>
          {value}
        </strong>

      </div>

      <div
        className={
          status
            ? "indicator positive"
            : "indicator negative"
        }
      >
        {status ? "PASS" : "FLAG"}
      </div>

    </div>
  );
}


function AnalyticsBar({
  label,
  value,
  count,
  type,
}) {
  return (
    <div className="analytics-row">

      <div className="analytics-label">
        <span>{label}</span>

        <strong>
          {count}
        </strong>
      </div>

      <div className="analytics-track">

        <div
          className={`analytics-fill ${type}`}
          style={{
            width: `${Math.max(
              value,
              count > 0 ? 2 : 0
            )}%`,
          }}
        ></div>

      </div>

      <span className="analytics-percent">
        {value.toFixed(1)}%
      </span>

    </div>
  );
}


function EmptyState({ text }) {
  return (
    <div className="empty-state">
      <div>â—Œ</div>
      <p>{text}</p>
    </div>
  );
}

export default App;
