import React, { useState } from 'react';
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,

  MDBModalBody,
} from 'mdb-react-ui-kit';

export default function App({content}) {
  const [basicModal, setBasicModal] = useState(true);

  const toggleOpen = () => setBasicModal(!basicModal);

  return (
    <>
      <MDBModal  open={basicModal} setopen={setBasicModal} tabIndex='-1'>
        <MDBModalDialog >
          <MDBModalContent className='popup'>
          <MDBBtn className='btn-close cross' color='none' onClick={toggleOpen}></MDBBtn>
            <MDBModalBody className='popup-body'>{content}</MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
}