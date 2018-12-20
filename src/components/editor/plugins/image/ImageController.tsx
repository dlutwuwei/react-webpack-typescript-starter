import * as React from "react";
import ImageModal from './ImageModal'
import { SylButton } from 'byted-syl-editor';
import imageEmitter from './emitter';

interface Range {
    startContainer: HTMLElement,
    startOffset: number,
    [x: string]: any;
}

document.addEventListener("paste", function (e: ClipboardEvent) {
    let items = Array.prototype.slice.call(e.clipboardData.files);
    if (items.length === 0) {
        // e.preventDefault();
    } else {
        if (e.clipboardData.getData('text/html')) {
            return;
        }
        e.preventDefault();
        imageEmitter.emit("dragFiles", items);
    }
})

document.body.addEventListener("drop", function dropFileHandler(evt) {
    let files: File[] = Array.prototype.slice.call(evt.dataTransfer.files);
    let ref = evt.target;
    if (files.length) {
        evt.dataTransfer.clearData();
        evt.dataTransfer.setData("text/html", "<p>\UFEFF</p>");
        // get x and y coordinates of the dropped item
        let x = evt.clientX;
        let y = evt.clientY;
        let range = null
        if ((document as any).caretPositionFromPoint) {
            let pos = (document as any).caretPositionFromPoint(x, y);
            range = document.createRange();
            range.setStart(pos.offsetNode, pos.offset);
            range.collapse();
        } else if (document.caretRangeFromPoint) {
            /* chrome 走这里 */
            range = document.caretRangeFromPoint(x, y);
        }
        evt.preventDefault();
        imageEmitter.emit("dragFiles", files, range)
    }
});

class ImageController implements SylButton {
    imageModal;
    blurryReplacerModal;
    name = "image";
    icon = "pic_tool"
    tooltip = "插入图片";
    store;
    blobImgReqs = {};
    emitter: any;
    constructor(componentInstance) {
        this.store = componentInstance.store;
        imageEmitter.off('dragFiles');
        imageEmitter.off('clickBlurryReplacer')
        imageEmitter.on('clickBlurryReplacer', (blot, node) => {
            this.blurryReplacerModal && this.blurryReplacerModal.open(blot);
        })
        imageEmitter.on('dragFiles', (files: File[], index?: number | Range) => {
            this.addImage(files, index)
        })
        imageEmitter.on('getCore', (blot) => {
            blot.store = this.store
        })
    }

    public insertCoreCard = (data: any, index?: number, length?: number) => {
        const core = this.store.core;
        if (!core) return;
        if (typeof index === 'number') {
            core.setSelection({ index, length })
        }
        const range = core.getSelection();
        if (Array.isArray(data)) {
            return data.map(d => this.insertCoreCard(d))
        }

        const cardName = Object.keys(data)[0];
        core.insertCard(cardName, data[cardName], range.index, 'user')
    }

    public listenImageInsert(emit: any) {
        if (!emit) return;
        emit.subscribe(this.insertCoreCard);
    }

    addImage(files: File[], ref?: Number | Range) {
        let index;
        if (typeof ref === "number") {
            index = ref;
        } else if (!ref && ref !== 0) {
            index = this.store.core.getSelection().index;
        } else if ((ref as Range).startContainer) {
            index = this.store.core.findIndex((ref as Range).startContainer) + (ref as Range).startOffset;
        }
        files.map(file => {
            const url = window.URL.createObjectURL(file);
            this.emitter.emit({
                'image': {
                    url,
                    file
                }
            }, index)
        })
    }
    // @ts-ignore
    handler = (modalOption?: {
        defaultPanel: string,
        search_from?: string,
        term: string
    }) => {
        this.imageModal && this.imageModal.open({
            store: this.store,
            ...(modalOption || {})
        });
        const emit = this.imageModal ? this.imageModal.result(true) : null;
        this.listenImageInsert(emit);
    }

    validator(hook) {
        let items = this.store.core.getContents();
        if (items.ops.filter((item: any) => item.insert && item.insert.image && item.insert.image.url && (!/(bytecdn|pstatp)/.test(item.insert.image.url))).length) {
            return "图片上传失败，请重新上传！"
        } else {
            return true;
        }
    }
    reactDom = [
        // @ts-ignore
        <ImageModal
            key="image-modal"
            ref={el => {
                this.imageModal = el;
            }}
        />
    ]
};


export default ImageController
