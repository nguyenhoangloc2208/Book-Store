import useSWR, { mutate } from 'swr';
import api from '../services/api';
import Cookies from 'js-cookie';

const url = '/api/user/orders/pending_order';

const fetcher = (url) => api.get(url).then(res => res[0]);

const useDataMutation = () => {
    const isLoggedInStr = Cookies.get('isLoggedIn');
    const { data, error, isLoading } = useSWR(isLoggedInStr === 'true' ? url:null, fetcher, { refreshInterval: null, revalidateOnFocus: false });

    const updateData = async () => {
            await mutate(url);
    };

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