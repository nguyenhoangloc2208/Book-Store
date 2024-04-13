import useSWR, { mutate } from 'swr';
import api from '../services/api';
import Cookies from 'js-cookie';

const url = '/api/user/orders/orders/cart/';

const fetcher = (url) => api.get(url).then(res => res);

const useDataMutation = () => {
    const isLoggedInStr = Cookies.get('isLoggedIn');
    const { data:product, error, isLoading } = useSWR(isLoggedInStr === 'true' ? url:null, fetcher, { refreshInterval: null, revalidateOnFocus: false });

    const updateData = async (id) => {
            await mutate( + id);
    };

    if (error && error.response && (error.response.status === 401 || error.response.status === 404)) {
        return {
            error,
            updateData: () => {},
        };
    }

    return {
        product,
        error,
        isLoading,
        updateData,
    };
}

export default useDataMutation;
