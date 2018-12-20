import * as React from 'react'
import { SylEditor } from 'byted-syl-editor'
import './index.less';
import imagePlugin from './plugins/image';

interface EditorPropsType {
  editorOptions: { [key: string]: any },
  handleChange?: (delta: any) => void,
  handleFocus?: () => void,
  handleBlur?: () => void,
  disabled?: boolean
  forwardedRef?: (ref: any) => void
}

class Editor extends React.Component<EditorPropsType, null> {
  static defaultProps = {
    editorOptions: {}
  }
  componentDidMount() {
    // 设置图片配置
    const imageConfig = this.props.editorOptions.image || {};
    imagePlugin.setConfig(imageConfig);
  }
  render() {
    const {forwardedRef, ...props} = this.props;
    return (
      <div className="App">
          <SylEditor
            onChange={props.handleChange}
            onFocus={props.handleFocus}
            onBlur={props.handleBlur}
            disabled={props.disabled}
            ref={forwardedRef}
            editorOptions={props.editorOptions}
            plugins={[imagePlugin as any]}
          />
      </div>
    );
  }
}

export default Editor;

