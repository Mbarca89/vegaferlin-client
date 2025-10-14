import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useFormik } from 'formik';
import { notifySuccess } from '../../../components/Toaster/Toaster';
import handleError from '../../../utils/HandleErrors';
import { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import type { Appointment, patientList } from '../../../types';
import { axiosWithoutToken, axiosWithToken } from '../../../utils/axiosInstances';
import { modalState } from '../../../app/store';
import { useRecoilState } from "recoil"
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface AddAppointmentProps {
    start: string
    end: string
    updateEvents: () => void
}

const AddAppointment: React.FC<AddAppointmentProps> = ({ start, end, updateEvents }) => {

    const [loading, setLoading] = useState<boolean>(true)
    const [uploading, setUploading] = useState<boolean>(false)
    const [show, setShow] = useRecoilState(modalState)
    const [patients, setPatients] = useState<{ [fullName: string]: string }>({});
    const [selectedPatient, setSelectedPatient] = useState("")
    const [phone, setPhone] = useState<string>('');


    const getPatients = async () => {
        setLoading(true);
        try {
            const res = await axiosWithToken(`${SERVER_URL}/api/patients/getPatients`);
            if (res.data) {
                const formattedPatients = res.data.reduce((acc: { [key: string]: string }, patient: { name: string, surname: string, phone: string }) => {
                    const fullName = `${patient.name} ${patient.surname}`;
                    acc[fullName] = patient.phone;
                    return acc;
                }, {});
                setPatients(formattedPatients);
            }
        } catch (error) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    };

    const handlePatientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedName = e.target.value;
        setSelectedPatient(selectedName);
        formik.setFieldValue('name', selectedName);

        if (patients[selectedName]) {
            const patientPhone = patients[selectedName];
            setPhone(patientPhone);
            formik.setFieldValue('phone', patientPhone);
        } else {
            setPhone('');
            formik.setFieldValue('phone', '');
        }
    };


    const validate = (values: Appointment): Appointment => {
        const errors: any = {};

        if (!values.title.trim()) {
            errors.title = 'Ingrese el título';
        }

        if (!values.start.trim()) {
            errors.start = 'Ingrese la hora de la cita';
        }
        if (!phone) {
            errors.phone = 'Ingrese el teléfono del paciente';
        }
        if (!values.name.trim()) {
            errors.name = 'Ingrese el nombre del paciente';
        }
        if (!values.start) {
            errors.start = 'Ingrese la hora de inicio';
        } else {
            const startDate = new Date(values.start);
            if (isNaN(startDate.getTime())) {
                errors.start = 'Formato de hora inválido';
            }
        }

        if (!values.end) {
            errors.end = 'Ingrese la hora de fin';
        } else {
            const startDate = new Date(values.start);
            const endDate = new Date(values.end);

            if (isNaN(endDate.getTime())) {
                errors.end = 'Formato de hora inválido';
            } else if (endDate <= startDate) {
                errors.end = 'La hora de fin debe ser posterior al inicio';
            }
        }
        return errors;
    };

    const formik = useFormik({
        initialValues: {
            id: 0,
            name: "",
            phone: "",
            title: "",
            start: start || "",
            end: end || "",
            messageSent: false
        },
        validate,
        enableReinitialize: true,
        onSubmit: async values => {
            setUploading(true)
            const createEvent = {
                name: values.name,
                phone: "549" + values.phone,
                title: values.title,
                startDate: values.start,
                endDate: values.end || values.start,
            }
            let res
            try {
                res = await axiosWithToken.post(`${SERVER_URL}/api/appointment/create`, createEvent)
                notifySuccess(res.data)
            } catch (error: any) {
                handleError(error)
            } finally {
                setUploading(false)
                setShow(false)
                updateEvents()
            }
        },
    });

    const resetForm = () => {
        formik.resetForm();
        setShow(false)
    }

    useEffect(() => {
        getPatients()
    }, [])

    return (
        loading ?
            <div></div> :
            <div>
                <Form onSubmit={formik.handleSubmit} noValidate>
                    <Row className='mb-2'>
                        <Col xs={12} lg={6}>
                            <label className='text-light' htmlFor="patient">Nombre</label>
                            <input
                                className={`form-control ${formik.touched.name && formik.errors.name ? 'is-invalid' : ''}`}
                                list="patient-list"
                                id="patient"
                                name="name"
                                value={formik.values.name}
                                onChange={(e) => {
                                    formik.handleChange(e);
                                    handlePatientChange(e);
                                }}
                                onBlur={formik.handleBlur}
                                autoComplete='off'
                            />
                            {Object.keys(patients).length > 0 && (
                                <datalist id="patient-list">
                                    {Object.keys(patients).map((fullName) => (
                                        <option key={fullName} value={fullName} />
                                    ))}
                                </datalist>
                            )}
                            <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>
                        </Col>
                    </Row>
                    <Row>
                        <Form.Group as={Col} xs={12} lg={6}>
                            <Form.Label className='text-light'>Teléfono (+549)</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Teléfono"
                                id="phone"
                                name="phone"
                                value={formik.values.phone}
                                onChange={(e) => {
                                    setPhone(e.target.value);
                                    formik.setFieldValue("phone", e.target.value);
                                }}
                                isInvalid={!!(formik.touched.phone && formik.errors.phone)}
                            />
                            <Form.Control.Feedback type="invalid">{formik.errors.phone}</Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row className="mb-2">
                        <Form.Group as={Col} xs={12} lg={6}>
                            <Form.Label className='text-light'>Título</Form.Label>
                            <Form.Control type="text" placeholder="Título"
                                id="title"
                                name="title"
                                value={formik.values.title}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={!!(formik.touched.title && formik.errors.title)}
                            />
                            <Form.Control.Feedback type="invalid">{formik.errors.title}</Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row className="mb-2">
                        <Form.Group as={Col} xs={12} lg={6}>
                            <Form.Label className='text-light'>Hora</Form.Label>
                            <Form.Control type="datetime-local"
                                id="start"
                                name="start"
                                value={formik.values.start}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={!!(formik.touched.start && formik.errors.start)}
                            />
                            <Form.Control.Feedback type="invalid">{formik.errors.start}</Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row className="mb-2">
                        <Form.Group as={Col} xs={12} lg={6}>
                            <Form.Label className='text-light'>Hasta</Form.Label>
                            <Form.Control type="datetime-local"
                                id="end"
                                name="end"
                                value={formik.values.end}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                 isInvalid={!!(formik.touched.end && formik.errors.end)}
                            />
                            <Form.Control.Feedback type="invalid">{formik.errors.end}</Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row className='mb-3'>
                        <Form.Group as={Col} className="d-flex justify-content-center mt-3">
                            <div className='d-flex align-items-center justify-content-center w-25'>
                                <Button className="" variant="danger" onClick={resetForm}>
                                    Cancelar
                                </Button>
                            </div>
                            {!uploading ?
                                <div className='d-flex align-items-center justify-content-center w-25'>
                                    <Button className="" variant="primary" type="submit">
                                        Agendar
                                    </Button>
                                </div> :
                                <div className='d-flex align-items-center justify-content-center w-25'>
                                    <Spinner variant="light" />
                                </div>}
                        </Form.Group>
                    </Row>
                </Form>
            </div>
    )
}

export default AddAppointment