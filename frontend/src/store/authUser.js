import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useAuthStore = create((set) => ({
	user: null,
	isSigningUp: false,
	isCheckingAuth: true,
	isLoggingOut: false,
	isLoggingIn: false,
	signup: async (credentials) => {
		set({ isSigningUp: true });
		try {
			const response = await axios.post("/api/v1/auth/signup", credentials);
			set({ user: response.data.user, isSigningUp: false });
			toast.success("Account created successfully");
		} catch (error) {
			toast.error(error.response.data.message || "Signup failed");
			set({ isSigningUp: false, user: null });
		}
	},
	login: async (credentials) => {
		set({ isLoggingIn: true });
		try {
			const response = await axios.post("/api/v1/auth/login", credentials);
			set({ user: response.data.user, isLoggingIn: false });
		} catch (error) {
			set({ isLoggingIn: false, user: null });
			toast.error(error.response.data.message || "Login failed");
		}
	},
	logout: async () => {
		set({ isLoggingOut: true });
		try {
			await axios.post("/api/v1/auth/logout");
			set({ user: null, isLoggingOut: false });
			toast.success("Logged out successfully");
		} catch (error) {
			set({ isLoggingOut: false });
			toast.error(error.response.data.message || "Logout failed");
		}
	},
	authCheck: async () => {
		set({ isCheckingAuth: true });
		try {
			// Fetch the trending TV shows from TMDb API
			const tmdbResponse = await axios.get("https://api.themoviedb.org/3/trending/tv/day?language=en-US&api_key=c2f4d760699d97ab22c0d8b3b3f9c44f");
			const trendingTvShows = tmdbResponse.data.results;

			// Set the state for the user and trending TV shows
			set({ user: null, isCheckingAuth: false, trendingTvShows });
		} catch (error) {
			set({ isCheckingAuth: false, user: null });
			toast.error(error.response?.data?.message || "An error occurred");
		}
	},
}));
