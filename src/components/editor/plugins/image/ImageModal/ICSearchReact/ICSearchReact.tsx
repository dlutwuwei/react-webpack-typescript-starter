// wiki  http://web-bnpm.byted.org/package/@byted/react-ic-search

import * as React from 'react';
import * as ReactIcSearch from '@byted/react-ic-search/dist/react-ic-search';
import '@byted/react-ic-search/dist/react-ic-search.css';
import { ErrorBoundary } from './ErrorBoundary';
import { IReactIcSearchProps, IReactIcSearchState, callbackInfo, editorOfferedImageInfo, imageInfo } from './types';

function getURI(origin: string, inclusive: boolean = true): string {
    const URL = [
        'pgc-image/',
        'dfic-imagehandler/',
        'weili/'
    ];
    let index: number = -1;
    URL.forEach(function (url) {
        if (origin.indexOf(url) > -1) {
            let prefix = inclusive ?  0 : url.length;
            index = prefix + origin.indexOf(url);
        }
    });

    return index > -1 ? origin.slice(index) : '';
}

const CAPTION_LIMIT_SIZE = 50;

enum tabPositionMapping {
    icstock = 'icstock',
    similar = 'similar',
    icguofeng = 'icguofeng',
    zhongbao_icstock = 'zhongbao_icstock',
    upload = 'upload',
    assist = 'assist'
}

export class ICSearchPanel extends React.Component<IReactIcSearchProps, IReactIcSearchState> {
    public static defaultProps = {
        confirm: () => { },
        cancel: () => { },
        close: () => { },
        maxSelectNum: 20,
        wrapperWidth: 660,
        wrapperHeight: 555,
        term: '',
        position: 'article',
        type: tabPositionMapping.icstock,
        domain: 'https://dficimage.toutiao.com',
        // domain: 'http://10.92.185.37:7001', // test ip
        images: []
    }

    private get _pgcInfo() {
        return {
            UserId: '',
            MediaId: '',
            UserName: '',
            Watermark: ''
        }
    }

    constructor(props) {
        super(props);

        this.classifyCallback = this.classifyCallback.bind(this);
    }

    public classifyCallback(info: callbackInfo<editorOfferedImageInfo>) {
        console.log('ICSearchReact callback info:', info);
        if (info) {
            switch (info.code) {
                case 0:
                    console.info('ICSearchReact close:', info);
                    this.props.close();
                    break;
                case 1:
                    console.info('ICSearchReact confirm:', info);
                    this.props.confirm(transferImage(info));
                    break;
                default:
                    break;
            }
        }
    }

    public render() {
        const { term, images, maxSelectNum, domain, position, type, similar, search_from,  ...handler } = this.props;
        const data = {
            ...this._pgcInfo,
            max: maxSelectNum,
            term,
            images,
            domain,
            search_from,
            position: `${position}_${type}`,
            similar,
        }
        return (
            <ErrorBoundary>
                <ReactIcSearch.ReactIcSearch
                    callback={this.classifyCallback}
                    data={data}
                />
            </ErrorBoundary>
        )
    }
}

function transferImage(infos: callbackInfo<editorOfferedImageInfo>): callbackInfo<imageInfo> {
    const transferedInfo: callbackInfo<imageInfo> = {
        code: 0,
        msg: '',
        selected: null
    }

    transferedInfo.code = infos.code;
    transferedInfo.msg = infos.msg;
    if (infos.selected) {
        transferedInfo.selected = infos.selected.map(info => {
            const caption = getLimitedSizeCaption(info.title || info.remark);

            return {
                url: info.ImageUrl,
                uri: getURI(info.ImageUrl),
                ic_uri: getURI(info.ImageUrl),
                caption: caption,
                naturalHeight: info.ThumbnailHeight,
                naturalWidth: info.ThumbnailWidth,
                ic: true,
                icUri: info.ImageUrl
            }
        });
    }

    return transferedInfo;
}

/**
 * take a caption duplication which size abey limited size
 * @param caption
 */
function getLimitedSizeCaption(caption: string) {
    // match 。| ？| ！| ，| 、| ; |space；
    const markReg = /[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\s+]/g;
    if (caption.length > CAPTION_LIMIT_SIZE) {
        const result = findAllIndex(caption, markReg, CAPTION_LIMIT_SIZE);
        if (result) {
            caption = caption.slice(0, result.pop());
        } else {
            caption = caption.slice(0, CAPTION_LIMIT_SIZE);
        }
    }
    return caption;
}

function findAllIndex(str: string[] | string, reg: RegExp, limitOfMaxIndex: number = str.length): number[] | null {
    const arrStr = typeof str === 'string' ? str.split('') : str;
    const result = [];

    for (let index in arrStr) {
        if (reg.test(arrStr[index]) && (+index) <= limitOfMaxIndex) {
            result.push(index);
        }
    }

    return result.length > 0 ? result : null;
}
