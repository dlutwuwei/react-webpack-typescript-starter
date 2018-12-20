import * as React from "react";
import { BaseModal } from "byted-syl-editor";
import "./index.less";
import Modal from "react-responsive-modal";
import { PictureSelection } from './PictureSelection';
import { AsyncResource } from "async_hooks";

const tempImageObj = {
    url: '',
    link: '',
    icUri: '',
    ic: false,
    caption: '',
    naturalHeight: 100,
    naturalWidth: 100,
    srcType: 1
}

export default class ImageModal extends BaseModal {
    public allowTabs = [
        'upload' as 'upload',
        'freeSearch' as 'freeSearch',
        'chinese' as 'chinese',
        'material' as 'material'
    ]

    constructor(props) {
        super(props);

        this.onImageInsert = this.onImageInsert.bind(this);
    }

    public onImageInsert(imageObjs) {
        console.info('insert image:', imageObjs);
        if (Array.isArray(imageObjs)) {
            imageObjs.forEach(imageObj => {
                const imageDelta = Object.assign({}, tempImageObj, imageObj, {
                    // ic 不希望 caption 被插入
                    caption: ''
                });
                this.emit({
                    'image': imageDelta
                })
            })
        } else {
            this.emit({
                'image': Object.assign({}, tempImageObj, imageObjs, {
                    // ic 不希望 caption 被插入
                    caption: ''
                })
            })
        }
    }

    public render() {
        let { openFirstModal } = this.state;
        return (
            <Modal
                classNames={{ modal: "image-modal syl-modal" }}
                closeIconSvgPath={''}
                closeIconSize={18}
                open={openFirstModal}
                onClose={this.onCloseFirstModal}
                little={true}
            >
                <PictureSelection
                    allowPanel={this.allowTabs}
                    defaultPanel={this.state.options.defaultPanel || this.allowTabs[0]}
                    source={'article'}
                    onImageInsert={this.onImageInsert}
                    close={this.close}
                    store={this.state.options.store}
                    iCSearchPanelOption={this.state.options || {}}
                    tabStyle={{
                        marginLeft: `-20px`
                    }}
                />
            </Modal>
        );
    }
}
