export type imageInfo = {
    url: string;
    uri: string;
    ic: boolean;
    caption: string;
    naturalHeight: number;
    naturalWidth: number;
}

export type editorOfferedImageInfo = {
    ImageUrl: string;
    StatusCode: number;
    StatusMessage: string;
    ThumbnailHeight: number;
    ThumbnailSize: number;
    ThumbnailWidth: number;
    remark: string;
    title: string;
}

type TabPosition = 'icstock' | 'icguofeng' | 'similar' | 'zhong_bao';

export type Similar = {
    id: string;
    url: string;
    width: number;
    height: number;
}

export type IReactIcSearchProps = {
    confirm?: (info: callbackInfo) => void;
    cancel?: () => void;
    close?: () => void;
    maxSelectNum?: number;
    // wrapperWidth?: number;
    // wrapperHeight?: number;
    domain?: string;
    term?: string;
    images?: any[];
    position?: string;
    type: TabPosition;
    similar?: Similar;
    search_from?: string;
}



export type IReactIcSearchState = {}

export type callbackInfo<T = imageInfo> = {
    code: 0 | 1;
    msg: string;
    selected: null | T[];
}
