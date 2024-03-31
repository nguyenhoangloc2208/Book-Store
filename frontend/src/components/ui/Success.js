import React, { useEffect } from "react";
import useDataMutation from "../../hooks/useDataMutation";

const PaymentSuccess = () => {
    const {updateData} = useDataMutation(`/api/user/orders/pending_order`)
    useEffect(() => {
        updateData();
    }, [])

    return(
        <>
            success
        </>
    )
}

export default PaymentSuccess;