import { notifySuccess } from "../../Toaster/Toaster";
import { axiosWithToken } from "../../../utils/axiosInstances";
import { modalState } from "../../../app/store"
import { useRecoilState } from "recoil"
import Button from 'react-bootstrap/Button';
import handleError from "../../../utils/HandleErrors";
import { Form, Row, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { userData } from "../../../types";
import { useFormik } from "formik";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface DeletePatientProps {
    patientId: number
    patientName: string
    inChargeOf: string
    updateList: () => void;
}

const DeletePatient: React.FC<DeletePatientProps> = ({ patientId, patientName, inChargeOf, updateList }) => {
    const [loading, setloading] = useState<boolean>(false)
    const [show, setShow] = useRecoilState(modalState)
    const [confirm, setConfirm] = useState<boolean>(false)

    const [users, setUsers] = useState<userData[]>([{
        id: "",
        name: "",
        surname: "",
        userName: "",
        password: "",
        role: ""
    }]);

    const getUsers = async () => {
        const res = await axiosWithToken(`${SERVER_URL}/api/v1/users/getUsers`)
        if (res.data) {
            setUsers(res.data)
        }
    }

    useEffect(() => {
        getUsers()
    }, [])

    const validate = (values: { inChargeOf: any; }) => {
        const errors: any = {};

        if (!values.inChargeOf) {
            errors.inChargeOf = '1';
        }
        return errors;
    };

    const formik = useFormik({
        initialValues: {
            inChargeOf: "",
            inChargeOfId: 0,
        },
        validate,
        onSubmit: async values => {
            setConfirm(true)
        },
    });

    const handleTransfer = async () => {
        try {
            const res = await axiosWithToken.put(`${SERVER_URL}/api/patients/transfer?inChargeOfId=${formik.values.inChargeOfId}&inChargeOf=${formik.values.inChargeOf}&patientId=${patientId}`)
            notifySuccess(res.data)
            updateList()
        } catch (error: any) {
            handleError(error)
        } finally {
            setShow(false)
            setloading(false)
        }
    }

    const handleCancel = () => {
        setShow(false)
    }

    return (
        <div className="d-flex flex-column align-items-center text-light">
            {!confirm ?
                <div>
                    <p className="text-center">¿Esta seguro que quiere transferir el paciente {patientName}?</p>
                    <p className="text-center">Profesional a cargo: {inChargeOf}</p>
                    <Form onSubmit={formik.handleSubmit} noValidate data-bs-theme="dark" className="mt-3">
                        <Row className="bg-dark-700 mb-3 rounded">
                            <h4 className="mb-5 text-light">Seleccione el nuevo profesional a cargo</h4>
                            <Form.Group className="mb-3">
                                <Form.Label className='text-light'>Nuevo profesional a cargo</Form.Label>
                                <Form.Select
                                    id="inChargeOf"
                                    name="inChargeOf"
                                    value={formik.values.inChargeOf}
                                    onChange={(e) => {
                                        const selectedValue = e.target.value;
                                        formik.handleChange(e);

                                        const selectedUser = users.find(user => `${user.name} ${user.surname}` === selectedValue);
                                        if (selectedUser) {
                                            formik.setFieldValue('inChargeOfId', selectedUser.id);
                                        }
                                    }}
                                    onBlur={formik.handleBlur}
                                    isInvalid={!!(formik.touched.inChargeOf && formik.errors.inChargeOf)}
                                >
                                    <option value="">Seleccionar...</option>
                                    {users.map((user) => (
                                        <option key={user.id} value={`${user.name} ${user.surname}`}>{`${user.name} ${user.surname}`}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Row>
                        <div className="mt-3 d-flex align-items-center justify-content-center gap-4 w-100">
                            {!loading ?
                                <div className="w-25 d-flex align-items-center justify-content-center">
                                    <Button className="" variant="primary" type="submit">Transferir</Button>
                                </div>
                                :
                                <div className="w-25 d-flex align-items-center justify-content-center">
                                    <Spinner />
                                </div>
                            }
                        </div>
                    </Form>
                </div> :
                <div>
                    <div className="mt-3 d-flex flex-column align-items-center justify-content-center gap-4 w-100">
                        <p>¿Confirma transferir el patiente {patientName} a {formik.values.inChargeOf}?</p>
                        <p>Luego no podra recuperar el control del paciente</p>
                        <div className="mt-3 d-flex align-items-center justify-content-center gap-4 w-100">
                            <div className="w-25 d-flex align-items-center justify-content-center">
                                <Button className="" variant="danger" onClick={handleCancel}>Cancelar</Button>
                            </div>
                            <div className="w-25 d-flex align-items-center justify-content-center">
                                <Button className="" variant="primary" onClick={handleTransfer}>Confirmar</Button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default DeletePatient