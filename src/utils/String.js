import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";

const BASE_URL ="https://firefly-simple-pheasant.ngrok-free.app/"
export const axiosClient = axios.create({
    baseURL : BASE_URL
})
export const MASKING_STEP ="masking_step";
export const MASKING_EDITING_URL ="masked_based_img_editing";
export const ERASE_OBJECT = "erase_object";
let ENHANCE_PRMOPT_BASE_URL = ""

// export const setURL = async() =>{
//    ENHANCE_PRMOPT_BASE_URL = await AsyncStorage.getItem('baseUrl');
// }
// export const axiosClientEnhancePrompt = axios.create({
//     setURL,
//     baseURL:ENHANCE_PRMOPT_BASE_URL
// })
export const axiosClientEnhancePrompt = axios.create();

// Interceptor to set baseURL dynamically
axiosClientEnhancePrompt.interceptors.request.use(
  async (config) => {
    // Check if the ENHANCE_PRMOPT_BASE_URL is not set or empty
    if (!ENHANCE_PRMOPT_BASE_URL) {
      // Retrieve the URL from AsyncStorage
      ENHANCE_PRMOPT_BASE_URL = await AsyncStorage.getItem("baseUrl");
    }

    // Set the baseURL dynamically in the axios config
    config.baseURL = ENHANCE_PRMOPT_BASE_URL;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export const ENHANCE_PRMOPT_URL ="enhance_prompt";
