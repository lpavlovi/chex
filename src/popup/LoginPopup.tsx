import { createSignal, createEffect } from "solid-js";

interface LoginPopupProps {
  onLogin?: (credentials: { email: string; password: string }) => void;
}

export function LoginPopup(props: LoginPopupProps) {
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [isLoading, setIsLoading] = createSignal(false);
  const [status, setStatus] = createSignal("");
  const [isError, setIsError] = createSignal(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    
    if (!email() || !password()) {
      setStatus("Please fill in all fields");
      setIsError(true);
      return;
    }

    setIsLoading(true);
    setStatus("Logging in...");
    setIsError(false);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Call the login handler if provided
      if (props.onLogin) {
        props.onLogin({ email: email(), password: password() });
      }
      
      setStatus("Login successful!");
      setIsError(false);
      
      // Store credentials in chrome storage
      await chrome.storage.local.set({
        userEmail: email(),
        isLoggedIn: true,
        loginTime: Date.now()
      });
      
    } catch (error) {
      setStatus("Login failed. Please try again.");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user is already logged in
  createEffect(async () => {
    try {
      const result = await chrome.storage.local.get(['isLoggedIn', 'userEmail']);
      if (result.isLoggedIn) {
        setStatus(`Welcome back, ${result.userEmail}!`);
        setIsError(false);
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  });

  return (
    <div style="width: 300px; padding: 20px; background: white; color: black;">
      <h1 style="margin: 0 0 20px 0; font-size: 18px;">Login</h1>
      
      <form onSubmit={handleSubmit} style="display: flex; flex-direction: column; gap: 15px;">
        <div>
          <label for="email" style="display: block; margin-bottom: 5px; font-size: 14px;">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email()}
            onInput={(e) => setEmail(e.currentTarget.value)}
            disabled={isLoading()}
            required
            style="width: 100%; padding: 8px; border: 1px solid #ccc; font-size: 14px; box-sizing: border-box;"
          />
        </div>
        
        <div>
          <label for="password" style="display: block; margin-bottom: 5px; font-size: 14px;">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password()}
            onInput={(e) => setPassword(e.currentTarget.value)}
            disabled={isLoading()}
            required
            style="width: 100%; padding: 8px; border: 1px solid #ccc; font-size: 14px; box-sizing: border-box;"
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading()}
          style="padding: 10px; background: black; color: white; border: none; font-size: 14px; cursor: pointer;"
        >
          {isLoading() ? "Logging in..." : "Login"}
        </button>
      </form>
      
      <div style={`margin-top: 15px; font-size: 12px; color: ${isError() ? 'red' : 'green'};`}>
        {status()}
      </div>
    </div>
  );
}
