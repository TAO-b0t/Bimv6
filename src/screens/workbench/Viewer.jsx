import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const { Autodesk } = window;
/*
 * [WIP] TODO: add extension (ioT)
 * https://aps.autodesk.com/en/docs/viewer/v6/reference/Viewing/   : api ref for use Autodesk.obj
 */

const runtime = {
  /** @type {Autodesk.Viewing.InitializerOptions} */
  options: null,
  /** @type {Promise<void>} */
  ready: null
};

/**
 * initViewer for communicate with APS
 * @async
 * @param {Autodesk.Viewing.InitializerOptions} options Runtime initialization options.
 * @returns {Promise<void>} Promise<void>
 */
function initViewer(options) {
  if (!runtime.ready) {
    runtime.options = { ...options };
    runtime.ready = new Promise((resolve) => Autodesk.Viewing.Initializer(runtime.options, resolve));
  } else {
    if (['accessToken', 'getAccessToken', 'env', 'api', 'language'].some(prop => options[prop] !== runtime.options[prop])) {
      return Promise.reject('cannot init another viewer runtime with different settings.')
    }
  }
  return runtime.ready;
}

/**
 * APS viewer wrapper (can't run often : unexpected behavior after call many time)
 */
export default function Viewer({ runtime: runtimeOptions = {}, urn, selectedIds, onCameraChange, onSelectionChange }) {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);

  // https://aps.autodesk.com/en/docs/viewer/v6/reference/Viewing/   : api ref for use Autodesk.obj
  const handleCameraChange = () => {
    if (onCameraChange && viewerRef.current) {
      onCameraChange({
        viewer: viewerRef.current,
        camera: viewerRef.current.getCamera()
      });
    }
  };

  const handleSelectionChange = () => {
    if (onSelectionChange && viewerRef.current) {
      onSelectionChange({
        viewer: viewerRef.current,
        ids: viewerRef.current.getSelection()
      });
    }
  };

  const updateViewerState = (prevProps) => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    if (urn && urn !== prevProps.urn) {
      Autodesk.Viewing.Document.load(
        'urn:' + urn,
        (doc) => viewer.loadDocumentNode(doc, doc.getRoot().getDefaultGeometry()),
        (code, message, errors) => console.error(code, message, errors)
      );
    } else if (!urn && viewer.model) {
      viewer.unloadModel(viewer.model);
    }

    const currentSelectedIds = viewer.getSelection();
    if (JSON.stringify(selectedIds || []) !== JSON.stringify(currentSelectedIds)) {
      viewer.select(selectedIds);
    }
  };

  // initialize viewer
  useEffect(() => {
    initViewer(runtimeOptions)
      .then(_ => {
        viewerRef.current = new Autodesk.Viewing.GuiViewer3D(containerRef.current);
        viewerRef.current.start();

        viewerRef.current.addEventListener(
          Autodesk.Viewing.CAMERA_CHANGE_EVENT,
          handleCameraChange
        );
        viewerRef.current.addEventListener(
          Autodesk.Viewing.SELECTION_CHANGED_EVENT,
          handleSelectionChange
        );

        updateViewerState({});
      })
      .catch(err => console.error(err));

    // cleanup
    return () => {
      if (viewerRef.current) {
        viewerRef.current.removeEventListener(
          Autodesk.Viewing.CAMERA_CHANGE_EVENT,
          handleCameraChange
        );
        viewerRef.current.removeEventListener(
          Autodesk.Viewing.SELECTION_CHANGED_EVENT,
          handleSelectionChange
        );
        viewerRef.current.finish();
        viewerRef.current = null;
      }
    };
  }, []);

  // handle URN change
  useEffect(() => {
    if (viewerRef.current) {
      updateViewerState({});
    }
  }, [urn]);
  //}, [urn, selectedIds]); // TODO: selectedIDs need to connect with Project (side bar) :decide: faster ? inside-popup : our-design

  return <div ref={containerRef}></div>;
};

Viewer.propTypes = {
  /** viewer runtime initialization opt. */
  runtime: PropTypes.object,
  /** URN to be loaded. */
  urn: PropTypes.string,
  /** list of selected object IDs. */
  selectedIds: PropTypes.arrayOf(PropTypes.number),
  /** callback : when the viewer camera changes. */
  onCameraChange: PropTypes.func,
  /** callback : when the viewer selectio changes. */
  onSelectionChange: PropTypes.func
};

//export default Viewer;
