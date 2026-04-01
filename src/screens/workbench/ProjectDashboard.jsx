import { useState, useRef } from 'react';
import Viewer from './Viewer';

const ProjectDashboard = ({ token, urn }) => {
  const [camera, setCamera] = useState(null); // TODO: [WIP] : use navigate to each ioT
  const [selectedIds, setSelectedIds] = useState([]); // TODO:
  const wrapperRef = useRef(null);


  return (
    <div className='rounded-xl' style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Viewer
        runtime={{ accessToken: token }}
        urn={urn}
        selectedIds={selectedIds}
        onCameraChange={({ viewer, camera }) => setCamera(camera.getWorldPosition())}
        onSelectionChange={({ viewer, ids }) => setSelectedIds(ids)}
        ref={wrapperRef}
      />
    </div>
  );
};

export default ProjectDashboard;
