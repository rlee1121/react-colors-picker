import React from 'react';
import Colr from 'colr';
import Board from './Board';
import Preview from './Preview';
import Ribbon from './Ribbon';
import Alpha from './Alpha';
import Params from './Params';

function noop() {
}

const colr = new Colr();

export default class Panel extends React.Component {
  constructor(props) {
    super(props);

    const color = props.color || props.defaultColor;
    const hsv = colr.fromHex(color).toHsvObject();

    this.state = {
      paramsHsv: hsv,
      hsv: hsv,
      alpha: props.alph || props.defaultAlpha,
    };

    const events = [
      'onChange',
      'onAlphaChange',
      'onFocus',
      'onBlur',
    ];
    // bind methods
    events.forEach(m => {
      this[m] = this[m].bind(this);
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.color) {
      const hsv = colr.fromHex(nextProps.color).toHsvObject();
      this.setState({
        hsv,
      });
    }
    if (nextProps.alpha !== undefined) {
      this.setState({
        alpha: nextProps.alpha,
      });
    }
  }

  onChange(hsvObject, syncParams = true) {
    const hsv = hsvObject;
    const state = {
      hsv,
    };
    if (syncParams) {
      state.paramsHsv = hsv;
    }
    this.setState(state);

    const ret = {
      color: this.getHexColor(hsv),
      hsv,
      alpha: this.state.alpha,
    };
    this.props.onChange(ret);
  }

  onAlphaChange(alpha) {
    if (this.props.alpha === undefined) {
      this.setState({
        alpha,
      });
    }
    this.props.onChange({
      color: this.getHexColor(),
      hsv: this.state.hsv,
      alpha,
    });
  }

  onFocus() {
    if (this._blurTimer) {
      clearTimeout(this._blurTimer);
      this._blurTimer = null;
    } else {
      this.props.onFocus();
    }
  }

  onBlur() {
    if (this._blurTimer) {
      clearTimeout(this._blurTimer);
    }
    this._blurTimer = setTimeout(()=> {
      this.props.onBlur();
    }, 100);
  }

  getHexColor(hsv) {
    return colr.fromHsvObject(hsv || this.state.hsv).toHex();
  }

  render() {
    const prefixCls = this.props.prefixCls;
    const hsv = this.state.hsv;
    const alpha = this.state.alpha;
    return (
      <div
        className={prefixCls}
        style={this.props.style}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        tabIndex="0"
        >
        <div className={prefixCls + '-' + ('inner')}>
          <Board
            rootPrefixCls={prefixCls}
            hsv={hsv}
            onChange={this.onChange}
            />
          <div className={prefixCls + '-' + ('wrap')}>
            <div className={prefixCls + '-' + ('wrap-ribbon')}>
              <Ribbon
                rootPrefixCls={prefixCls}
                hsv={hsv}
                onChange={this.onChange}
                />
            </div>
            <div className={prefixCls + '-' + ('wrap-alpha')}>
              <Alpha
                rootPrefixCls={prefixCls}
                alpha={alpha}
                hsv={hsv}
                onChange={this.onAlphaChange}
                />
            </div>
            <div className={prefixCls + '-' + ('wrap-preview')}>
              <Preview
                rootPrefixCls={prefixCls}
                alpha={alpha}
                hsv={hsv}
                />
            </div>
          </div>
          <div className={prefixCls + '-' + ('wrap')} style={{height: 40, marginTop: 6}}>
            <Params
              rootPrefixCls={prefixCls}
              hsv={this.state.paramsHsv}
              alpha={alpha}
              onAlphaChange={this.onAlphaChange}
              onChange={this.onChange}
              />
          </div>
        </div>
      </div>
    );
  }
}

import typeColor from './utils/validationColor';

Panel.propTypes = {
  prefixCls: React.PropTypes.string,
  color: typeColor,
  alpha: React.PropTypes.number,
  style: React.PropTypes.object,
  onChange: React.PropTypes.func,
  onFocus: React.PropTypes.func,
  onBlur: React.PropTypes.func,
};

Panel.defaultProps = {
  prefixCls: 'react-colorpicker-panel',
  defaultColor: '#ff0000',
  defaultAlpha: 100,
  style: {},
  onChange: noop,
  onFocus: noop,
  onBlur: noop,
};
