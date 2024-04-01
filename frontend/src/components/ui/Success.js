import React, { useEffect } from "react";
import useDataMutation from "../../hooks/useDataMutation";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const PaymentSuccess = () => {
    const isLogin = useSelector(state => state.auth.isLogin);
    const {updateData} = useDataMutation(isLogin);
    useEffect(() => {
        if(isLogin) {updateData();}
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