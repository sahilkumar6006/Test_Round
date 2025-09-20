import { httpService } from "../services";


export interface getImagesResponse {
    status: string;
    images:  {
        id: string;
        xt_image: string;
    }[]
}

export const getImagesData =async (user_id: string, type: string, offset: number): Promise<getImagesResponse> => {
    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('offset', offset.toString());
    formData.append('type', type);
    const response  = await  httpService.postFormData('/getdata.php', formData);
    return response?.data
}