import { useEffect } from "react";
import useDataMutation from "../../hooks/useDataMutation";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

const PaymentSuccess = () => {
    const {updateData} = useDataMutation();
    const isLoggedInStr = Cookies.get('isLoggedIn');
    useEffect(() => {
        if(isLoggedInStr === 'true') {updateData();}
    }, [])

    const handleOnClick = () => {
        toast.success('success');
        toast.error('error');
        toast.loading('Waiting...');
    }

    return(
        <>
            success
            <button onClick={() => handleOnClick()}>Toast test</button>
        </>
    )
}

export default PaymentSuccess;