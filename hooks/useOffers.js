import axios from "axios";
import { useState, useEffect } from "react";

export const useOffers = (vault) => {
  const [data, setData] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const getOffers = async () => {
    try {
      setIsLoading(true);
      const data = await axios.get("/api/offers", { params: { vault: vault } });
      setData(data.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setData([]);
    }
  };

  useEffect(() => {
    if (vault && !data && !isLoading) {
      getOffers();
    }
  }, [data, vault]);

  return { data, isLoading, getOffers };
};
