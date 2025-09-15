import type { Component } from 'solid-js';
import { createSignal } from 'solid-js';
import styles from './App.module.css';

const App: Component = () => {
  const [token, setToken] = createSignal('');
  const [error, setError] = createSignal('');

  const handleLogin = () => {
    chrome.identity.getAuthToken({ interactive: true }, (authToken) => {
      if (chrome.runtime.lastError || !authToken) {
        setError(chrome.runtime.lastError?.message || "Auth failed");
        return;
      }
      setToken(authToken);
      setError(''); // Clear previous errors
    });
  };

  return (
    <div class={styles.App}>
      <button onClick={handleLogin}>Login with Google</button>
      {token() && <p>Got Token: {token().substring(0, 20)}...</p>}
      {error() && <p style={{ color: 'red' }}>Error: {error()}</p>}
    </div>
  );
};

export default App;
