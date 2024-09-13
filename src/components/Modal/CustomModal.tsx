import Modal from 'react-bootstrap/Modal';
import { modalState } from "../../app/store"
import { useRecoilState } from "recoil"



function CustomModal({ children, title }: any) {

  let [show, setShow] = useRecoilState(modalState)
  
  const handleClose = () => setShow(false);
  
  return (
    <>
      <Modal data-bs-theme="dark" backdrop="static" show={show} onHide={handleClose} size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered>
        <Modal.Header closeButton className='text-light'>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {children}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default CustomModal;