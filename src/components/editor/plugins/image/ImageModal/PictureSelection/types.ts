import { StringMap } from "quill";
import { Similar, IReactIcSearchProps } from "../ICSearchReact";

export type PanelTypes = ['bodyImages', 'similar', 'upload', 'freeSearch', 'chinese', 'material'];

export type ImageInfo = {
    url: string;
    ic: boolean;
    caption: string;
    naturalHeight: number;
    naturalWidth: number;
}

export type PicutreSelectionStates = {
    images: any[];
    term: string;
    selectIndex: string;
}

export type GetTypeOr<T> = T extends Array<infer Type> ? Type : never;

export type PicutreSelectionProps = {
    allowPanel?: GetTypeOr<PanelTypes>[];
    defaultPanel?: GetTypeOr<PanelTypes>;
    source: string;
    onImageInsert: (info: ImageInfo[] | null, source?: any) => void;
    // flag params is a hack for bussiness
    // For impure shutdown functions
    close: (flag?: 'close') => void;
    tabStyle?: StringMap;
    iCSearchPanelOption?: MaybeNeed<IReactIcSearchProps>;
    similar?: Similar;
    bodyImages?: any[]
    bodyImagesMaxSelected?: number;
    uploadMaxLimited?: number;
    beforePageTurning?: (from: PanelTypes, to: PanelTypes) => void
}

type MaybeNeed<G> = {
    [K in keyof G]?: G[K];
}
