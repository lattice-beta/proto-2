import React from 'react';
import PropTypes from 'prop-types';
import VisibilitySensor from 'react-visibility-sensor';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import CanvasOverlay from './CanvasOverlay.jsx';
import EditorContainer from './EditorContainer/EditorContainer.jsx';
import Heading from './Heading/Heading.jsx';
import Tags from './Tags/Tags.jsx';
import Questions from './Question/Question.jsx';
import Iframe from './Iframe/Iframe.jsx';
import Image from './Image/Image.jsx';
import TextEditor from './TextEditor/TextEditor.jsx';
import WidgetNav from './WidgetNav/WidgetNav.jsx';

import { convertPixelHeightToGridHeight } from '../../../utils/pixel-to-grid.js';
import {
  changePageLayout,
  resizeTextEditor,
  loadCurrentPage,
  setPageLayout,
  updateTextHeight
} from '../../../action/page.js';
import { hideOldPageVersion } from '../../../action/pageVersion.js';
import {
  viewAddDescriptionModal
} from '../../../action/mainToolbar.js';

import { setCurrentWidget } from '../../../action/editors.js';

import * as WidgetSize from '../../../constants/widgetConstants.js';

const ReactGridLayout = require('react-grid-layout');
require('./canvas.scss');

class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isResizingGridItems: {},
      didResizeGridItems: new Set(),
    };

    this.textEditors = {};
    this.timeout = null;
  }

  componentDidUpdate(prevProps) {
    const id = this.props.currentWidget;
    if (this.props.editorIndex > prevProps.editorIndex && document.getElementById(id)) {
      document.getElementById(id).focus({ preventScroll: false });
    }
    if (this.props.isFullScreenMode !== prevProps.isFullScreenMode && prevProps.isFullScreenMode) {
      window.scrollTo(0, this.props.yPosition);
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  setWidgetSize(layout, defaultWidth, defaultHeight, minWidth, minHeight) {
    layout.minW = minWidth;
    layout.w = !layout.w ? defaultWidth : layout.w;

    layout.minH = minHeight;
    layout.h =
      (layout.h < layout.minH) ? defaultHeight : layout.h;
  }

  handleGridItemResizeStart = (gridItems) => {
    this.setState(prevState => ({
      isResizingGridItems: {
        ...prevState.isResizingGridItems,
        ...gridItems.reduce((accum, gridItem) => ({ ...accum, [gridItem.i]: true }), {})
      },
      didResizeGridItems: new Set()
    }));
  }

  handleGridItemResize = (gridItems) => {
    for (let gridItemIndex = 0; gridItemIndex < gridItems.length; gridItemIndex += 1) {
      const gridItem = gridItems[gridItemIndex];
      if (this.textEditors.hasOwnProperty(gridItem.i) && this.textEditors[gridItem.i]) {
        const textEditor = this.textEditors[gridItem.i];
        const measureComponent = textEditor.measureComponent;
        if (measureComponent) {
          const height = measureComponent.state.contentRect.bounds.height;
          this.props.updateTextHeight(gridItem.i, height);
        }
      }
    }
  }

  handleGridItemResizeStop = (gridItems) => {
    this.setState((prevState) => {
      const { didResizeGridItems } = prevState;
      for (let gridItemIndex = 0; gridItemIndex < gridItems.length; gridItemIndex += 1) {
        didResizeGridItems.add(gridItems[gridItemIndex].i);
      }
      return {
        isResizingGridItems: {
          ...prevState.isResizingGridItems,
          ...gridItems.reduce((accum, gridItem) => ({ ...accum, [gridItem.i]: false }), {})
        },
        didResizeGridItems
      };
    });

    // clear this.state.didResizeGridItems after a short amount of time
    this.timeout = setTimeout(() => this.setState({ didResizeGridItems: new Set() }), 100);
  }

  resizeTextEditor = (id, height) => {
    const gridItem = this.props.layout.find(x => x.i === id);
    const { margin, rowHeight } = this.props.rgl;
    const newHeight = convertPixelHeightToGridHeight(height, margin, rowHeight, gridItem.maxH);
    // don't autosize the text editor if it was just manually resized
    if (!this.state.didResizeGridItems.has(id) || newHeight > gridItem.h) {
      this.props.resizeTextEditor(id, height);
    }
  }

  renderCodeEditor(editor) {
    return (
      <VisibilitySensor
        partialVisibility
      >
        {({ isVisible }) => (
          <EditorContainer
            id={editor.id}
            currentFile={editor.currentFile}
            code={editor.code}
            consoleOutputText={editor.consoleOutputText}
            editorMode={editor.editorMode}
            pythonRunMode={editor.pythonRunMode}
            files={editor.files}
            innerWidth={editor.innerWidth}
            isPlaying={editor.isPlaying && isVisible}
            isRefreshing={editor.isRefreshing}
            isWidgetFullScreenMode={editor.isWidgetFullScreenMode}
            editorView={editor.editorView}
          />
        )}
      </VisibilitySensor>
    );
  }

  renderTextEditor(editor) {
    return (
      <TextEditor
        id={editor.id}
        ref={(textEditor) => { if (textEditor) { this.textEditors[editor.id] = textEditor; } }}
        backColor={editor.backColor}
        editorState={editor.editorState}
        onResize={this.resizeTextEditor}
        isResizing={this.state.isResizingGridItems[editor.id] || false}
      />
    );
  }

  renderIframe(editor) {
    return (
      <VisibilitySensor
        partialVisibility
      >
        {({ isVisible }) => (
          <div key={editor.id}>
            <Iframe
              id={editor.id}
              iframeURL={editor.url}
              isVisible={isVisible}
            />
          </div>
        )}
      </VisibilitySensor>
    );
  }

  renderVideo(editor) {
    return (
      <VisibilitySensor partialVisibility>
        {({ isVisible }) => (
          <div key={editor.id}>
            <Iframe
              id={editor.id}
              iframeURL={editor.url}
              isVisible={isVisible}
            />
          </div>
        )}
      </VisibilitySensor>
    );
  }

  renderImage(editor) {
    return (
      <div key={editor.id}>
        <Image
          id={editor.id}
          imageURL={editor.url}
          crop={editor.crop}
          layout={this.props.layout}
        />
      </div>
    );
  }

  renderQuestion(editor) {
    return (
      <div key={editor.id}>
        <Questions
          id={editor.id}
          answer={editor.answer}
          innerHeight={editor.innerHeight}
          minHeight={editor.minHeight}
          question={editor.question}
        />
      </div>
    );
  }

  renderDescriptionButton() {
    if (this.props.description && this.props.isPeblPublished) {
      return 'Edit Description';
    } if (this.props.userType === 'student') {
      return 'Publish';
    }
    return 'Add Description';
  }


  renderCanvasPreview() {
    if (this.props.isOldVersionShowing) {
      return (
        <CanvasOverlay
          loadCurrentPage={this.props.loadCurrentPage}
          hideOldPageVersion={this.props.hideOldPageVersion}
          id={this.props.id}
          savePage={this.props.savePage}
        />
      );
    }
    return null;
  }

  render() {
    const ids = Object.keys(this.props.editors);
    // need to create copy of the layout because ReactGridLayout tests
    // for object equality when deciding whether to re-render grid items
    // reference: https://github.com/STRML/react-grid-layout/issues/382#issuecomment-299734450
    const storageLayout = JSON.parse(JSON.stringify(this.props.layout));
    const localLayout = {};
    storageLayout.forEach((x) => {
      const key = x.i;
      localLayout[key] = x;
      localLayout[key].maxW = 30;
      localLayout[key].maxH = 100;

      if (this.props.editors[key]) {
        switch (this.props.editors[key].type) {
          case 'text': {
            localLayout[key].minW = WidgetSize.TEXT_MIN_WIDTH;
            localLayout[key].w = !localLayout[key].w ? WidgetSize.TEXT_DEFAULT_WIDTH : localLayout[key].w;

            const minH = this.props.textHeights[key] || WidgetSize.TEXT_MIN_HEIGHT;
            localLayout[key].minH = minH;
            localLayout[key].h =
              Math.max(minH, (localLayout[key].h < WidgetSize.TEXT_MIN_HEIGHT)
                ? WidgetSize.TEXT_MIN_HEIGHT : localLayout[key].h);
            break;
          }
          case 'code': {
            this.setWidgetSize(
              localLayout[key],
              WidgetSize.CODE_DEFAULT_WIDTH,
              WidgetSize.CODE_DEFAULT_HEIGHT,
              WidgetSize.CODE_MIN_WIDTH,
              WidgetSize.CODE_MIN_HEIGHT
            );
            break;
          }
          case 'question': {
            this.setWidgetSize(
              localLayout[key],
              WidgetSize.QUESTION_DEFAULT_WIDTH,
              WidgetSize.QUESTION_DEFAULT_HEIGHT,
              WidgetSize.QUESTION_MIN_WIDTH,
              WidgetSize.QUESTION_MIN_HEIGHT
            );
            break;
          }
          case 'iframe': {
            this.setWidgetSize(
              localLayout[key],
              WidgetSize.IFRAME_DEFAULT_WIDTH,
              WidgetSize.IFRAME_DEFAULT_HEIGHT,
              WidgetSize.IFRAME_MIN_WIDTH,
              WidgetSize.IFRAME_MIN_HEIGHT
            );
            break;
          }
          case 'image': {
            const imgElt = document.getElementById(`ref-${key}`);
            // TODO: Move image calculation layout to a seperate class/util function
            if (this.props.editors[key].crop && imgElt) {
              // checking if crop is present, to ensure that older images are not affected
              const imageEltRatio = imgElt.width / imgElt.height;
              const imageCropRatio = this.props.editors[key].crop.width / this.props.editors[key].crop.height;
              const imageRatio = imageEltRatio * imageCropRatio;
              const trueLayoutHeight = localLayout[key].h - 1;
              const trueLayoutWidth = trueLayoutHeight * imageRatio;
              localLayout[key].w = Math.ceil(trueLayoutWidth + 1);
            }
            this.setWidgetSize(
              localLayout[key],
              WidgetSize.IMAGE_DEFAULT_WIDTH,
              WidgetSize.IMAGE_DEFAULT_HEIGHT,
              WidgetSize.IMAGE_MIN_WIDTH,
              WidgetSize.IMAGE_MIN_HEIGHT
            );
            break;
          }
          case 'video': {
            this.setWidgetSize(
              localLayout[key],
              WidgetSize.VIDEO_DEFAULT_WIDTH,
              WidgetSize.VIDEO_DEFAULT_HEIGHT,
              WidgetSize.VIDEO_MIN_WIDTH,
              WidgetSize.VIDEO_MIN_HEIGHT
            );
            break;
          }
          default: {
            break;
          }
        }
      }
    });
    return (
      <section
        id="content-canvas"
        className={
          `canvas
          ${this.props.preview ? 'canvas-preview-mode' : 'canvas-edit-mode'}
          ${this.props.isNavigationOpen ? 'canvas-right' : ''}`
        }
      >
        {this.renderCanvasPreview()}
        {
          <div
            className="canvas__tag-container"
          >
            <Tags
              preview={this.props.preview}
              container="canvas"
            />
            {!this.props.preview && (
              <button
                className="canvas__add-desc-button"
                onClick={() => {
                  this.props.viewAddDescriptionModal();
                }}
              >
                {this.renderDescriptionButton()}
              </button>
            )}
          </div>
        }
        <Heading />
        <ReactGridLayout
          className={`react-grid-layout ${this.props.isFullScreenMode ? 'react-grid__fullscreen' : ''}`}
          cols={this.props.rgl.cols}
          width={this.props.rgl.width}
          rowHeight={this.props.rgl.rowHeight}
          layout={localLayout}
          onLayoutChange={this.props.setPageLayout}
          onDragStop={this.props.changePageLayout}
          compactType="vertical"
          margin={this.props.rgl.margin}
          draggableHandle=".widget__drag"
          containerPadding={this.props.rgl.padding}
          onResizeStart={this.handleGridItemResizeStart}
          onResize={this.handleGridItemResize}
          onResizeStop={(gridItems) => {
            this.props.changePageLayout(gridItems);
            this.handleGridItemResizeStop(gridItems);
          }
          }
          autoSize
        >
          {ids.map(id => (
            <div
              key={id}
              data-grid={localLayout[id]}
              className={`
                ${this.props.editors[id].isWidgetFullScreenMode ? 'editor__fullscreen' : 'editor__non-fullscreen'}
                ${this.props.currentWidget === id ? 'canvas-high' : ''}`
              }
            >
              <div
                className={`widget__container
                  ${this.props.editors[id].type === 'text'
              ? 'no-outline'
              : 'element__iframe-container'}
                `}
                id={id}
                tabIndex="0" // eslint-disable-line
                onFocus={() => this.props.setCurrentWidget(id)}
              >
                {(this.props.preview) || (
                  <div className={`widget-nav__container${(this.props.currentWidget === id) ? '_highlighted' : ''}`}>
                    <WidgetNav
                      id={id}
                      showDeleteWidgetWarning={this.props.isDeleteWarningModalOpen &&
                        this.props.widgetForDeleteWidgetWarning === id}
                    />
                  </div>
                )}
                {(() => {
                  switch (this.props.editors[id].type) {
                    case 'code': return this.renderCodeEditor(this.props.editors[id]);
                    case 'question': return this.renderQuestion(this.props.editors[id]);
                    case 'iframe': return this.renderIframe(this.props.editors[id]);
                    case 'video': return this.renderVideo(this.props.editors[id]);
                    case 'image': return this.renderImage(this.props.editors[id]);
                    case 'text': return this.renderTextEditor(this.props.editors[id]);
                    default: return null;
                  }
                })()}
              </div>
            </div>
          ))}
        </ReactGridLayout>
      </section>
    );
  }
}

Canvas.propTypes = {
  currentWidget: PropTypes.string.isRequired,
  changePageLayout: PropTypes.func.isRequired,
  description: PropTypes.string.isRequired,
  editorIndex: PropTypes.number.isRequired,
  editors: PropTypes.shape({}).isRequired,
  hideOldPageVersion: PropTypes.func.isRequired,
  layout: PropTypes.arrayOf(PropTypes.shape).isRequired,
  id: PropTypes.string.isRequired,
  isFullScreenMode: PropTypes.bool.isRequired,
  isNavigationOpen: PropTypes.bool.isRequired,
  isOldVersionShowing: PropTypes.bool.isRequired,
  isPeblPublished: PropTypes.bool.isRequired,
  isDeleteWarningModalOpen: PropTypes.bool.isRequired,
  loadCurrentPage: PropTypes.func.isRequired,
  preview: PropTypes.bool.isRequired,
  resizeTextEditor: PropTypes.func.isRequired,
  rgl: PropTypes.shape({
    cols: PropTypes.number,
    margin: PropTypes.arrayOf(PropTypes.number),
    padding: PropTypes.arrayOf(PropTypes.number),
    rowHeight: PropTypes.number,
    width: PropTypes.number
  }).isRequired,
  savePage: PropTypes.func.isRequired,
  setCurrentWidget: PropTypes.func.isRequired,
  setPageLayout: PropTypes.func.isRequired,
  textHeights: PropTypes.shape({}).isRequired,
  updateTextHeight: PropTypes.func.isRequired,
  userType: PropTypes.string.isRequired,
  viewAddDescriptionModal: PropTypes.func.isRequired,
  widgetForDeleteWidgetWarning: PropTypes.string.isRequired,
  yPosition: PropTypes.number.isRequired,
};

function mapStateToProps(state) {
  return {
    currentWidget: state.editorsReducer.currentWidget,
    description: state.page.description,
    editorIndex: state.editorsReducer.editorIndex,
    id: state.page.id,
    isDeleteWarningModalOpen: state.editorsReducer.isDeleteWarningModalOpen,
    widgetForDeleteWidgetWarning: state.editorsReducer.widgetForDeleteWidgetWarning,
    editors: state.editorsReducer.editors,
    isFullScreenMode: state.editorsReducer.isFullScreenMode,
    isOldVersionShowing: state.pageVersion.isOldVersionShowing,
    isNavigationOpen: state.navigation.isNavigationOpen,
    isPeblPublished: state.page.isPublished,
    layout: state.page.layout,
    preview: state.page.preview,
    rgl: state.page.rgl,
    textHeights: state.page.textHeights,
    userType: state.user.type,
    yPosition: state.navigation.yPosition
  };
}
const mapDispatchToProps = dispatch => bindActionCreators({
  changePageLayout,
  hideOldPageVersion,
  loadCurrentPage,
  resizeTextEditor,
  setPageLayout,
  setCurrentWidget,
  updateTextHeight,
  viewAddDescriptionModal
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);
