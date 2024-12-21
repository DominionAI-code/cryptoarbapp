import { useState, useEffect } from "react";
import axios from "axios";

const useAxios = (url) => {
  const [response, setResponse] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(url);
        setResponse(result.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [url]);

  return { response };
};

export default useAxios;
