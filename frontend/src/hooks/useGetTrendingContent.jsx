import { useEffect, useState } from "react";
import axios from "axios";
import { useContentStore } from "../store/content";  // إضافة الاستيراد هنا

const useGetTrendingContent = () => {
  const [trendingContent, setTrendingContent] = useState(null);
  const [loading, setLoading] = useState(true);  // حالة لتتبع تحميل البيانات
  const [error, setError] = useState(null); // حالة لتخزين الأخطاء
  const { contentType } = useContentStore(); // الحصول على contentType من الستور

  useEffect(() => {
    const getTrendingContent = async () => {
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODI0OTg0YjVlZDMwZGFlZmVlYjczNTgiLCJpYXQiOjE3NDcyMjkzNjEsImV4cCI6MTc0ODUyNTM2MX0.120zGcGSmkkP3oa8wPp4zI36shG-u1_uP_yZ2PfDTtY";
      try {
        setLoading(true); // تبدأ تحميل البيانات
        const res = await axios.get(
          `https://api.themoviedb.org/3/trending/tv/day?language=en-US&api_key=c2f4d760699d97ab22c0d8b3b3f9c44f`, 
          {
            headers: {
              Authorization: `Bearer ${token}`, // إضافة التوكن في الـ headers
            },
          }
        );

        console.log("Trending content response:", res.data);  // هنا هتطبع الاستجابة بالكامل
        console.log("Trending content results:", res.data.results);  // هتطبع قائمة الـ results فقط

        if (res.data.results) {
          setTrendingContent(res.data.results);  // تأكد من استخدام "results" بدلاً من "content"
        } else {
          throw new Error("No results found.");
        }
      } catch (error) {
        console.error("Error fetching trending content:", error);
        setError(error.message); // تخزين الرسالة في حالة حدوث خطأ
      } finally {
        setLoading(false); // عند الانتهاء من التحميل، تغيير حالة التحميل
      }
    };

    getTrendingContent();
  }, [contentType]);

  return { trendingContent, loading, error };
};

export default useGetTrendingContent;
