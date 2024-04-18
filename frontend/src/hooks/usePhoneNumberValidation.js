import { useState } from 'react';

const usePhoneNumberValidation = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(false);

  const validatePhoneNumber = (input) => {
    // Regular expression for phone number validation with optional country code
    if (!input.trim()) {
        setIsValidPhoneNumber(true);
    } else{
        const phoneRegex = /^(\+[0-9]{1,3})?[\s-]?([0-9]{3})[\s-]?([0-9]{3,4})[\s-]?([0-9]{3,4})$/;
        setIsValidPhoneNumber(phoneRegex.test(input));
    }
        setPhoneNumber(input);
  };


  const validateAndFormatPhoneNumber = (input) => {
    validatePhoneNumber(input);
  };

  return { phoneNumber, isValidPhoneNumber, validateAndFormatPhoneNumber };
};

export default usePhoneNumberValidation;
