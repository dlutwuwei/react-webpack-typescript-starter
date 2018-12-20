import * as React from 'react';
import { SortableElement } from 'react-sortable-hoc'
import SylProgress from '../Progress'

/* eslint-disable */
class ImageItem extends React.Component<any, any> {
  /* static propTypes = {
    image: PropTypes.object,
    onDelete: PropTypes.func,
  } */
  static defaultProps = {
    onDelete: () => { }
  }
  constructor(props) {
    super(props);
    this.state = {
      showHover: false,
    };
  }

  handleMouseEnter = () => {
    this.setState({
      showHover: true,
    })
  }
  handleMouseLeave = () => {
    this.setState({
      showHover: false,
    })
  }

  render() {
    const { id, state, url, percent } = this.props.image
    return (
      <li className="image-item" id={id} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
        <div className="file-panel" style={{ height: this.state.showHover ? 30 : 0 }}><span className="delete" onClick={this.props.onDelete.bind(this, this.props.image)}>删除</span></div>
        <img src={url} />
        {!state && <SylProgress percent={percent} status="active" />}
        {state === 'SUCCESS' ? <div className="success"></div> : null}
        {state && state !== 'SUCCESS' ? <div className="error">{state.split("，")[0]}</div> : null}
      </li>
    );
  }
}

// 可以用decorator
export default SortableElement(ImageItem)
