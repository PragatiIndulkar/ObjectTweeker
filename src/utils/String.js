import axios from "axios";


const BASE_URL ="https://firefly-simple-pheasant.ngrok-free.app/"
export const axiosClient = axios.create({
    baseURL : BASE_URL
})
export const MASKING_STEP ="masking_step";
export const MASKING_EDITING_URL ="masked_based_img_editing";
