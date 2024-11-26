import { IUserType } from '../types/IUser'
// import axios from 'axios';
export const apiUrl = "/api/userRoute";

async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

export const signup = async (formData: IUserType) => {
    try {
        // const secretKey = 'mySecretKey'; // מפתח סודי שיש להגדיר מראש
        const encryptedPassword = await hashPassword(formData.password); // השתמש ב-await כדי לקבל את התוצאה המגובבת
        alert(`${formData.password} = ${encryptedPassword}`);  // עכשיו יופיע הסיסמה המגובבת

        console.log('הסיסמא המוצפנת בצד הלקוח:', encryptedPassword);

        const { confirmPassword, ...rest } = formData; // מסננים את confirmPassword
        const data = {
            ...rest,                // כל הערכים מ- formData, מלבד confirmPassword
            password: encryptedPassword  // עדכון password
        };
        console.log("confirmPassword", confirmPassword);
        console.log("data:", data);
        // const response = await axios.post(`${apiUrl}`, formData);
        // return response.data;
    } catch (error) {
        console.error("Error adding recipe:", error);
        throw error;
    }
};

export const signin = async (email: string, password: string) => {
    // const secretKey = 'mySecretKey';
    const encryptedPassword = await hashPassword(password)
    try {
        console.log(email, encryptedPassword)
        // const response = await axios.post(`${apiUrl}`, formData);
        // if (response.ok) {
        //     // Handle successful login (e.g., redirect)
        //     console.log('Login successful');
        // } else {
        //     const { message } = await response.json();
        //     throw new Error(message || 'Login failed');
        // }
    } catch (error) {
        console.error('Error during login:', error);
        throw new Error('An unexpected error occurred.');
    }
}