import * as  React from 'react';
import { BlotBase, Blot } from 'byted-syl-editor'
import imageEmitter from '../emitter';
import { catchPicture, replaceWeiliUrl } from './api';
import { getURI } from '../getURI';
import { default as request } from '../upload/request';
import { getConfig } from '../config';

const breakImgUrl = `http://mp.toutiao.com/profile_v3/graphic/publish`

type SuccessRet = {
    url,
    height,
    width
}
type FailRet = {
    state,
    reason
}

function isBlobUrl(url) {
    return url.indexOf('blob') === 0
}

class Image extends React.Component<{
    url: string;
    ic: boolean;
    icUri: string;
    naturalHeight: string;
    naturalWidth: string;
    srcType: number;
}, {}> {
    render() {
        return (
            // @ts-ignore
            <img
                className={`${isBlobUrl(this.props.url) ? 'Editable-imageUploader-image' : ''}`}
                ref="imageInstance"
                src={this.props.url || ''}
                data-ic={this.props.ic}
                data-ic-uri={this.props.icUri}
                data-height={this.props.naturalHeight || 0}
                data-width={this.props.naturalWidth || 0}
                // @ts-ignore
                image_type={this.props.srcType || 1}
                // @ts-ignore
                web_uri={getURI(this.props.url) || ''}
                // @ts-ignore
                img_width={this.props.naturalWidth || 0}
                // @ts-ignore
                img_height={this.props.naturalHeight || 0}
            />
        )
    }
}

class Img extends React.Component<any, any> {
    imageDom;
    store;
    captionInput: HTMLInputElement;
    editMenuInstance;
    state = {
        ...this.props as {
            caption: string,
            ic: boolean | string,
            url: string,
            icUri: string;
            naturalHeight: string | number,
            naturalWidth: string | number,
            link: string,
            blot: any,
        },
        finalInput: this.props.caption,
        srcType: this.props.srcType || 1,
    }

    constructor(props) {
        super(props);
        this.updateEditImageUrl = this.updateEditImageUrl.bind(this);
    }

    public componentDidMount() {
        if (this.state.url.indexOf('blob') === 0) {

        } else if (!/(bytecdn|pstatp)/.test(this.state.url)) {
            console.log('Before catchPicture')
            catchPicture({ external_image_url: this.state.url }).then(res => {
                console.error('catchPicture error', res, this.state);
                if (res.url === '') {
                    this.state.blot.error('图片粘贴失败，请手动上传！')
                } else {
                    this.setState({
                        url: res.url,
                        naturalHeight: res.images[0].height,
                        naturalWidth: res.images[0].width,
                    })
                }
            }).catch(e => {
                console.log('catch when catchPicture')
                console.error(e);
                this.state.blot.error('图片粘贴失败，请手动上传！')
                this.setFailImg()
            })
        } else {
            if (this.state.url.indexOf('/weili/') > -1) {
                replaceWeiliUrl(this.state.url).then((url: string) => {
                    this.setState({
                        url
                    })
                })
            }
        }
        this.props.getInstance(this);
        this.captionInput.onmousedown = e => {
            e.stopPropagation();
        };
        imageEmitter.emit('getCore', this);
    }

    setFailImg = () => {
        this.setState({
            url: breakImgUrl,
            naturalHeight: 16,
            naturalWidth: 16,
        })
    }

    updateEditImageUrl(data) {
        const { url, msg, width, height } = data;
        this.setState({
            url,
            naturalWidth: width,
            naturalHeight: height,
        });
    }

    render() {
        return (
            <div
                className="pgc-image pgc-card-fixWidth"
                // onTouchStart={}
                ref={el => {
                    this.imageDom = el;
                }}
            >
                <div className="pgc-img-wrapper">
                    {this.state.link ? (
                        <a
                            href={this.state.link}
                            target="_blank"
                            data-link={this.state.link}
                        >
                            {
                                // @ts-ignore
                                <Image
                                    ref="imageInstance"
                                    {...this.state}
                                />
                            }
                        </a>
                    ) : (
                            // @ts-ignore
                            <Image
                                ref="imageInstance"
                                {...this.state}
                            />
                        )}
                    {isBlobUrl(this.state.url) &&
                        <div className="Editable-imageUploader-status">
                            <div className="Editable-imageUploader-statusText">
                                图片上传中
                                </div>
                        </div>

                    }
                </div>
                <div className="pgc-img-caption-wrapper">
                    <input
                        ref={el => {
                            this.captionInput = el;
                        }}
                        onChange={e =>
                            this.setState({
                                caption: e.target.value.slice(0, 50),
                            })
                        }
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            this.store.core.disable();
                            if (document.activeElement !== e.currentTarget) {
                                this.captionInput.focus();
                            }
                        }}
                        onKeyDown={e => {
                            e.stopPropagation();
                            if (e.keyCode === 13) {
                                e.preventDefault();
                                this.captionInput.blur();
                            }
                        }}
                        onPaste={e => {
                            const caption = e.clipboardData.getData(
                                'text/plain',
                            );
                            if (caption) {
                                this.setState({
                                    caption: caption.slice(0, 50),
                                });
                                e.preventDefault();
                                e.stopPropagation();
                            }
                        }}
                        onBlur={e => {
                            this.store.core.enable();
                            this.setState({
                                finalInput: e.target.value.slice(0, 50),
                            });
                        }}
                        className="pgc-img-caption-ipt"
                        placeholder="图片描述(最多50字)"
                        value={this.state.caption}
                    />
                    <p className="pgc-img-caption">{this.state.finalInput}</p>
                </div>
            </div>
        );
    }
}



