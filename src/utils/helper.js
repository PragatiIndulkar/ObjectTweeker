import axios from "axios";
import { useState } from "react";
import { Alert } from "react-native";

export const runAxiosAsync = async (promise) => {
    try {
        const response = await promise;
        return response.data;
    } catch (error) {
        let message = error.message;
        if (axios.isAxiosError(error)) {
            console.log("This is an instance of AxiosError", error.response);
            const response = error.response;
            if (response) {
                console.log("error:", response.data);
                message = response.data.message;
            }
        }
        return error.response.status;
    }
};
