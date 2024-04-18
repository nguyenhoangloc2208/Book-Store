import { useState } from "react";
import { useParams } from 'react-router-dom';
import AuthService from "../../services/auth.service.js";
import { toast } from 'react-hot-toast';

const VerificationEmail = () => {
    const { email } = useParams();
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        setIsLoading(true);

        try {
            const response = await AuthService.resendEmail(email);
            console.log(response);
            toast.success('Verification code resent successfully');
        } catch (error) {
            console.error('Error resending verification code:', error);
            toast.error('Failed to resend verification code');
        }

        setIsLoading(false); // Kết thúc quá trình gửi lại mã xác nhận
    }

    return (
        <section>
            <div>Verification e-mail sent.</div>
            <div>Please check your e-mail!</div>
            <button onClick={handleClick} disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Resend code to e-mail'}
            </button>
        </section>
    )
}

export default VerificationEmail;