@Blot({
    closeIcon: '.pgc-img-wrapper',
    blotName: 'image',
    tagName: 'tt-image',
    domMatcher: [
        {
            matcher: 'div.pgc-img',
            handler: (node: HTMLImageElement) => {
                const imgDom = node.querySelector('img')
                if (imgDom.dataset['stock']) {
                    return false
                }
                const { src: url } = imgDom;
                const naturalHeight = imgDom.dataset['height'] || imgDom.getAttribute('img_height') || 100
                const naturalWidth = imgDom.dataset['width'] || imgDom.getAttribute('img_width') || 100
                const ic = imgDom.dataset['ic']
                const icUri = imgDom.dataset['icUri'] || ''
                const srcType = imgDom.getAttribute('image_type') || 1
                const captionDom = node.querySelector('.pgc-img-caption') as HTMLParagraphElement
                const captionDomInput = node.querySelector('input') as HTMLInputElement
                const caption = (captionDom && captionDom.innerText) || (captionDomInput && captionDomInput.value);
                const a = node.querySelector('a')
                const link = a && a.href || ''
                return {
                    url,
                    link,
                    caption: caption || '',
                    // @ts-ignore
                    ic: (ic === "true" || ic === true) ? true : false,
                    icUri,
                    naturalHeight,
                    naturalWidth,
                    srcType
                }
            }
        }, {
            matcher: 'img',
            handler: (node: HTMLImageElement) => {
                if (/^file:/.test(node.src)) {
                    return false
                }
                if (node.dataset['stock']) {
                    return false
                }
                const { src: url, height: naturalHeight, width: naturalWidth } = node;
                const ic = node && node.getAttribute('data-ic');
                /* if (!url || !url.match(/^(http|data)/)) {
                  return false;
                } */
                return {
                    url,
                    icUri: '',
                    link: '',
                    caption: '',
                    ic: (ic === "true") ? true : false,
                    naturalHeight,
                    naturalWidth,
                    srcType: 1
                }
            }
        }],
})
export class ImageBlot extends BlotBase {
    componentInstance;
    deltaCurrent: {
        link: string,
        url: string,
        ic: string | boolean,
        icUri: string;
        naturalHeight: string | number,
        naturalWidth: string | number,
        caption: string,
        srcType: number
    }
    blobImgReq;
    blobImgSrc;

    constructor(node, val) {
        super(node, val)
        if (val.file) {
            const { url, file } = val
            this.blobImgSrc = url
            this.uploadBlobImg(file)
        }
    }

    DOMs = {
        default: <Img blot={this} {...this.deltaCurrent} getInstance={(componentInstance) => this.getInstance(componentInstance)} />,
        upload: <div className="pgc-img">
            {this.deltaCurrent.link ?
                <a href={this.deltaCurrent.link} target="_blank" data-link={this.deltaCurrent.link}>
                    {
                        // @ts-ignore
                        <Image {...this.deltaCurrent} />
                    }
                </a>
                // @ts-ignore
                : <Image {...this.deltaCurrent} />
            }
            <p className="pgc-img-caption">{this.deltaCurrent.caption}</p>
        </div>
    }

    getInstance(componentInstance) {
        this.componentInstance = componentInstance;
    }

    updateDOMs(obj) {
        this.componentInstance.setState({
            ...Object.assign(this.componentInstance.state, obj)
        })
    }

    uploadBlobImg(file) {
        const self = this
        const action = getConfig().action;
        this.blobImgReq = request({
            action,
            filename: file.name,
            file,
            data: {
                type: file.type
            },
            formDataFileFiled: 'upfile',
            headers: {},
            withCredentials: false,
            onProgress: () => { },
            onError: (e) => {
                console.log('uploadBlobImg')
                console.log(e)
                self.error('图片粘贴失败，请手动上传！')
                self.componentInstance.setFailImg()
                self.removeBlobImgSrc()
            },
            onSuccess: (ret: SuccessRet | FailRet) => {
                if ((ret as SuccessRet).url) {
                    const { url, width, height } = ret as SuccessRet
                    self.updateDOMs({
                        url,
                        naturalHeight: height,
                        naturalWidth: width
                    })
                } else {
                    self.error('图片粘贴失败，请手动上传！')
                    self.componentInstance.setFailImg()
                    console.log(ret)
                }
                self.removeBlobImgSrc()
            }
        })
    }

    removeBlobImgSrc() {
        window.URL.revokeObjectURL(this.blobImgSrc)
        delete this.blobImgReq
    }

    static converter(node) {
        const imgDom = node.querySelector('img')
        if (imgDom.dataset['stock']) {
            return false
        }
        const { src: url } = imgDom;
        const naturalHeight = imgDom.dataset['height'] || imgDom.getAttribute('img_height') || 100
        const naturalWidth = imgDom.dataset['width'] || imgDom.getAttribute('img_width') || 100
        const icUri = imgDom.dataset['icUri'] || ''
        const srcType = imgDom.getAttribute('image_type') || 1
        const ic = imgDom.dataset['ic']
        const captionDom = node.querySelector('.pgc-img-caption') as HTMLParagraphElement
        const captionDomInput = node.querySelector('input') as HTMLInputElement
        const caption = (captionDom && captionDom.innerText) || (captionDomInput && captionDomInput.value);
        const a = node.querySelector('a')
        const link = a && a.href || ''
        return {
            url,
            icUri,
            link,
            caption: caption || '',
            ic: (ic === "true" || ic === true) ? true : false,
            naturalHeight,
            naturalWidth,
            srcType
        }
    }
}

export default ImageBlot
