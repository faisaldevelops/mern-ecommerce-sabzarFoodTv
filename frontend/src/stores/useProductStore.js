import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set, get) => ({
	products: [],
	loading: false,
	lastFetch: null,
	CACHE_DURATION: 5 * 60 * 1000, // 5 minutes

	setProducts: (products) => set({ products }),
	
	fetchAllProducts: async () => {
		const now = Date.now();
		const { lastFetch, CACHE_DURATION, products } = get();
		
		// Return cached products if still fresh
		if (lastFetch && (now - lastFetch) < CACHE_DURATION && products.length > 0) {
			return;
		}
		
		set({ loading: true });
		try {
			const response = await axios.get("/products");
			set({ products: response.data.products, loading: false, lastFetch: now });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			toast.error(error.response.data.error || "Failed to fetch products");
		}
	},
		set({ loading: true });
		try {
			const res = await axios.post("/products", productData);
			set((prevState) => ({
				products: [...prevState.products, res.data],
				loading: false,
				lastFetch: Date.now(),
			}));
		} catch (error) {
			toast.error(error.response.data.error);
			set({ loading: false });
		}
	},
	
	fetchAllProducts: async () => {
		const now = Date.now();
		const { lastFetch, CACHE_DURATION, products } = get();
		
		if (lastFetch && (now - lastFetch) < CACHE_DURATION && products.length > 0) {
			return;
		}
		
		set({ loading: true });
		try {
			const response = await axios.get("/products");
			set({ products: response.data.products, loading: false, lastFetch: now });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			toast.error(error.response.data.error || "Failed to fetch products");
		}
	},
	deleteProduct: async (productId) => {
		set({ loading: true });
		try {
			await axios.delete(`/products/${productId}`);
			set((prevProducts) => ({
				products: prevProducts.products.filter((product) => product._id !== productId),
				loading: false,
				lastFetch: Date.now(),
			}));
			toast.success("Product deleted successfully");
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.error || "Failed to delete product");
		}
	},
	updateProduct: async (productId, productData) => {
		set({ loading: true });
		try {
			const response = await axios.put(`/products/${productId}`, productData);
			set((prevProducts) => ({
				products: prevProducts.products.map((product) =>
					product._id === productId ? response.data : product
				),
				loading: false,
				lastFetch: Date.now(),
			}));
			toast.success("Product updated successfully");
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.error || "Failed to update product");
		}
	},
}));
