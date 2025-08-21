import Table from 'react-bootstrap/Table';
import { useState, useEffect } from "react";
import type { patientList } from "../../../types";
import { axiosWithToken } from "../../../utils/axiosInstances";
import CustomModal from '../../Modal/CustomModal';
import { modalState } from "../../../app/store"
import { useRecoilState } from "recoil"
import { useNavigate } from 'react-router-dom';
import handleError from '../../../utils/HandleErrors';
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import DeletePatient from '../DetelePatient/DetelePatient';
import TransferPatient from '../TransferPatient/TransferPatient';
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

const PatientList = () => {

    const navigate = useNavigate()
    const [loading, setLoading] = useState<boolean>(false)

    const [selectedPatient, setSelectedPatient] = useState<patientList>({
        id: 0,
        inChargeOf: "",
        name: "",
        surname: "",
        docType: "",
        doc: 0,
        gender: "",
        phone: 0
    });

    const [patients, setPatients] = useState<patientList[]>([]);

    const [show, setShow] = useRecoilState(modalState)
    const [transferPatient, setTransferPatient] = useState<boolean>(false)
    const [deletePatient, setDeletePatient] = useState<boolean>(false)

    const getPatients = async () => {
        setLoading(true)
        try {
            const res = await axiosWithToken(`${SERVER_URL}/api/patients/getPatients`)
            if (res.data) {
                setPatients(res.data)
            }
        } catch (error) {
            handleError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getPatients()
    }, [])

    const handleDelete = (patient: patientList) => {
        setSelectedPatient(patient);
        setDeletePatient(true)
        setTransferPatient(false)
        setShow(!show);
    };

    const handleTransfer = (patient: patientList) => {
        setSelectedPatient(patient);
        setDeletePatient(false)
        setTransferPatient(true)
        setShow(!show);
    };

    const handleSearch = async (event: any) => {
        setLoading(true)
        let searchTerm
        event.preventDefault()
        if (event.type == "submit") searchTerm = event.target[0].value
        try {
            const res = await axiosWithToken.get(`${SERVER_URL}/api/patients/search?searchTerm=${searchTerm}`)
            if (res.data) {
                setPatients(res.data);
            }
            setLoading(false)
        } catch (error: any) {
            handleError(error)
            setLoading(false)
        }
    }

    const handleResetSearch = (event: any) => {
        if (event.target.value == "") getPatients()
    }

    return (
        <div className='text-nowrap'>
            <h2 className="mb-5 text-light">Pacientes</h2>
            <Form onSubmit={handleSearch} className='mb-3'>
                <Row>
                    <Col xs="auto">
                        <Form.Control
                            type="text"
                            placeholder="Buscar"
                            className=" mr-sm-2"
                            onChange={handleResetSearch}
                        />
                    </Col>
                    <Col xs="auto">
                        <Button type="submit">Buscar</Button>
                    </Col>
                </Row>
            </Form>
            {!loading ? <Table striped bordered hover size="sm" variant="dark">
                <thead>
                    <tr>
                        <th>Apellido</th>
                        <th>Nombre</th>
                        <th>Documento</th>
                        <th>Sexo</th>
                        <th>Teléfono</th>
                        <th>A cargo de</th>
                        <th>Eliminar</th>
                        <th>Transferir</th>
                    </tr>
                </thead>
                <tbody>
                    {patients.map(patient => <tr key={String(patient.id)}>
                        <td role='button' onClick={() => navigate(`/patient/${patient.id}/PersonalInfo`)}>{patient.surname}</td>
                        <td role='button' onClick={() => navigate(`/patient/${patient.id}/PersonalInfo`)}>{patient.name}</td>
                        <td role='button' onClick={() => navigate(`/patient/${patient.id}/PersonalInfo`)}>{`${patient.docType}: ${patient.doc}`}</td>
                        <td role='button' onClick={() => navigate(`/patient/${patient.id}/PersonalInfo`)}>{patient.gender}</td>
                        <td role='button' onClick={() => navigate(`/patient/${patient.id}/PersonalInfo`)}>{patient.phone}</td>
                        <td role='button' onClick={() => navigate(`/patient/${patient.id}/PersonalInfo`)}>{patient.inChargeOf}</td>
                        <td><svg onClick={() => handleDelete(patient)} role="button" width="25" height="25" viewBox="0 0 512 512" style={{ color: "#ffffff" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full cursor-pointer"><rect width="512" height="512" x="0" y="0" rx="0" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 24 24" fill="#632f6b" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#632f6b"><g id="evaPersonDeleteOutline0"><g id="evaPersonDeleteOutline1"><path id="evaPersonDeleteOutline2" fill="currentColor" d="m20.47 7.5l.73-.73a1 1 0 0 0-1.47-1.47L19 6l-.73-.73a1 1 0 0 0-1.47 1.5l.73.73l-.73.73a1 1 0 0 0 1.47 1.47L19 9l.73.73a1 1 0 0 0 1.47-1.5ZM10 11a4 4 0 1 0-4-4a4 4 0 0 0 4 4Zm0-6a2 2 0 1 1-2 2a2 2 0 0 1 2-2Zm0 8a7 7 0 0 0-7 7a1 1 0 0 0 2 0a5 5 0 0 1 10 0a1 1 0 0 0 2 0a7 7 0 0 0-7-7Z" /></g></g></g></svg></svg></td>
                        <td><svg onClick={() => handleTransfer(patient)} role="button"  width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(0 0 0)"><path d="M14.5359 5.46986C14.3214 5.25526 13.9988 5.19101 13.7185 5.30707C13.4382 5.42312 13.2554 5.69663 13.2554 6.00002V11.2466L4 11.2466C3.58579 11.2466 3.25 11.5824 3.25 11.9966C3.25 12.4108 3.58579 12.7466 4 12.7466L13.2554 12.7466V18C13.2554 18.3034 13.4382 18.5769 13.7185 18.693C13.9988 18.809 14.3214 18.7448 14.5359 18.5302L20.5319 12.53C20.6786 12.3831 20.7518 12.1905 20.7514 11.9981L20.7514 11.9966C20.7514 11.7685 20.6495 11.5642 20.4888 11.4266L14.5359 5.46986Z" fill="#ffffff "/></svg></td>
                        


                    </tr>
                    )}
                    {show &&
                        deletePatient && <CustomModal title="Eliminar paciente">
                            <DeletePatient patientId={selectedPatient.id} patientName={selectedPatient.name} updateList={getPatients} />
                        </CustomModal>
                    }
                    {show &&
                        transferPatient && <CustomModal title="Transferir paciente">
                            <TransferPatient patientId={selectedPatient.id} patientName={selectedPatient.name} inChargeOf={selectedPatient.inChargeOf} updateList={getPatients} />
                        </CustomModal>
                    }
                </tbody>
            </Table> :
                <Spinner />}
        </div>
    )
}

export default PatientList