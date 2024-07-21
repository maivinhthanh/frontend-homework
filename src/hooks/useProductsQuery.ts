import { useQuery } from '@tanstack/react-query';
import { apiStrings } from '@/services';
import axios from 'axios';

const useProductsQuery = () => {
  const { data, isLoading: isLoading } = useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      try {
        const response = await axios.get(apiStrings.getProducts);
        return response.data ? response.data : [];
      } catch (error) {
        throw error;
      }
    },
    staleTime: 0,
  });

  return {
    products: data || [],
    isLoading,
  };
};

export default useProductsQuery;
