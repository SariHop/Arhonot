import { IUserType } from '../types/IUser'
import axios from 'axios';
export const apiUrl = "/api/userRoute";
import useUser from '@/app/store/userStore';


async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

function calculateAge(birthDate: Date): number {
    const today = new Date(); // התאריך הנוכחי
    let age = today.getFullYear() - birthDate.getFullYear(); // הפרש בשנים
    const monthDifference = today.getMonth() - birthDate.getMonth();
    const dayDifference = today.getDate() - birthDate.getDate();

    // אם החודש הנוכחי קטן מחודש הלידה או אותו חודש אך היום עדיין לא עבר את יום ההולדת, מפחיתים שנה אחת
    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
        age--;
    }

    return age;
}

export const signup = async (formData: IUserType) => {
    const { setUser} = useUser.getState();
    try {
        // const secretKey = 'mySecretKey'; // מפתח סודי שיש להגדיר מראש
        const encryptedPassword = await hashPassword(formData.password); // השתמש ב-await כדי לקבל את התוצאה המגובבת
        alert(`${formData.password} = ${encryptedPassword}`);  // עכשיו יופיע הסיסמה המגובבת

        console.log('הסיסמא המוצפנת בצד הלקוח:', encryptedPassword);

        const { confirmPassword, ...rest } = formData; // מסננים את confirmPassword
        const data = {
            ...rest,                // כל הערכים מ- formData, מלבד confirmPassword
            password: encryptedPassword,  // עדכון password
            age: calculateAge(formData.dateOfBirth)
        };
        console.log("confirmPassword", confirmPassword);
        console.log("data:", data);
        const response = await axios.post(`${apiUrl}`, data);
        if (response.data && response.data.success) {
            console.log("Response Data after signup:", response.data.data);
            setUser(response.data.data); // עדכון ה-store
            console.log("User state after signup:", useUser.getState());
        }
        return response.data;
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
        const response = await axios.post("/api/signIn", { email, password: encryptedPassword });
        console.log(response)
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