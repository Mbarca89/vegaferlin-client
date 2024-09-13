import Modal from 'react-bootstrap/Modal';
import { alertModalState, modalState } from "../../app/store"
import { useRecoilState } from "recoil"
import { useState } from 'react';



function AlertModal() {
    let [show, setShow] = useRecoilState(alertModalState)
    const handleClose = () => setShow(false);

    return (
        <>
            <Modal data-bs-theme="dark" backdrop={true} show={show} onHide={handleClose} size="lg"
                aria-labelledby="contained-modal-title-vcenter"
            >
                <Modal.Header closeButton className='text-light'>
                    <Modal.Title>El formulario actual tiene cambios sin guardar.</Modal.Title>
                </Modal.Header>
                <Modal.Body className='text-light text-center'>
                    <p>
                        Guarde o cancele los cambios antes de continuar.
                    </p>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default AlertModal;