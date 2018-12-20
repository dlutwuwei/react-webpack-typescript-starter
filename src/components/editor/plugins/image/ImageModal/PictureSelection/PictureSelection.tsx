import * as React from 'react'
import * as Tabs from 'byted-tui2/lib/tabs';
import UploadImagePanel from "./UploadImagePanel"
import { ICSearchPanel } from '../ICSearchReact';
import './pictureSelection.less';
import { PicutreSelectionStates, PicutreSelectionProps, GetTypeOr, PanelTypes } from './types';
import 'byted-tui2/lib/tabs/style/index.less'
console.log(Tabs)
// @ts-ignore
const TabPane = Tabs.TabPane

// upload must allowed with freeSearch at same time
enum tabKey {
    'bodyImages' = '1',
    'similar' = '2',
    'upload' = '3',
    'freeSearch' = '4',
    'chinese' = '5',
    'material' = '6',
}

export class PictureSelection extends React.Component<any, PicutreSelectionStates> {
    static defaultProps = {
        allowPanel: [
            tabKey.upload,
            tabKey.freeSearch,
            tabKey.chinese,
            tabKey.material
        ],
        defaultPanel: tabKey.upload,
        beforePageTurning: () => {}
    }

    public state = {
        images: [],
        term: '',
        selectIndex: ''
    }

    constructor(props) {
        super(props);

        this.tabSelectChange = this.tabSelectChange.bind(this);
        this.collectImages = this.collectImages.bind(this);
        this.insertImage = this.insertImage.bind(this);
    }

    private _panelHasAllow(panelName: GetTypeOr<PanelTypes>): boolean {
        return this.props.allowPanel.indexOf(panelName) > -1;
    }

    private _sterilizeImageInfo(info) {
        const result = info instanceof Array ? info :
            // if true, info come from react ic search
            info.selected || info.selected === null ? info.selected :
                // come from recommond image
                [info];

        return result;
    }

    public tabSelectChange(index: string) {
        if (index === '' + tabKey.freeSearch) {
            this.setState({
                images: [],
                term: ''
            })
        }
        this.props.beforePageTurning(tabKey[this.state.selectIndex], tabKey[index])
        this.setState({
            selectIndex: index
        })
    }

    public collectImages(images, term) {
        this.setState({
            images,
            term,
            selectIndex: tabKey.freeSearch,

        });
    }

    public insertImage(info, source?: any) {
        const result = this._sterilizeImageInfo(info);

        this.props.onImageInsert(result, source);
        this.props.close('close');
    }


    public render() {
        const selectIndex = this.state.selectIndex || `${tabKey[this.props.defaultPanel]}`;

        return (
            // @ts-ignore
            <Tabs className="ic-image-tab-scope" defaultActiveKey={selectIndex} activeKey={selectIndex} onChange={this.tabSelectChange}>
                {
                    this._panelHasAllow('upload') && (
                        <TabPane tab="上传图片" key={tabKey.upload}>
                            <UploadImagePanel
                                handleConfirm={this.insertImage}
                                handleClose={this.props.close}
                                handleMore={this.collectImages}
                                maxNum={this.props.uploadMaxLimited}
                            />
                        </TabPane>
                    )
                }
                {
                    this._panelHasAllow('freeSearch') && (
                        <TabPane tab="免费正版图片" key={tabKey.freeSearch} style={this.props.tabStyle} className="ic-search">
                            <ICSearchPanel
                                // 由于 sdk 不支持同时传 images 和 term 所以传空数组
                                // images={this.state.images}
                                maxSelectNum={20}
                                term={this.state.term}
                                confirm={this.insertImage}
                                close={this.props.close}
                                position={this.props.source}
                                type={'icstock'}
                                search_from="search_sug"
                                {...this.props.iCSearchPanelOption}
                            />
                        </TabPane>
                    )
                }
            </Tabs>
        )
    }
}


