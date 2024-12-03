import { IUserType, ResetPasswordResponse } from '../types/IUser'
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
        const encryptedPassword = await hashPassword(formData.password); // השתמש ב-await כדי לקבל את התוצאה המגובבת
        const { confirmPassword, ...rest } = formData; // מסננים את confirmPassword
        const data = {
            ...rest,                // כל הערכים מ- formData, מלבד confirmPassword
            password: encryptedPassword,  // עדכון password
            age: calculateAge(formData.dateOfBirth)
        };
        console.log("confirmPassword", confirmPassword);
        console.log("data:", data);
        const response = await axios.post(`${apiUrl}`, data);
      
        if (response.data && response.status === 201 || response.status === 200) {
          console.log("Response Data after signup:", response.data.data);
            setUser(response.data.data); // עדכון ה-store
            console.log("User state after signup:", useUser.getState());
            return { success: true, data: response.data };
        } else {
            const message = response.data?.message || "Unknown error occurred during signup.";
            return { success: false, message, status: response.status };
        }
    } catch (error) {
        console.error("Error during signup:", error);
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || "שגיאה לא צפויה";
            const status = error.response?.status || 500;
            return { success: false, message, status };
        } else {
            return { success: false, message: "שגיאה פנימית במערכת", status: 500 };
        }
    }
};


export const signin = async (email: string, password: string) => {
    try {
        const encryptedPassword = await hashPassword(password)
        console.log(email, encryptedPassword)
        const response = await axios.post("/api/signIn", { email, password: encryptedPassword });
        console.log('Login successful:', response.data);
        console.log(":",response.data);
        return response.data;
    } catch (error) {
        console.error('Error during login:', error);
        if (axios.isAxiosError(error)) {
            console.log("ax: ",error);
            const message = error.response?.data?.message || "שגיאה לא צפויה";
            const status = error.response?.status || 500;
            return { success: false, message, status };
        } else {
            // אם מדובר בשגיאה שאינה קשורה ל-axios
            return { success: false, message: "שגיאה פנימית במערכת", status: 500 };
        }
    }
}

export const resetPassword = async (token: string, password: string): Promise<ResetPasswordResponse> => {
    // const secretKey = 'mySecretKey';
    const encryptedPassword = await hashPassword(password)
    try {
        console.log("token   ", token, "en  ", encryptedPassword)
        const response = await axios.put(`/api/reset-password`, { token: token, password: encryptedPassword });
        console.log("response:", response);
        if (response.status === 200) {
            return { message: "Password reset successful" };
        } else {
            // אם יש שגיאה כלשהי שנחזקה בתגובה, מכניסים אותה לכאן
            return { error: response.data.error || "Unexpected error occurred" };
        }
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                const { status, data } = error.response;
                if (status === 400) {
                    console.error("Validation error:", data.error);
                    return data.error; // החזרת הודעת שגיאה ללקוח
                } else if (status === 404) {
                    console.error("User not found:", data.message);
                    return data.message; // החזרת הודעת שגיאה ללקוח
                } else if (status === 500) {
                    console.error("Server error:", data.error);
                    return "Internal server error. Please try again later.";
                }
            } else {
                console.error("Request failed:", error.message);
                return "Network error. Please check your connection.";
            }
        } else {
            console.error("Unexpected error:", error);
            return "An unexpected error occurred. Please try again.";
        }
    }
}
//Esty1234%