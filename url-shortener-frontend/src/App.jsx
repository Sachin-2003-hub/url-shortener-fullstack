import { useState } from 'react'
import './App.css'

function App() {

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
  // --- State for Shortening ---
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [shortenError, setShortenError] = useState('');

  // --- State for Stats ---
  const [statsCode, setStatsCode] = useState('');
  const [visits, setVisits] = useState(null); // null means "not checked yet"
  const [statsError, setStatsError] = useState('');
  // Add this to your state variables
const [loading, setLoading] = useState(false);
const [success, setSuccess] = useState(false);
const [copied, setCopied] = useState(false); // State for "Copied!" tooltip

  // 1. Logic to Shorten URL
  const handleShorten = async (e) => {
    e.preventDefault();
    setShortenError('');
    setShortUrl('');
    setLoading(true); // <--- START LOADING
    setSuccess(false); // <--- Reset success on new click
    setCopied(false); // <--- Reset copied state
    try {
      const response = await fetch(`${BACKEND_URL}/shorten`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: longUrl
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        // Handle 429 Rate Limit specifically
        if (response.status === 429) {
             throw new Error("Whoa! Too many requests. Please wait a moment.");
        }
        throw new Error(errData.error || 'Failed to shorten');
      }

      const code = await response.text();
      setShortUrl(`${BACKEND_URL}/${code}`);
      setSuccess(true); // <--- TURN ON GREEN MODE
    } catch (err) {
      setShortenError(err.message);
    }
    finally {
      setLoading(false); // <--- STOP LOADING (Happens whether success or error)
    }
  };

  // --- Logic 2: Copy to Clipboard ---
  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 sec
  };


  // 3. Logic to Get Stats
  const handleGetStats = async (e) => {
    e.preventDefault();
    setStatsError('');
    setVisits(null);

    // Helper: If user pastes full URL "http://localhost:8080/b", extract just "b"
    let codeCleaned = statsCode
      .replace(BACKEND_URL + '/', '') // Remove production URL
      .replace('http://localhost:8080/', '') // Remove localhost URL (just in case)
      .trim();
    if(codeCleaned === "") {
        setStatsError("Please enter a code");
        return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/stats/${codeCleaned}`);

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
    <div className="container py-5">
      {/* Header */}
      <div className="text-center text-white mb-5">
        <h1 className="fw-bold display-4">🚀 LinkLifter</h1>
        <p className="lead">Shorten links, track clicks, deploy faster.</p>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          
          {/* CARD 1: Create Short Link */}
          <div className="glass-card p-4 mb-5">
            <h4 className="fw-bold mb-4 text-dark d-flex align-items-center">
              {/* SVG Link Icon */}
              <svg className="me-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
              Shorten a URL
            </h4>
            
            <form onSubmit={handleShorten}>
              <div className="mb-3">
                <input 
                  type="url" 
                  className="form-control custom-input" 
                  placeholder="Paste your long link here (https://...)" 
                  value={longUrl}
                  onChange={(e) => setLongUrl(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <button className="btn btn-gradient w-100" type="submit" disabled={loading}>
                {loading ? 'Processing...' : '✨ Shorten Now'}
              </button>
            </form>

            {shortenError && (
              <div className="alert alert-danger mt-3 d-flex align-items-center" role="alert">
                <svg className="me-2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                {shortenError}
              </div>
            )}

            {shortUrl && (
              <div className="result-box animate__animated animate__fadeIn">
                <div className="text-truncate me-2">
                  <small className="text-muted d-block">Your Short Link:</small>
                  <a href={shortUrl} target="_blank" rel="noreferrer" className="short-link text-decoration-none">
                    {shortUrl}
                  </a>
                </div>
                <button 
                  className={`btn btn-sm ${copied ? 'btn-success' : 'btn-outline-primary'}`}
                  onClick={handleCopy}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            )}
          </div>

          {/* CARD 2: Check Statistics */}
          <div className="glass-card p-4">
            <h4 className="fw-bold mb-4 text-dark d-flex align-items-center">
               {/* SVG Chart Icon */}
               <svg className="me-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
               Track Clicks
            </h4>
            
            <form onSubmit={handleGetStats}>
              <div className="input-group">
                <input 
                  type="text" 
                  className="form-control custom-input" 
                  placeholder="Enter short code (e.g. 8xK2s)" 
                  value={statsCode}
                  onChange={(e) => setStatsCode(e.target.value)}
                  required
                />
                <button className="btn btn-outline-secondary" type="button" onClick={handleGetStats}>
                  Check
                </button>
              </div>
            </form>

            {statsError && <div className="text-danger mt-2 small">{statsError}</div>}

            {visits !== null && (
              <div className="mt-4 text-center p-3 bg-light rounded-3">
                <h2 className="display-4 fw-bold text-primary mb-0">{visits}</h2>
                <span className="text-muted text-uppercase small ls-1">Total Clicks</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default App