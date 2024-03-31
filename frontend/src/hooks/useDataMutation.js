import useSWR, { mutate } from 'swr';
import api from '../services/api';

const fetcher = (url) => api.get(url).then(res => res[0]);


const useDataMutation = (url) => {
    const { data, error, isLoading } = useSWR(url, fetcher, {refreshInterval: null});

    const updateData = async () => {
        // Update the local cache immediately
        mutate(url);
    };

    return {
        data,
        error,
        isLoading,
        updateData,
    };

}

export default useDataMutation;
