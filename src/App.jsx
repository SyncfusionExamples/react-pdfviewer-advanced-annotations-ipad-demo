import { createRoot } from 'react-dom/client';
import './index.css';
import * as React from 'react';
import {
  PdfViewerComponent,
  Magnification,
  Navigation,
  LinkAnnotation,
  BookmarkView,
  Annotation,
  FormFields,
  FormDesigner,
  ThumbnailView,
  Print,
  TextSelection,
  TextSearch,
  PageOrganizer,
  Inject,
  StandardBusinessStampItem,
  SignStampItem,
  DynamicStampItem,
} from '@syncfusion/ej2-react-pdfviewer';
import {
  ToolbarComponent,
  ItemsDirective,
  ItemDirective,
  MenuComponent,
} from '@syncfusion/ej2-react-navigations';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { DialogComponent } from '@syncfusion/ej2-react-popups';

function CustomToolbar() {
  const viewerRef = React.useRef(null);
  let matchCase;
  let searchText = '';
  let prevMatchCase = false;
  let toolbar;
  let currentPageNumber = '1';
  let fileName = '';
  let isInkEnabled = false;
  let searchActive = false;
  let currentAnnotationMode = 'None';

  const [activeAnnotation, setActiveAnnotation] = React.useState('None');
  const [selectedAnnotationId, setSelectedAnnotationId] = React.useState(null);
  const [showAnnotationDialog, setShowAnnotationDialog] = React.useState(false);
  const [searchButtonsEnabled, setSearchButtonsEnabled] = React.useState(false);
  const [showShapeMenu, setShowShapeMenu] = React.useState(false);
  const [selectedShape, setSelectedShape] = React.useState('Rectangle');
  let dialogRef = React.useRef(null);
  let shapeMenuRef = React.useRef(null);
  let shapeButtonRef = React.useRef(null);
  let shapePopupRef = React.useRef(null);


  // Define dialog content function BEFORE it's used in JSX
  const getAnnotationDialogContent = () => {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '10px 0' }}>
        <span style={{ fontSize: '13px', color: '#333', flex: 1 }}>Annotation tool active. Click Done to finish.</span>
        <ButtonComponent
          cssClass="e-primary"
          onClick={() => handleAnnotationClick('Done')}
          style={{ padding: '6px 20px', fontSize: '12px', whiteSpace: 'nowrap' }}
        >
          Done
        </ButtonComponent>
      </div>
    );
  };

  return (
    <div className="app-share-frame">
      <div className="control-section">
        <div>
          <div className="e-pdf-toolbar">
            <ToolbarComponent
              ref={(scope) => {
                toolbar = scope;
              }}
              clicked={clickHandler.bind(this)}
            >
              <ItemsDirective>
                <ItemDirective
                  prefixIcon="e-icons e-folder"
                  id="file_Open"
                  tooltipText="Open"
                ></ItemDirective>
                <ItemDirective
                  prefixIcon="e-icons e-save"
                  tooltipText="Save"
                  id="save"
                ></ItemDirective>
                {/* Zoom Out */}
                <ItemDirective
                  prefixIcon="e-icons e-zoom-out"
                  id="zoom_out"
                  tooltipText="Zoom Out"
                  align='center'
                />

                {/* Zoom In */}
                <ItemDirective
                  prefixIcon="e-icons e-zoom-in"
                  id="zoom_in"
                  tooltipText="Zoom In"
                  align='center'
                />
                {/* Zoom Dropdown */}
                <ItemDirective
                  id="zoom_dropdown"
                  align='center'
                  template={() => (
                    <select
                      id="zoomSelect"
                      onChange={changeZoom}
                      defaultValue="125"
                      style={{ width: '80px' }}

                    >
                      <option value="50">50%</option>
                      <option value="75">75%</option>
                      <option value="100">100%</option>
                      <option value="125">125%</option>
                      <option value="150">150%</option>
                      <option value="200">200%</option>
                    </select>
                  )}
                />

                <ItemDirective prefixIcon="e-icons e-pan" id="pan_tool" align="Center" tooltipText="Pan Mode" />
                <ItemDirective id="selection_tool" prefixIcon="e-icons e-mouse-pointer" tooltipText="Selection" align="center"></ItemDirective>

                <ItemDirective
                  prefixIcon="e-icons e-organize-pdf"
                  tooltipText="Organize PDF"
                  id="organize-pdf"
                  align="Right"
                ></ItemDirective>
                <ItemDirective
                  prefixIcon="e-icons e-search"
                  tooltipText="Find Text"
                  id="find_text"
                  align="Right"
                ></ItemDirective>
              </ItemsDirective>
            </ToolbarComponent>
          </div>
          <div
            id="textSearchToolbar"
            style={{ display: 'none', marginLeft: '840px' }}
          >
            <div
              className="e-pv-search-bar"
              id="container_search_box"
              style={{ top: '57px', right: '0px' }}
            >
              <div
                className="e-pv-search-bar-elements"
                id="container_search_box_elements"
              >
                <div
                  className="e-input-group e-pv-search-input"
                  id="container_search_input_container"
                >
                  <input
                    className="e-input"
                    id="container_search_input"
                    type="text"
                    placeholder="Find in document"
                    onKeyPress={searchInputKeypressed}
                    onChange={inputChange}
                  />
                  <span
                    className="e-input-group-icon e-input-search-group-icon e-icons e-search"
                    id="container_search_box-icon"
                    onClick={searchClickHandler}
                  ></span>
                </div>
                <ButtonComponent
                  id="container_prev_occurrence"
                  iconCss="e-icons e-chevron-left"
                  onClick={previousTextSearch}
                  cssClass="e-small"
                  title="Previous Search text"
                  disabled={!searchButtonsEnabled}
                  style={{ padding: '6px 10px' }}
                ></ButtonComponent>
                <ButtonComponent
                  id="container_next_occurrence"
                  iconCss="e-icons e-chevron-right"
                  onClick={nextTextSearch}
                  cssClass="e-small"
                  title="Next Search text"
                  disabled={!searchButtonsEnabled}
                  style={{ padding: '6px 10px' }}
                ></ButtonComponent>
              </div>
              <div
                className="e-pv-match-case-container"
                id="container_match_case_container"
              >
                <div className="e-checkbox-wrapper e-wrapper e-pv-match-case">
                  <label htmlFor="container_match_case">
                    <input
                      id="container_match_case"
                      type="checkbox"
                      className="e-control e-checkbox e-lib"
                      onClick={checkBoxChanged}
                    />
                    <span
                      className="e-ripple-container"
                      data-ripple="true"
                    ></span>
                    <span id="checkboxSpan" className="e-icons e-frame"></span>
                    <span className="e-label">Match case</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Main container with sidebar and PDF viewer */}
          <div
            style={{
              display: 'flex',
              height: 'calc(100dvh - var(--appbar-height, 64px))',
              backgroundColor: '#fff',
            }}
          >
            {/* Left Sidebar - Annotation Tools using EJ2 Buttons */}
            <div
              style={{
                width: '80px',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#f8f8f8',
                borderRight: '1px solid #e0e0e0',
                padding: '10px 8px',
                overflowY: 'auto',
                gap: '8px',
                alignItems: 'center',
              }}
            >
              {/* Done Button */}
              <ButtonComponent
                cssClass={activeAnnotation === 'Done' ? 'e-small annotation-btn-active' : 'e-small annotation-btn'}
                onClick={() => handleAnnotationClick('Done')}
                title="Done"
                iconCss="e-icons e-check"
                disabled={activeAnnotation === 'None'}
              ></ButtonComponent>

              {/* Highlight Button */}
              <ButtonComponent
                cssClass={activeAnnotation === 'Highlight' ? 'e-small annotation-btn-active' : 'e-small annotation-btn'}
                title="Highlight"
                iconCss="e-icons e-highlight-color"
                onClick={() => handleAnnotationClick('Highlight')}
              ></ButtonComponent>

              {/* Pen Button */}
              <ButtonComponent
                cssClass={activeAnnotation === 'Ink' ? 'e-small annotation-btn-active' : 'e-small annotation-btn'}
                title="Pen"
                iconCss="e-icons e-edit"
                onClick={() => handleAnnotationClick('Ink')}
              ></ButtonComponent>

              {/* Shapes Button with Menu */}
              <div
                ref={shapeButtonRef}
                style={{ position: 'relative', display: 'inline-block' }}
              >
                <ButtonComponent
                  cssClass={['Line', 'Rectangle', 'Circle'].includes(activeAnnotation) ? 'e-small annotation-btn-active' : 'e-small annotation-btn'}
                  title="Shapes"
                  iconCss="e-icons e-rectangle"
                  onClick={() => {
                    setShowShapeMenu(!showShapeMenu);
                  }}
                ></ButtonComponent>

                {/* Shape Menu - Positioned Absolutely */}
                {showShapeMenu && (
                  <div
                    style={{
                      position: 'fixed',
                      backgroundColor: '#fff',
                      borderRadius: '4px',
                      border: '1px solid #e0e0e0',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      minWidth: '150px',
                      padding: '5px 0',
                      zIndex: 10000,
                      top: shapeButtonRef.current ? shapeButtonRef.current.getBoundingClientRect().top : '0px',
                      left: shapeButtonRef.current ? shapeButtonRef.current.getBoundingClientRect().right + 10 : '0px',
                    }}
                  >
                    <button
                      onClick={() => {
                        setSelectedShape('Line');
                        handleShapeSelect('Line');
                        setShowShapeMenu(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        padding: '12px 15px',
                        border: 'none',
                        backgroundColor: selectedShape === 'Line' ? '#f0f0f0' : '#fff',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '13px',
                        transition: 'background-color 0.2s',
                        gap: '10px',
                        boxSizing: 'border-box',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = selectedShape === 'Line' ? '#f0f0f0' : '#fff')}
                    >
                      <span className="e-icons e-diagonal-line" style={{ fontSize: '16px' }}></span>
                      <span>Line</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedShape('Rectangle');
                        handleShapeSelect('Rectangle');
                        setShowShapeMenu(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        padding: '12px 15px',
                        border: 'none',
                        backgroundColor: selectedShape === 'Rectangle' ? '#f0f0f0' : '#fff',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '13px',
                        transition: 'background-color 0.2s',
                        gap: '10px',
                        boxSizing: 'border-box',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = selectedShape === 'Rectangle' ? '#f0f0f0' : '#fff')}
                    >
                      <span className="e-icons e-rectangle" style={{ fontSize: '16px' }}></span>
                      <span>Rectangle</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedShape('Circle');
                        handleShapeSelect('Circle');
                        setShowShapeMenu(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        padding: '12px 15px',
                        border: 'none',
                        backgroundColor: selectedShape === 'Circle' ? '#f0f0f0' : '#fff',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '13px',
                        transition: 'background-color 0.2s',
                        gap: '10px',
                        boxSizing: 'border-box',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = selectedShape === 'Circle' ? '#f0f0f0' : '#fff')}
                    >
                      <span className="e-icons e-circle" style={{ fontSize: '16px' }}></span>
                      <span>Circle</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Text Button */}
              <ButtonComponent
                cssClass={activeAnnotation === 'FreeText' ? 'e-small annotation-btn-active' : 'e-small annotation-btn'}
                title="Text"
                iconCss="e-icons e-text-annotation"
                onClick={() => handleAnnotationClick('FreeText')}
              ></ButtonComponent>

              {/* Eraser Button - Enabled only when annotation is selected */}
              <ButtonComponent
                cssClass={selectedAnnotationId ? "e-small annotation-btn" : "e-small annotation-btn annotation-btn-disabled"}
                onClick={() => handleAnnotationClick('Eraser')}
                title="Eraser"
                iconCss="e-icons e-erase"
                disabled={!selectedAnnotationId}
              ></ButtonComponent>

              {/* Separator */}
              <div style={{ width: '40px', height: '1px', backgroundColor: '#ddd', margin: '8px auto' }}></div>

              {/* Undo Button */}
              <ButtonComponent
                cssClass="e-small annotation-btn"
                onClick={undoAnnotation}
                title="Undo"
                iconCss="e-icons e-undo"
              ></ButtonComponent>

              {/* Redo Button */}
              <ButtonComponent
                cssClass="e-small annotation-btn"
                onClick={redoAnnotation}
                title="Redo"
                iconCss="e-icons e-redo"
              ></ButtonComponent>

              <style>{`
                /* App-level layout tokens (used by the main container calc) */
                :root {
                  --appbar-height: 56px;
                }
                /* Add safe-area-aware top padding so the toolbar doesn't crowd
                   the iPad status bar (notch / Dynamic Island). */
                .e-pdf-toolbar {
                  padding-top: env(safe-area-inset-top, 0px);
                  box-sizing: border-box;
                }
                /* On iPad-class screens, the Syncfusion toolbar is denser */
                @media (min-width: 768px) and (max-width: 1366px) {
                  :root { --appbar-height: 60px; }
                }
                /* iPad Pro 11" landscape needs a touch more space for the URL bar */
                @media (min-width: 1024px) and (max-width: 1366px) and (orientation: landscape) {
                  :root { --appbar-height: 64px; }
                }
                /* Small phones get a tighter bar */
                @media (max-width: 480px) {
                  :root { --appbar-height: 52px; }
                }
                .annotation-btn {
                  width: 60px !important;
                  height: 60px !important;
                  border-radius: 8px !important;
                  background-color: #f5f5f5 !important;
                  border: 1px solid #e0e0e0 !important;
                  cursor: pointer;
                  transition: all 0.2s ease !important;
                  display: flex !important;
                  align-items: center;
                  justify-content: center;
                  padding: 0 !important;
                }
                .annotation-btn:hover:not(:disabled) {
                  background-color: #efefef !important;
                }
                .annotation-btn-active {
                  width: 60px !important;
                  height: 60px !important;
                  border-radius: 8px !important;
                  background-color: #ff9966 !important;
                  border: 1px solid #ff9966 !important;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
                  cursor: pointer;
                  transition: all 0.2s ease !important;
                  display: flex !important;
                  align-items: center;
                  justify-content: center;
                  padding: 0 !important;
                }
                .annotation-btn:disabled,
                .annotation-btn-disabled {
                  opacity: 0.4 !important;
                  cursor: not-allowed !important;
                  background-color: #f5f5f5 !important;
                }
                .annotation-btn .e-icons,
                .annotation-btn-active .e-icons {
                  font-size: 20px !important;
                }

                /* Animated Teams-style share-screen border around the whole component */
                .app-share-frame {
                  position: relative;
                  border-radius: 8px;
                  /* Padding so the animated border sits outside the controls */
                  margin: 6px;
                  /* Base + animated glow colors — change to match your brand */
                  --share-color: #ff9966; /* Teams blue, default */
                  --share-color-soft: rgba(0, 120, 212, 0.35);
                  box-shadow:
                    0 0 0 2px var(--share-color),
                    0 0 24px var(--share-color-soft),
                    inset 0 0 0 1px rgba(255, 255, 255, 0.04);
                  animation: share-frame-pulse 2.4s ease-in-out infinite;
                  overflow: visible;
                }

                @keyframes share-frame-pulse {
                  0%, 100% {
                    box-shadow:
                      0 0 0 2px var(--share-color),
                      0 0 16px var(--share-color-soft),
                      inset 0 0 0 1px rgba(255, 255, 255, 0.04);
                  }
                  50% {
                    box-shadow:
                      0 0 0 3px var(--share-color),
                      0 0 36px var(--share-color-soft),
                      inset 0 0 0 1px rgba(255, 255, 255, 0.06);
                  }
                }

                /* Corner accents — render pseudo-elements so they sit on top */
                .app-share-frame::before,
                .app-share-frame::after {
                  content: '';
                  position: absolute;
                  width: 18px;
                  height: 18px;
                  pointer-events: none;
                  border: 3px solid var(--share-color);
                  border-radius: 2px;
                  opacity: 0.95;
                  filter: drop-shadow(0 0 6px var(--share-color-soft));
                }
                .app-share-frame::before {
                  top: 2px;
                  left: 2px;
                  border-right: none;
                  border-bottom: none;
                }
                .app-share-frame::after {
                  bottom: 2px;
                  right: 2px;
                  border-left: none;
                  border-top: none;
                }

                /* Optional: if users prefer reduced motion, freeze the pulse */
                @media (prefers-reduced-motion: reduce) {
                  .app-share-frame,
                  .app-share-frame::before,
                  .app-share-frame::after {
                    animation: none !important;
                  }
                }
              `}</style>
            </div>

            {/* PDF Viewer */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <PdfViewerComponent
                contextMenuOption='None'
                documentLoad={onDocumentLoad}
                annotationSelect={annotationSelect}
                annotationUnSelect={annotationUnSelect}
                annotationAdd={annotationAdded}
                id="container"
                ref={viewerRef}
                enableToolbar={false}
                enableNavigationToolbar={false}
                enableAnnotationToolbar={false}
                enableCommentPanel={false}
                enablePinchZoom={false}
                created={created}
                resourceUrl="https://cdn.syncfusion.com/ej2/23.1.43/dist/ej2-pdfviewer-lib"
                documentPath={window.location.origin + '/pdf-succinctly.pdf'}
                style={{ display: 'block', height: '100%', flex: 1 }}
              >
                <Inject
                  services={[
                    Magnification,
                    Navigation,
                    LinkAnnotation,
                    BookmarkView,
                    FormFields,
                    FormDesigner,
                    PageOrganizer,
                    ThumbnailView,
                    Print,
                    TextSelection,
                    TextSearch,
                    Annotation
                  ]}
                />
              </PdfViewerComponent>
            </div>
          </div>

          {/* Annotation Dialog for Highlight and Ink */}
          <DialogComponent
            ref={dialogRef}
            isModal={false}
            visible={showAnnotationDialog && (activeAnnotation === 'Ink' || activeAnnotation === 'Highlight' || activeAnnotation === 'Line' || activeAnnotation === 'Rectangle' || activeAnnotation === 'Circle' || activeAnnotation === 'FreeText')}
            height="auto"
            width="400px"
            allowDragging={false}
            position={{ X: 'center', Y: 'bottom' }}
            showCloseIcon={false}
            buttons={[]}
            content={getAnnotationDialogContent}
            target={document.body}
          />

          <input
            type="file"
            id="fileUpload"
            accept=".pdf"
            onChange={readFile.bind(this)}
            style={{
              display: 'block',
              visibility: 'hidden',
              width: '0',
              height: '0',
            }}
          />
        </div>
      </div>
    </div>
  );

  function changeZoom(args) {
    const zoomValue = parseInt(args.target.value, 10);

    viewerRef.current?.magnificationModule?.zoomTo(zoomValue);
  }
  function annotationUnSelect() {
    setSelectedAnnotationId(null);
  }

  function annotationAdded(args) {
    if (
      activeAnnotation === 'FreeText' &&
      args.annotationType === 'FreeText'
    ) {
      setActiveAnnotation('None');
    }
    if (activeAnnotation !== 'FreeText' && activeAnnotation !== 'Highlight') {
      setSelectedAnnotationId(args.annotationId);
    }
    else {
      setSelectedAnnotationId(null);
    }
    if (activeAnnotation === 'Line' || activeAnnotation === 'Rectangle' || activeAnnotation === 'Circle') {
      setActiveAnnotation('None');
    }
  }
  function handleShapeSelect(shape) {
    setActiveAnnotation(shape);

    if (viewerRef.current && viewerRef.current.annotation) {
      let annotationMode = 'Rectangle';

      if (shape === 'Line') {
        annotationMode = 'Line';
      } else if (shape === 'Rectangle') {
        annotationMode = 'Rectangle';
      } else if (shape === 'Circle') {
        annotationMode = 'Circle';
      }

      viewerRef.current.annotation.setAnnotationMode(annotationMode);
      setShowAnnotationDialog(true);
      currentAnnotationMode = shape;
      isInkEnabled = false;
    }
  }

  function handleAnnotationClick(mode) {
    if (mode !== 'Done') {
      setActiveAnnotation(mode);
    }

    if (viewerRef.current && viewerRef.current.annotation) {
      if (mode === 'Done') {
        viewerRef.current.annotation.setAnnotationMode('None');
        //viewerRef.current.interactionMode = 'Pan';
        currentAnnotationMode = 'None';
        isInkEnabled = false;
        setShowAnnotationDialog(false);
        setActiveAnnotation('None'); // clear active state
      } else if (mode === 'Eraser') {
        viewerRef.current.annotation.deleteAnnotation(selectedAnnotationId);
        setSelectedAnnotationId(null);
        currentAnnotationMode = 'None';
        isInkEnabled = false;
        setActiveAnnotation('None');
      } else if (mode === 'Highlight') {
        viewerRef.current.annotation.setAnnotationMode('Highlight');
        currentAnnotationMode = 'Highlight';
        isInkEnabled = false;
        setShowAnnotationDialog(true);
      } else if (mode === 'Ink') {
        if (activeAnnotation === 'Ink') {
          return;
        }

        viewerRef.current.annotation.setAnnotationMode('Ink');
        currentAnnotationMode = 'Ink';
        isInkEnabled = true;
        setShowAnnotationDialog(true);
      } else if (mode === 'Square') {
        viewerRef.current.annotation.setAnnotationMode('Rectangle');
        currentAnnotationMode = 'Square';
        isInkEnabled = false;
      } else if (mode === 'FreeText') {
        viewerRef.current.annotation.setAnnotationMode('FreeText');
        currentAnnotationMode = 'FreeText';
        isInkEnabled = false;
      }
    }
  }

  function undoAnnotation() {
    if (viewerRef.current && viewerRef.current.annotation) {
      viewerRef.current.annotation.undo();
    }
  }

  function redoAnnotation() {
    if (viewerRef.current && viewerRef.current.annotation) {
      viewerRef.current.annotation.redo();
    }
  }

  function readFile(evt) {
      const uploadedFiles = evt.target.files;

      if (!uploadedFiles || uploadedFiles.length === 0) {
          return;
      }

      const uploadedFile = uploadedFiles[0];

      const fileUrl = URL.createObjectURL(uploadedFile);

      viewerRef.current.load(fileUrl, null);
      viewerRef.current.fileName = uploadedFile.name;
      viewerRef.current.downloadFileName = uploadedFile.name;

      evt.target.value = '';
  }

  function searchInputKeypressed(event) {
    if (event.key === 'Enter') {
      initiateTextSearch();
    }
  }
  function onDocumentLoad() {
    viewerRef.current.magnification.zoomTo(125);
  }
  function annotationSelect(event) {
    setSelectedAnnotationId(event.annotationId);
  }
  function created() {
    viewerRef.current.textFieldSettings = {
      isReadOnly: true,
    };

    viewerRef.current.radioButtonFieldSettings = {
      isReadOnly: true,
    };

    viewerRef.current.DropdownFieldSettings = {
      isReadOnly: true,
    };
    viewerRef.current.checkBoxFieldSettings = {
      isReadOnly: true,
    };
    viewerRef.current.signatureFieldSettings = {
      isReadOnly: true,
    };
    viewerRef.current.listBoxFieldSettings = {
      isReadOnly: true,
    };
    viewerRef.current.passwordFieldSettings = {
      isReadOnly: true,
    };
    viewerRef.current.initialFieldSettings = {
      isReadOnly: true,
    };
    viewerRef.current.dataBind();
  }

  function initiateTextSearch() {
    var textsearchElement = document.getElementById(
      'container_search_box-icon'
    );
    if (textsearchElement) {
      setSearchButtonsEnabled(true);
      textsearchElement.classList.add('e-close');
      textsearchElement.classList.remove('e-search');
      if (
        searchText !==
        document.getElementById('container_search_input').value ||
        prevMatchCase !== matchCase
      ) {
        viewerRef.current.textSearch.cancelTextSearch();
        searchText = document.getElementById('container_search_input').value;
        searchActive = true;
        viewerRef.current.textSearch.searchText(searchText, matchCase);
        prevMatchCase = matchCase;
      } else {
        nextTextSearch();
      }
    }
  }

  function checkSearchActive() {
    if (viewerRef.current && viewerRef.current.textSearchModule && !searchActive) {
      viewerRef.current.textSearch.cancelTextSearch();
      const searchInput = document.getElementById('container_search_input');
      updateSearchInputIcon(true);
      searchInput.value = '';
      viewerRef.current.textSearch.resetVariablesTextSearch();
      searchText = '';
      setSearchButtonsEnabled(false);
    }
  }

  function inputChange() {
    viewerRef.current.viewerBase.clearAllTextSearchOccurrences();
    searchActive = false;
    if (document.getElementById('container_search_input').value == '') {
      updateSearchInputIcon(true);
      viewerRef.current.textSearch.cancelTextSearch();
      searchText = '';
    }
  }

  function searchClickHandler() {
    var searchBtn = document.getElementById('container_search_box-icon');
    if (searchBtn.classList.contains('e-search')) {
      viewerRef.current.textSearch.cancelTextSearch();
      initiateTextSearch();
      updateSearchInputIcon(false);
      searchText = '';
    } else if (searchBtn.classList.contains('e-close')) {
      var searchInput = document.getElementById('container_search_input');
      updateSearchInputIcon(true);
      searchInput.value = '';
      searchInput.focus();
      viewerRef.current.textSearch.cancelTextSearch();
      viewerRef.current.textSearch.resetVariablesTextSearch();
      searchText = '';
    }
  }

  function updateSearchInputIcon(isEnable) {
    var searchBtn = document.getElementById('container_search_box-icon');
    if (isEnable) {
      searchBtn.classList.add('e-search');
      searchBtn.classList.remove('e-close');
    } else {
      searchBtn.classList.add('e-close');
      searchBtn.classList.remove('e-search');
    }
  }

  function nextTextSearch() {
    disableInkAnnotation();
    viewerRef.current.textSearchModule.searchNext();
    searchActive = true;
  }

  function previousTextSearch() {
    disableInkAnnotation();
    viewerRef.current.textSearchModule.searchPrevious();
    searchActive = true;
  }

  function disableInkAnnotation() {
    if (isInkEnabled) {
      viewerRef.current.annotation.setAnnotationMode('None');
      isInkEnabled = false;
      currentAnnotationMode = 'None';
      setActiveAnnotation('None');
    }
  }

  function checkBoxChanged(event) {
    const target = event.target;
    if (target.checked) {
      const matchcaseElement = document.getElementById('container_match_case');
      if (matchcaseElement) {
        matchcaseElement.checked = true;
      }
      matchCase = true;
      const checkboxSpanElement = document.getElementById('checkboxSpan');
      if (checkboxSpanElement) {
        checkboxSpanElement.classList.add('e-check');
      }
    } else {
      matchCase = false;
      const checkboxSpanElement = document.getElementById('checkboxSpan');
      if (checkboxSpanElement) {
        checkboxSpanElement.classList.remove('e-check');
      }
    }
  }

  function clickHandler(args) {
    switch (args.item.id) {
      case 'file_Open':
        {
          disableInkAnnotation();
          let fileUpload = document.getElementById('fileUpload');
          fileUpload.click();

          let textSearchToolbarElement =
            document.getElementById('textSearchToolbar');
          if (textSearchToolbarElement.style.display === 'block')
            textSearchToolbarElement.style.display = 'none';
        }
        break;
      case 'save':
        {
          disableInkAnnotation();
          let textSearchToolbarElement =
            document.getElementById('textSearchToolbar');
          if (textSearchToolbarElement.style.display == 'block')
            textSearchToolbarElement.style.display = 'none';
          viewerRef.current.download();
        }
        break;
      case 'zoom_in':
        {
          viewerRef.current?.magnificationModule?.zoomIn();
        }
        break;

      case 'zoom_out':
        {
          viewerRef.current?.magnificationModule?.zoomOut();
        }
        break;
      case 'pan_tool':
        {
          const selectedItem = document.getElementById(args.item?.id || '');
          const selectTool = document.getElementById('selection_tool');
          if (selectedItem) {
            selectedItem.classList.add('e-pv-tbar-btn', 'e-pv-select');
          }
          if (selectTool) {
            selectTool.classList.remove('e-pv-select');
          }
          viewerRef.current.interactionMode = 'Pan';
        }
        break;
      case 'selection_tool':
        {
          const selectedItem = document.getElementById(args.item?.id || '');
          const panTool = document.getElementById('pan_tool');
          if (selectedItem) {
            selectedItem.classList.add('e-pv-tbar-btn', 'e-pv-select');
          }
          if (panTool) {
            panTool.classList.remove('e-pv-select');
          }
          viewerRef.current.interactionMode = 'TextSelection';
        }
        break;
      case 'organize-pdf': {
        viewerRef.current.pageOrganizer.openPageOrganizer();
        break;
      }
      case 'find_text': {
        searchActive = !searchActive;
        checkSearchActive();
        disableInkAnnotation();
        let textSearchToolbarElement =
          document.getElementById('textSearchToolbar');
        if (textSearchToolbarElement.style.display === 'block')
          textSearchToolbarElement.style.display = 'none';
        else textSearchToolbarElement.style.display = 'block';
        break;
      }
    }
  }
}

export default CustomToolbar;
