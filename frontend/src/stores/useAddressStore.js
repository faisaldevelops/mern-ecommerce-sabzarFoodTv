import toast from "react-hot-toast";
import axios from "../lib/axios";
import { create } from "zustand";

export const useAddressStore = create((set, get) => ({
  // keep this as an array (multiple addresses)
  address: [],
  loading: false,

  fetchAddresses: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/address");
      set({ address: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ loading: false });
      return [];
    }
  },

  setAddress: (addresses) => set({ address: addresses }),

  createAddress: async (addressData) => {
    set({ loading: true });
    try {
      const response = await axios.post("/address", addressData);
      const created = response.data;

      set((state) => ({
        address: Array.isArray(state.address) ? [...state.address, created] : [created],
        loading: false,
      }));
    
      toast.success("Address added");
      return created;
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || "Failed to add address";
      toast.error(message);
      set({ loading: false });
      throw error;
    }
  },

  deleteAddress: async (addressId) => {
    set({ loading: true });
    try {
      await axios.delete(`/address/${addressId}`);
      
      set((state) => ({
        address: state.address.filter(addr => addr._id !== addressId),
        loading: false,
      }));

      toast.success("Address deleted");
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || "Failed to delete address";
      toast.error(message);
      set({ loading: false });
      throw error;
    }
  },

  updateAddress: async (addressId, addressData) => {
    set({ loading: true });
    try {
      const response = await axios.put(`/address/${addressId}`, addressData);
      const updated = response.data;

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
      set({ loading: false });
      throw error;
    }
  },
}));
