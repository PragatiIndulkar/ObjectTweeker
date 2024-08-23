import axios from "axios";


const BASE_URL ="https://firefly-simple-pheasant.ngrok-free.app/"
export const axiosClient = axios.create({
    baseURL : BASE_URL
})
export const MASKING_STEP ="masking_step";
export const MASKING_EDITING_URL ="masked_based_img_editing";
const ENHANCE_PRMOPT_BASE_URL = "http://suddenly-fine-mantis.ngrok-free.app/"
export const axiosClientEnhancePrompt = axios.create({
    baseURL:ENHANCE_PRMOPT_BASE_URL
})
export const ENHANCE_PRMOPT_URL ="enhance_prompt";

