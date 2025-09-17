import User from "../types/user";
import { apiHandler } from "./apiFetchHandler";
import {
    AUTH_LOGIN_API_URL,
    AUTH_SIGNUP_API_URL,
    AUTH_LOGOUT_API_URL,
    USER_API_URL
} from "../constants/constants";

export const signUpNewUser = (email: string, password: string) => apiHandler(
    // Where to check password matching?
    `${AUTH_SIGNUP_API_URL}`, {
        method: 'POST',
        body: JSON.stringify({
            "email": email,
            "password": password,
        })
    })

export const loginUser = (email: string, password: string) => apiHandler(
    `${AUTH_LOGIN_API_URL}`, {
        method: 'POST',
        credentials: 'include',  // login API route need this for cookies to be set in a response
        body: JSON.stringify({
            "email": email,
            "password": password,
        })
    })

export const getCurrentUser = () => apiHandler<User>(
    `${USER_API_URL}`, {
        method: 'GET',
        credentials: 'include'
})

export const logoutUser = () => apiHandler(`
    ${AUTH_LOGOUT_API_URL}`, {
        method: 'POST',
        credentials: 'include'
    })

export const deleteUser = () => apiHandler(
    `${USER_API_URL}`, {
        method: 'DELETE',
        credentials: 'include'
    })

interface UpdateUserData {
    email?: string;
    passwordUpdate?: {
        old_password: string;
        new_password: string;
        confirm_password: string;
    }
}

export const updateUserData = async (data: UpdateUserData) => {
    const body: Record<string, string> = {};

    if (data.email) {
        body.email = data.email;
    }

    if (data.passwordUpdate) {
        const { old_password, new_password, confirm_password } = data.passwordUpdate;
        body.old_password = old_password;
        body.new_password = new_password;
        body.confirm_password = confirm_password;
    }

    const response = await apiHandler(`${USER_API_URL}`, {
        credentials: 'include',
        method: 'PATCH',
        body: JSON.stringify(body)
    })
    return response
}


// 1. Client-side validation (before sending the request)
// Do this before calling updateUserData(). It's useful for giving fast feedback to the user.
// You can Use basic inline checks Or use a validation library like zod or yup for structured validation

// 🔧 Example (with inline validation):
// const handleUpdate = async () => {
//   const data = {
//     email,
//     passwordUpdate: {
//       old_password,
//       new_password,
//       confirm_password,
//     }
//   };

//   // Example inline validation
//   if (data.passwordUpdate) {
//     const { old_password, new_password, confirm_password } = data.passwordUpdate;
//     if (!old_password || !new_password || !confirm_password) {
//       alert("All password fields are required.");
//       return;
//     }
//     if (new_password !== confirm_password) {
//       alert("New passwords do not match.");
//       return;
//     }
//     if (new_password.length < 8) {
//       alert("Password must be at least 8 characters.");
//       return;
//     }
//   }
//   // Make the API call
//   await updateUserData(data);
// };