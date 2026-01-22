import { useState } from 'react'

function App() {
  // --- State for Shortening ---
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [shortenError, setShortenError] = useState('');

  // --- State for Stats ---
  const [statsCode, setStatsCode] = useState('');
  const [visits, setVisits] = useState(null); // null means "not checked yet"
  const [statsError, setStatsError] = useState('');

  // 1. Logic to Shorten URL
  const handleShorten = async (e) => {
    e.preventDefault();
    setShortenError('');
    setShortUrl('');

    try {
      const response = await fetch('http://localhost:8080/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: longUrl
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to shorten');
      }

      const code = await response.text();
      setShortUrl(`http://localhost:8080/${code}`);
    } catch (err) {
      setShortenError(err.message);
    }
  };

  // 2. Logic to Get Stats
  const handleGetStats = async (e) => {
    e.preventDefault();
    setStatsError('');
    setVisits(null);

    // Helper: If user pastes full URL "http://localhost:8080/b", extract just "b"
    let codeCleaned = statsCode.replace('http://localhost:8080/', '').trim();
    if(codeCleaned === "") {
        setStatsError("Please enter a code");
        return;
    }

    try {
      const response = await fetch(`http://localhost:8080/stats/${codeCleaned}`);

      if (!response.ok) {
        throw new Error('Short code not found');
      }

      const count = await response.json(); // The backend returns a simple number
      setVisits(count);
    } catch (err) {
      setStatsError(err.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          
          {/* CARD 1: Create Short Link */}
          <div className="card shadow-sm border-0 mb-5">
            <div className="card-body p-4 text-center">
              <h2 className="card-title mb-4 fw-bold text-primary">URL Shortener</h2>
              
              <form onSubmit={handleShorten}>
                <div className="input-group mb-3">
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Paste long URL here..." 
                    value={longUrl}
                    onChange={(e) => setLongUrl(e.target.value)}
                    required
                  />
                  <button className="btn btn-primary" type="submit">Shorten</button>
                </div>
              </form>

              {shortenError && <div className="alert alert-danger">{shortenError}</div>}

              {shortUrl && (
                <div className="alert alert-success">
                  <p className="mb-0 fw-bold">Short Link:</p>
                  <a href={shortUrl} target="_blank" rel="noreferrer" className="text-decoration-none">
                    {shortUrl}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* CARD 2: Check Statistics */}
          <div className="card shadow-sm border-0">
            <div className="card-body p-4 text-center">
              <h4 className="card-title mb-3 fw-bold text-secondary">Check Analytics</h4>
              
              <form onSubmit={handleGetStats}>
                <div className="input-group mb-3">
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Enter short code (e.g. 'b')" 
                    value={statsCode}
                    onChange={(e) => setStatsCode(e.target.value)}
                    required
                  />
                  <button className="btn btn-outline-secondary" type="submit">Check Clicks</button>
                </div>
              </form>

              {statsError && <div className="alert alert-danger">{statsError}</div>}

              {visits !== null && (
                <div className="alert alert-info">
                  <h3 className="fw-bold m-0">{visits}</h3>
                  <p className="m-0 small text-muted">Total Clicks</p>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default App