export default class Validator{
    static validateEmail(email: string): boolean {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    static validatePassword(password: string): boolean {
        // Password must be at least 8 characters long and contain at least one number
        const re = /^(?=.*[0-9])(?=.{8,})/;
        return re.test(password);
    }

    static validateName(name: string): boolean {
        // Name must be at least 2 characters long
        return name.length >= 2;
    }


    static validate_data(data: Object): boolean|object {
        //return true if data is valid else return the error message
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                const value = data[key];
                switch (key) {
                    case 'email':
                        if (!Validator.validateEmail(value)) {
                            return {email: "Invalid email format / empty"};
                        }
                        break;
                    case 'password':
                        if (!Validator.validatePassword(value)) {
                            return {password: "Password must be at least 8 characters long and contain at least one number"};
                        }
                        break;
                    case 'name':
                        if (!Validator.validateName(value)) {
                            return {name: "Name must be at least 2 characters long"};
                        }
                        break;
                    default:
                        // validate it as string (not empty)
                        if (typeof value !== 'string' || value.trim().length === 0) {
                            return {email: `${key} must be a non-empty string`};
                        }
                        break;
                }
            }
        }
        return true;
    }
}