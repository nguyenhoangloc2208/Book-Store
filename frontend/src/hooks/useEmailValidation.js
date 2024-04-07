import { useState } from 'react';

const useEmailValidation = () => {
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValid] = useState(false);

  const validateEmail = (input) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    setIsValid(emailRegex.test(input));
    setEmail(input);
  };

  return { email, isValidEmail, validateEmail };
};

export default useEmailValidation;
