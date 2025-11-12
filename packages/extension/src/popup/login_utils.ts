export type LoginResults =
	| { success: true; userInfo: any }
	| { success: false; error: any };

export async function loginWithGoogle(): Promise<LoginResults> {
	let res: LoginResults | null = null;

	try {
		// Use Chrome Identity API to get Google OAuth token
		const tokenResult = await chrome.identity.getAuthToken({
			interactive: true,
		});
		const { token } = tokenResult;
		if (!token) {
			throw new Error("Failed to get authentication token");
		}

		// Get user info from Google API
		const response = await fetch(
			`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${token}`,
		);
		const userInfo = await response.json();
		// console.log(userInfo);

		// Call the login handler if provided
		// if (props.onLogin) {
		// 	props.onLogin(token);
		// }

		res = { success: true, userInfo };
		// setStatus(`Welcome, ${userInfo.email}!`);
		// setIsError(false);

		// Store credentials in chrome storage
		// await chrome.storage.local.set({
		//   userEmail: userInfo.email,
		//   userName: userInfo.name,
		//   accessToken: token,
		//   isLoggedIn: true,
		//   loginTime: Date.now(),
		// });
	} catch (error) {
		res = { success: false, error };
		// console.error("Google login error:", error);
		// setStatus("Sign-in failed. Please try again.");
		// setIsError(true);
	} finally {
		// setIsLoading(false);
	}

	if (res == null) {
		return { success: false, error: "something went wrong" };
	}

	return res;
}

