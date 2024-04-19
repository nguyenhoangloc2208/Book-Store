import { useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import AuthService from "../../services/auth.service.js";
import { toast }  from 'react-hot-toast';
import Loading from "../../components/ui/Loading.js";

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
    }, []);

    return (
        <>
            <Loading/>
            {console.log(key)}
        </>
    )
}

export default ConfirmEmail;
