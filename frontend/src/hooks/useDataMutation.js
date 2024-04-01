import useSWR, { mutate } from 'swr';
import api from '../services/api';

const url = '/api/user/orders/pending_order';

const fetcher = (url) => api.get(url).then(res => res[0]);

const useDataMutation = (isLogin) => {
    const { data, error, isLoading } = useSWR(isLogin ? url:null, fetcher, { refreshInterval: null, revalidateOnFocus: false });

    const updateData = async () => {
        if (isLogin) {
            await mutate(url);
        }
    };

    if (!isLogin) {
        return {
            data: null,
            error: null,
            isLoading: false,
            updateData: () => {}, // Trả về hàm rỗng
        };
    }

    if (error && (error.response.status === 401 || error.response.status === 404)) {
        return {
            error,
            updateData: () => {},
        };
    }

    return {
        data,
        error,
        isLoading,
        updateData,
    };
}

export default useDataMutation;
