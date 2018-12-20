import * as React from 'react';
import * as Button from "byted-tui2/lib/button";
import * as Icon from 'byted-tui2/lib/icon';
import { SortableContainer, arrayMove } from 'react-sortable-hoc'
import { default as Upload } from "./upload/upload";
import { default as ImageItem } from "./ImageItem";
import 'byted-tui2/lib/button/style/index.less'
import 'byted-tui2/lib/icon/style/index.less'
import { getConfig } from '../../../config';
import api from './api'
import "./index.less";


const ImageList = SortableContainer(({ images, onClickUpload, onDelete = () => { }, canUpload = true }) => {
    images.sort((a, b) => a.id - b.id)
    return (
        <ul className="image-list">
            {
                images.map((image, index) => (
                    <ImageItem key={image.id} image={image} index={index} onDelete={onDelete} />
                ))
            }
            {
                canUpload && <li className="image-item-upload" onClick={onClickUpload}>
                {/*
                // @ts-ignore */}
                <Icon className="icon" type="add" />
                </li>
            }
        </ul>
    );
})

let uuidTrick = 0;
export default class UploadImagePanel extends React.Component<{
    handleConfirm,
    handleMore,
    handleClose,
    maxNum?,
}, {
    images: any[]
    recommendImages: any[]
    errorHint: string,
    saveToResource: boolean,
    term?: string
}> {
    uploaderProps;
    uploader;
    files = {};
    constructor(props) {
        super(props);
        this.state = {
            images: [],
            recommendImages: [],
            errorHint: null,
            saveToResource: false,
        };
        const self = this;

        const action = getConfig().action;

        this.uploaderProps = {
            action,
            multiple: true,
            accept: 'image/jpeg,image/jpg,image/png,image/x-png,image/gif',
            formDataFileFiled: 'upfile',
            data: (file) => {
                return {
                    type: file.type
                }
            },
            beforeUpload(file) {
                uuidTrick++;
                file.id = +(new Date) + '' + uuidTrick;
                // 图片预览
                const url = window.URL.createObjectURL(file)
                self.files[file.id] = url
                const img = new Image()
                img.onload = () => {
                    const { naturalHeight, naturalWidth } = img
                    // 检查图片尺寸
                    if (naturalHeight * naturalWidth >= 120 * 1000 * 1000) {
                        self.uploader.abort(file)
                        setTimeout(() => {
                            self.setState({
                                images: self.state.images.concat({
                                    id: file.id,
                                    url,
                                    state: '图片像素过高'
                                })
                            })
                        }, 0)
                        return
                    } else {
                        setTimeout(() => {
                            self.setState({
                                images: self.state.images.concat({
                                    id: file.id,
                                    percent: 0,
                                    url
                                })
                            })
                        }, 0)
                    }
                }
                img.src = url
            },
            onStart: (file) => {
                // console.log('onStart', file.name);
            },
            onSuccess(ret, file) {
                // 替换对应file.id
                window.URL.revokeObjectURL(self.files[file.id])
                self.setState({
                    images: self.state.images.map((image) => {
                        if (image.id === file.id) {
                            if (ret.state === '上传失败') {
                                return {
                                    ...image,
                                    state: ret.reason
                                }
                            }
                            return {
                                id: file.id,
                                ...ret,
                            }
                        }
                        return image
                    })
                })
            },
            onProgress(step, file) {
                self.setState({
                    images: self.state.images.map((image) => {
                        if (image.id === file.id) {
                            return {
                                ...image,
                                percent: step.percent
                            }
                        }
                        return image
                    })
                })
            },
            onError(err, ret, file) {
                // 设置state为ERROR
                self.setState({
                    images: self.state.images.map((image) => {
                        if (image.id === file.id) {
                            return {
                                ...image,
                                state: '上传失败，请重试'
                            }
                        }
                        return image
                    })
                })
            },
        }
    }

    componentDidMount() {
    }

    onSortEnd = ({ oldIndex, newIndex }) => {
        let newImages = [...this.state.images]
        let tempIndex = newImages[oldIndex].id
        newImages[oldIndex].id = newImages[newIndex].id
        newImages[newIndex].id = tempIndex
        this.setState({
            images: arrayMove(newImages, oldIndex, newIndex),
        });
    };

    handleImageDelete = (deletedImage) => {
        // TODO: 终止请求？
        this.setState({
            images: this.state.images.filter((image) => {
                if (image.id === deletedImage.id) {
                    return false;
                }
                return true;
            })
        })
    }

    handleConfirm = () => {
        if (this.state.saveToResource) {
            const promises = this.state.images.map((image) => {
                return api.addImageToResource({ resource_id: image.origin_web_uri })
            })
            Promise.all(promises).then()
        }
        const confirmImages = this.state.images.filter(image => image.state === 'SUCCESS').map((image) => {
            // 埋点
            return {
                ic: false,
                url: image.url,
                naturalHeight: image.height,
                naturalWidth: image.width,
                srcType: image.image_type || 1
            };
        })
        this.props.handleConfirm(confirmImages)
    }

    componentWillUnmount() {
        this.state.images.filter(image => /^blob:/.test(image.url)).map((image) => {
            window.URL.revokeObjectURL(image.url)
        })
    }

    render() {
        return (
            <div className="upload-image-panel">
                {this.state.images.length > 0 &&
                    [
                        <div className="upload-image-tips">
                            <a target="_blank" href="https://www.toutiao.com/c/user/84416079614/#mid=1601987405114382">配图小助手</a>
                        </div>,
                        // @ts-ignore
                        <ImageList
                            images={this.state.images}
                            onSortEnd={this.onSortEnd} axis='xy'
                            onClickUpload={() => { this.uploader.clickUploader() }}
                            onDelete={this.handleImageDelete}
                            canUpload={this.props.maxNum ? this.state.images.length < this.props.maxNum : true}
                        />
                    ]}
                <div className="image-upload-trigger">
                    <div className="dnd" style={{ display: this.state.images.length === 0 ? 'block' : 'none' }} data-e2e="image-upload">
                        <div className="icon"></div>
                        <Upload
                            {...this.uploaderProps}
                            ref={(el) => {
                                this.uploader = el;
                            }}
                        >
                            {/*
                            // @ts-ignore */}
                            <Button type="primary">
                                选择图片
                            </Button>
                        </Upload>
                        <p>支持绝大多数图片格式，单张图片最大支持5MB</p>
                    </div>


                    {this.state.images.length !== 0 ? <div>
                        <p style={{ fontSize: 12, textAlign: 'center' }}>上传完成，可以拖拽调整图片顺序</p>
                        <div className="confirm">
                            {/*
                            // @ts-ignore */}
                            <Button onClick={() => this.props.handleClose()}>取消</Button>
                            {/*
                            // @ts-ignore */}
                            <Button
                                data-e2e="imageUploadConfirm-btn"
                                type="primary"
                                onClick={this.handleConfirm}>确认</Button>
                        </div>
                    </div> : null}
                </div>
            </div>
        );
    }
}
