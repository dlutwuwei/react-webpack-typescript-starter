/* eslint-disable */
import { default as api } from '../../../api';

// 简要介绍糊图替换逻辑，首先把图片通过upload接口上传。然后根据之前的url去调用检测接口（接口可能返回trigger，所以要轮询。。妈耶），成功后会返回是否是糊图。
// 知道是糊图后前端点击替换会调用搜索接口
// 这接口 坑啊 +1

/**
 * 糊图上传
 *
 * @param {any} params
 * @returns
 */
const uploadCheck = {};
export const blurryCheckUpload = ({image_info}) => {
  return cache[image_info[0].url] ? cache[image_info[0].url]:cache[image_info[0].url] = api.post('/micro/image/upload', {
    platform: 'toutiaohao',
    position: 'articleup_sub',
    // image_info: JSON.stringify(image_info),
    image_info: JSON.stringify(image_info)
  }).then(res => {
    delete cache[image_info[0].url];
    return res
  }, err => {
    delete cache[image_info[0].url];
    return Promise.reject(err)
  })
};
// [{"url":"https://p1.pstatp.com/large/pgc-image/151566521411371dc3cadea","remark":"","title":"","content":"","width":"125","height":"156"}]

export const blurryCheck = ({image_url}) => {
  if(image_url.indexOf('//') === 0) {
    image_url = 'http:' + image_url
  }
  return api.get('/micro/image/check', {
    params: {
      platform: 'toutiaohao',
      position: 'articleup_sub',
      // image_url,
      image_url: image_url,
      noCache: +new Date(),
    }
  });
}
export const qrCodeCheck = (image_url) => {
  if(image_url.indexOf('//') === 0) {
    image_url = 'http:' + image_url
  }
  return api.post('/article/check_qrcode/', {
    image_urls: image_url
  })
}

const cache = {};
export const catchPicture = ({external_image_url}) => {
  return cache[external_image_url]? cache[external_image_url] : cache[external_image_url] = api.post('/tools/catch_picture/', {
    upfile: external_image_url,
    version: 2,
  }).then(ret => {
    delete cache[external_image_url];
    return ret;
  }, err => {
    delete cache[external_image_url];
    return Promise.reject(err);
  })
}

export const getURI = url => {
    let uri = '';
    const uriList = ['pgc-image/', 'dfic-imagehandler/', 'weili/'];
    uriList.forEach(uriItem => {
        let index;
        if ((index = url.indexOf(uriItem)) !== -1) {
            uri = url.slice(index);
        }
    });

    return uri;
};


export function replaceWeiliUrl(url) {
    if (!(url.indexOf('/weili/') > -1)) {
        return url;
    }
    return window.Garr.network({
        url: 'https://dficimage.toutiao.com/api/uploadbyurls',
        method: 'post',
        data: JSON.stringify({
            params: {
                ParamsList: [
                    {
                        ImageSourceUrl: url,
                        UserId: window.Garr.pgc_info.user.id,
                        UserName: window.Garr.pgc_info.user.screen_name,
                    }
                ]
            }
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(function (resp) {
        if (resp.data.BaseResp.StatusCode === 0) {
            return Promise.resolve(resp.data.DetailsList[0].ImageUrl)
        }
        return url;
    }).catch(err => {
        console.error(err);
        return Promise.resolve(url);
    })
}
