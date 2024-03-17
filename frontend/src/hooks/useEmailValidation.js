import { useState } from "react";

function useEmailValidation() {
  const [isValidEmail, setIsValid] = useState(false);

  const validateEmail = (email) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValid(pattern.test(email));
  };

  return [validateEmail, isValidEmail];
}

export default useEmailValidation;
