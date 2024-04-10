import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import AuthService from "../../services/auth.service";
import { toast }  from 'react-hot-toast';

const ConfirmEmail = () => {
    const navigate = useNavigate();
    const { key } = useParams();
    const [isConfirm, setConfirm] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await AuthService.confirmEmail(key);
                toast.success('Email confirm success!');
                navigate('/');
            } catch (error) {
                toast.error('Error confirming email!');
                console.error('Error confirming email:', error);
            }
        };
        if(isConfirm === false){
            fetchData();
            setConfirm(true);
        }
    }, [key, navigate, isConfirm]);

    // return (
    //     <>
    //     </>
    // )
}

export default ConfirmEmail;
