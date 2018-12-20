import * as React from 'react';
import AjaxUpload from './AjaxUploader';

function empty() {
}

class Upload extends React.Component<any, any> {
  uploader: any
  static defaultProps = {
    component: 'span',
    prefixCls: 'syl-img-upload',
    data: {},
    formDataFileFiled: null,
    headers: {},
    filename: null,
    multipart: false,
    onReady: empty,
    onStart: empty,
    onError: empty,
    onSuccess: empty,
    multiple: false,
    beforeUpload: null,
    customRequest: null,
    withCredentials: false,
  }

  componentDidMount() {
  }

  abort(file) {
    this.uploader.abort(file);
  }

  saveUploader = (node) => {
    this.uploader = node;
  }

  clickUploader = () => {
    this.uploader.onClick()
  }

  render() {
    return <AjaxUpload {...this.props} ref={this.saveUploader} />;
  }
}

export default Upload;