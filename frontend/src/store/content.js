import { create } from "zustand";

export const useContentStore = create((set) => ({
  contentType: "movie", // القيمة الافتراضية هي "movie"
  setContentType: (type) => set({ contentType: type }), // دالة لتغيير النوع
}));
