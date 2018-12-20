import * as React from 'react';
import classNames from 'classnames';

import './index.less';

export interface ProgressProps {
  prefixCls?: string;
  className?: string;
  percent?: number;
  format?: (percent: number) => string;
  status?: 'success' | 'active' | 'exception';
  strokeWidth?: number;
  trailColor?: string;
  width?: number;
  // style?: React.CSSProperties;
  style?: any;
  gapDegree?: number;
  gapPosition?: 'top' | 'bottom' | 'left' | 'right';
}

export default class Progress extends React.Component<ProgressProps, any> {
  static Line: any;

  static defaultProps = {
    percent: 0,
    trailColor: '#f3f3f3',
    prefixCls: 'syl-progress',
  };

  /* static propTypes = {
    status: PropTypes.oneOf(['normal', 'exception', 'active', 'success']),
    percent: PropTypes.number,
    width: PropTypes.number,
    strokeWidth: PropTypes.number,
    trailColor: PropTypes.string,
    format: PropTypes.func,
    gapDegree: PropTypes.number,
  }; */

  render() {
    const props = this.props;
    const {
      prefixCls, className, percent = 0, status, format, trailColor,
      strokeWidth, width, gapDegree = 0, gapPosition, ...restProps
    } = props;
    const progressStatus = parseInt(percent.toString(), 10) >= 100 && !('status' in props) ?
      'success' : (status || 'normal');
    let progressInfo;
    let progress;

    const percentStyle = {
      width: `${percent}%`,
      height: strokeWidth || 10,
    };
    progress = (
      <div>
        <div className={`${prefixCls}-outer`}>
          <div className={`${prefixCls}-inner`}>
            <div className={`${prefixCls}-bg`} style={percentStyle} />
          </div>
        </div>
        {progressInfo}
      </div>
    );

    const classString = classNames(prefixCls, {
      [`${prefixCls}-line`]: true,
      [`${prefixCls}-status-${progressStatus}`]: true,
    }, className);

    return (
      <div {...restProps} className={classString}>
        {progress}
      </div>
    );
  }
}
