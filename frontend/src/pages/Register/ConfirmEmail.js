import React, { useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import AuthService from "../../services/auth.service";
import { toast }  from 'react-hot-toast';

const ConfirmEmail = () => {
    const navigate = useNavigate();
    const { key } = useParams();

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

        fetchData();
    }, [key, navigate]);

    return (
        <>
        </>
    )
}

export default ConfirmEmail;
