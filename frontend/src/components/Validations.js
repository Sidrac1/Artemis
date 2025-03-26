// validations.js

const validateName = (name) => {
    if (!name.trim()) {
        return 'Please enter the name.';
    }
    if (!/^[a-zA-Z\s]*$/.test(name)) {
        return 'The name can only contain letters and spaces.';
    }
    return null;
};

const validatePhone = (phone) => {
    if (!phone.trim()) {
        return 'Please enter the phone number.';
    }
    if (!/^[0-9]{0,10}$/.test(phone)) {
        return 'The phone number can only contain digits and have a maximum of 10.';
    }
    if (phone.length !== 10) {
        return 'The phone number must contain exactly 10 digits.';
    }
    return null;
};

const validateEmail = (email) => {
    if (!email.trim()) {
        return 'Please enter the email address.';
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        return 'Please enter a valid email address';
    }
    return null;
};

const validateGender = (gender) => {
    if (!gender) {
        return 'Please select a gender.';
    }
    return null;
};

const validatePassword = (password) => {
    if (!password.trim()) {
        return 'Please enter a password.';
    }
    if (password.length < 8) {
        return 'The password must be at least 8 characters long.';
    }
    return null;
};

const useValidation = () => {
    return {
        validateName,
        validatePhone,
        validateEmail,
        validateGender,
        validatePassword,
    };
};

export default useValidation;