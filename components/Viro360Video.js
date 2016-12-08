/**
 * Copyright (c) 2015-present, Viro, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule Viro360Video
 * @flow
 */
'use strict';

var NativeMethodsMixin = require('react/lib/NativeMethodsMixin');
var NativeModules = require('NativeModules');
var PropTypes = require('react/lib/ReactPropTypes');
var React = require('React');
var StyleSheet = require('StyleSheet');
var Viro360VideoManager = require('NativeModules').Video360Manager;
var requireNativeComponent = require('requireNativeComponent');
var resolveAssetSource = require('resolveAssetSource');
var findNodeHandle = require('react/lib/findNodeHandle');

var RCT_360_VIDEO_REF = 'viro360videocomponent';

/**
 * Used to render a 360 video on the background sphere.
 */
var Viro360Video = React.createClass({
  mixins: [NativeMethodsMixin],

  propTypes: {
    /**
     * The video uri to play
     */
    source: PropTypes.oneOfType([
      PropTypes.shape({
        uri: PropTypes.string,
      }),
      // Opaque type returned by require('./test_video.mp4')
      PropTypes.number,
    ]).isRequired,

    paused: PropTypes.bool,
    loop: PropTypes.bool,
    muted: PropTypes.bool,
    volume: PropTypes.number,

    /**
     * Callback that is called when the video is finished playing. This
     * function isn't called at the end of a video if looping is enabled.
     */
    onFinish: React.PropTypes.func,
  },

  getNodeHandle: function(): any {
    return findNodeHandle(this.refs[RCT_360_VIDEO_REF]);
  },

  render: function() {
    if (this.props.src) {
      console.error('The <Viro360Video> component takes a `source` property rather than `src`.');
    }

    var vidsrc = resolveAssetSource(this.props.source);
    return (
      <VRO360Video ref={RCT_360_VIDEO_REF}
        {...this.props} source={vidsrc} onFinish={this._onFinish} />
    );
  },

  seekToTime(timeInSeconds) {
    Viro360VideoManager.seekToTime(this.getNodeHandle(), timeInSeconds);
  },

  _onFinish(event: Event) {
        if (!this.props.onFinish) {
          return;
        }

        this.props.onFinish();
  }
});

var VRO360Video = requireNativeComponent(
  'VRT360Video', Viro360Video, {
    nativeOnly: {onFinish: true}
  }
);

module.exports = Viro360Video;
