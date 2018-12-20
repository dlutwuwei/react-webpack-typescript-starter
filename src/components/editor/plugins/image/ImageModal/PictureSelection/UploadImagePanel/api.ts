import { default as api } from '../api';

type RecommendResponse = {
    msg: string;
    data: {
        term: string;
        totalCount: number;
        hits: Array<{
            disorder: number;
            height: number;
            id: string;
            image_source: string;
            img: string;
            remark: string;
            score: number;
            small_img: string;
            status: number;
            title: string;
            uploaded_at: string;
            width: number;
        }>
    }
}

/**
 * 用于添加上传图片到资源库
 *
 * @returns
 */
const addImageToResource = ({ resource_id }) => {
    return api.post('/article/change_media_resource_ref/', {
        resource_id,
        resource_type: 3,
        operation: 'add'
    });
}

const getUriByIcid = (ic_id, term) => {
    return api.get('/article/get_dongfangIC_uri_v2/', {
        params: {
            ic_id,
            term,
            noCache: +new Date()
        }
    });
}


export default {
    addImageToResource,
    getUriByIcid
}
