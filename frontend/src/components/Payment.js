import React from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";

const Payment = () =>{

    return (
        <>
            <PayPalButtons style={{ layout: "horizontal" }} 
                createOrder={(data, actions) => {
                    return actions.order.create({
                        purchase_units:[
                            {
                                amount:{
                                    value: "10.00"
                                }
                            }
                        ]
                    })
                }}
                // onApprove={}
                // onError={}
                // onCancel={}
            />
        </>
    )
}

export default Payment;