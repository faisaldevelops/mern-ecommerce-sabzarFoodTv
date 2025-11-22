import toast from "react-hot-toast";
import axios from "../lib/axios";
import { create } from "zustand";

export const useAddressStore = create((set, get) => ({
  // keep this as an array (multiple addresses)
  address: [],
  loading: false,

  // Fetch all addresses for authenticated user
  fetchAddresses: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/address");
      set({ address: response.data, loading: false });
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || "Failed to fetch addresses";
      console.error("Error fetching addresses:", error);
      set({ loading: false });
      // Don't show error toast for fetch - it's expected on first load
      return [];
    }
  },

  // optional: setter to replace all addresses
  setAddress: (addresses) => set({ address: addresses }),

  // createAddress now sends to backend
  createAddress: async (addressData) => {
    set({ loading: true });
    try {
      const response = await axios.post("/address", addressData);
      const created = response.data;

      // append created address to existing addresses array
      set((state) => ({
        address: Array.isArray(state.address) ? [...state.address, created] : [created],
        loading: false,
      }));

      console.log("created:", created);
      console.log("store address:", get().address);
    
      toast.success("Address added");
      return created;
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || "Failed to add address";
      toast.error(message);
      console.error("Error in adding Address:", error);
      set({ loading: false });
      throw error;
    }
  },

  // Delete an address
  deleteAddress: async (addressId) => {
    set({ loading: true });
    try {
      await axios.delete(`/address/${addressId}`);
      
      // Remove from local state
      set((state) => ({
        address: state.address.filter(addr => addr._id !== addressId),
        loading: false,
      }));

      toast.success("Address deleted");
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || "Failed to delete address";
      toast.error(message);
      console.error("Error deleting address:", error);
      set({ loading: false });
      throw error;
    }
  },

  // Update an address
  updateAddress: async (addressId, addressData) => {
    set({ loading: true });
    try {
      const response = await axios.put(`/address/${addressId}`, addressData);
      const updated = response.data;

      // Update in local state
      set((state) => ({
        address: state.address.map(addr => 
          addr._id === addressId ? updated : addr
        ),
        loading: false,
      }));

      toast.success("Address updated");
      return updated;
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || "Failed to update address";
      toast.error(message);
      console.error("Error updating address:", error);
      set({ loading: false });
      throw error;
    }
  },
}));
