function getError(option: Option, xhr: XMLHttpRequest) {
  const msg = `cannot post ${option.action} ${xhr.status}'`;
  const err: Error & {method, status, url} = Object.assign({
    status: xhr.status,
    method: 'post',
    url: option.action
  }, new Error(msg));
  return err;
}

function getBody(xhr) {
  const text = xhr.responseText || xhr.response;
  if (!text) {
    return text;
  }

  try {
    return JSON.parse(text);
  } catch (e) {
      console.error(e);
    return text;
  }
}

export declare type Option = {
  onProgress: (event: { percent: number }) => void,
  onError: (event: Error | ErrorEvent, body?: Object) => void,
  onSuccess: (body: Object, xhr: XMLHttpRequest) => void,
  data: Object,
  filename: string,
  file: File,
  withCredentials: Boolean,
  action: string,
  headers: Object,
  formDataFileFiled?: any,
}
export default function upload(option: Option) {
  console.log(option)
  const xhr = new XMLHttpRequest();

  if (option.onProgress && xhr.upload) {
    xhr.upload.onprogress = function progress(e: ProgressEvent & {percent: number}) {
      if (e.total > 0) {
        e.percent = e.loaded / e.total * 100;
      }
      option.onProgress(e);
    };
  }

  const formData = new FormData();

  if (option.data) {
    Object.keys(option.data).map(key => {
      formData.append(key, option.data[key]);
    });
  }

  if (option.formDataFileFiled) {
    // formData.append(name, value, filename);
    formData.append(option.formDataFileFiled, option.file, option.filename);
  } else {
    formData.append(option.filename, option.file);
  }


  xhr.onerror = function error(e: any) {
    option.onError(e);
  };

  xhr.onload = function onload() {
    // allow success when 2xx status
    // see https://github.com/react-component/upload/issues/34
    if (xhr.status < 200 || xhr.status >= 300) {
      return option.onError(getError(option, xhr), getBody(xhr));
    }

    option.onSuccess(getBody(xhr), xhr);
  };

  xhr.open('post', option.action, true);

  // Has to be after `.open()`. See https://github.com/enyo/dropzone/issues/179
  if (option.withCredentials && 'withCredentials' in xhr) {
    xhr.withCredentials = true;
  }

  const headers = option.headers || {};

  // when set headers['X-Requested-With'] = null , can close default XHR header
  // see https://github.com/react-component/upload/issues/33
  // add it to cros, hell opens its gate there
  // if (headers['X-Requested-With'] !== null) {
  //   xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  // }

  for (const h in headers) {
    if (headers.hasOwnProperty(h) && headers[h] !== null) {
      xhr.setRequestHeader(h, headers[h]);
    }
  }
  xhr.send(formData);

  return {
    abort() {
      xhr.abort();
    },
  };
}
