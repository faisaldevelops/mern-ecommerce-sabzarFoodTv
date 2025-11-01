// import { create } from "zustand";
// import toast from "react-hot-toast";
// import axios from "../lib/axios";

// export const useOrderStore = create((set) => ({
//     orders: [],
//     loading: false,

//     setOrders: (orders) => set({ orders }),
//     fetchAllOrders: async () => {
//         set({ loading: true });
//         console.log("I am in store");
//         try {
//             const response = await axios.get("/orders");
//             set({ orders: response.data.orders, loading: false });
            
//         } catch (error) {
//             set({ error: "Failed to fetch products", loading: false });
//             toast.error(error.response.data.error || "Failed to fetch products");
//         }
//     }
// }));