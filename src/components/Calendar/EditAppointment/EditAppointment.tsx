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
import DeleteAppointment from '../DeleteAppointment/DeleteAppointment';
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface AddAppointmentProps {
    id: number
    updateEvents: () => void
}

const EditAppointment: React.FC<AddAppointmentProps> = ({ id, updateEvents }) => {

    const [loading, setLoading] = useState<boolean>(false)
    const [show, setShow] = useRecoilState(modalState)
    const [patients, setPatients] = useState<{ [fullName: string]: string }>({});
    const [selectedPatient, setSelectedPatient] = useState("")
    const [selectedId, setSelectedId] = useState<number>()
    const [phone, setPhone] = useState<string>('');
    const [event, setEvent] = useState<Appointment>({
        id: 0,
        title: "",
        name: "",
        phone: "",
        start: "",
        end: "",
        messageSent: false
    })
    const [edit, setEdit] = useState<boolean>(false)

    const formatDate = (date: string) => {
        const parsedDate = new Date(date);
        const year = parsedDate.getFullYear();
        const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
        const day = String(parsedDate.getDate()).padStart(2, '0');
        const hours = String(parsedDate.getHours()).padStart(2, '0');
        const minutes = String(parsedDate.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const handlePatientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedName = e.target.value;
        setSelectedPatient(selectedName);
        formik.setFieldValue('name', selectedName);
        if (patients[selectedName]) {
            setPhone(patients[selectedName]);
            formik.setFieldValue('phone', patients[selectedName]);
        } else {
            setPhone('');
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
        if (!values.phone) {
            errors.phone = 'Ingrese el teléfono del paciente';
        }
        if (!values.name.trim()) {
            errors.name = 'Ingrese el nombre del paciente';
        }
        return errors;
    };

    const formik = useFormik({
        initialValues: {
            id: event.id,
            name: selectedPatient,
            phone: phone,
            title: event.title,
            start: event.start,
            end: event.end,
            messageSent: event.messageSent
        },
        validate,
        enableReinitialize: true,
        onSubmit: async values => {
            setLoading(true)
            let formattedPhone = values.phone.trim();
            if (!formattedPhone.startsWith("549")) {
                formattedPhone = `549${formattedPhone}`;
            }
            const updateEvent = {
                id: event.id,
                name: values.name,
                phone: formattedPhone,
                title: values.title,
                startDate: values.start,
                endDate: values.end || values.start,
                messageSent: values.messageSent
            }
            let res
            try {
                res = await axiosWithToken.put(`${SERVER_URL}/api/appointment/update`, updateEvent)
                notifySuccess(res.data)
            } catch (error: any) {
                handleError(error)
            } finally {
                setLoading(false)
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
        const getEvent = async () => {
            setLoading(true);
            try {
                const res = await axiosWithToken(`${SERVER_URL}/api/appointment/getById?id=${id}`);
                if (res.data) {
                    const formattedStart = formatDate(res.data.start);
                    const formattedEnd = formatDate(res.data.end);

                    setEvent({
                        ...res.data,
                        start: formattedStart,
                        end: formattedEnd,
                    });

                    setPhone(res.data.phone)
                    setSelectedPatient(res.data.name)
                }
            } catch (error) {
                handleError(error);
            } finally {
                setLoading(false);
            }
        }
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
        getPatients()
        getEvent()
    }, [])

    const handleDelete = (id: number) => {
        setSelectedId(id)
    }

    return (
       !selectedId ? <div>
            <div className='d-flex justify-content-end gap-2'>
                <svg onClick={() => setEdit(!edit)} role="button" width="35" height="35" viewBox="0 0 512 512" style={{ color: "#ffffff" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full cursor-pointer"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 1024 1024" fill="#D040EE" x="0" y="0" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#D040EE"><path fill="currentColor" d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 0 0 0-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 0 0 9.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3l-362.7 362.6l-88.9 15.7l15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z" /></g></svg></svg>
                <svg onClick={() => handleDelete(id)} role="button" width="35" height="35" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(0 0 0)">
                    <path d="M14.7223 12.7585C14.7426 12.3448 14.4237 11.9929 14.01 11.9726C13.5963 11.9522 13.2444 12.2711 13.2241 12.6848L12.9999 17.2415C12.9796 17.6552 13.2985 18.0071 13.7122 18.0274C14.1259 18.0478 14.4778 17.7289 14.4981 17.3152L14.7223 12.7585Z" fill="#ffffff" />
                    <path d="M9.98802 11.9726C9.5743 11.9929 9.25542 12.3448 9.27577 12.7585L9.49993 17.3152C9.52028 17.7289 9.87216 18.0478 10.2859 18.0274C10.6996 18.0071 11.0185 17.6552 10.9981 17.2415L10.774 12.6848C10.7536 12.2711 10.4017 11.9522 9.98802 11.9726Z" fill="#ffffff" />
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M10.249 2C9.00638 2 7.99902 3.00736 7.99902 4.25V5H5.5C4.25736 5 3.25 6.00736 3.25 7.25C3.25 8.28958 3.95503 9.16449 4.91303 9.42267L5.54076 19.8848C5.61205 21.0729 6.59642 22 7.78672 22H16.2113C17.4016 22 18.386 21.0729 18.4573 19.8848L19.085 9.42267C20.043 9.16449 20.748 8.28958 20.748 7.25C20.748 6.00736 19.7407 5 18.498 5H15.999V4.25C15.999 3.00736 14.9917 2 13.749 2H10.249ZM14.499 5V4.25C14.499 3.83579 14.1632 3.5 13.749 3.5H10.249C9.83481 3.5 9.49902 3.83579 9.49902 4.25V5H14.499ZM5.5 6.5C5.08579 6.5 4.75 6.83579 4.75 7.25C4.75 7.66421 5.08579 8 5.5 8H18.498C18.9123 8 19.248 7.66421 19.248 7.25C19.248 6.83579 18.9123 6.5 18.498 6.5H5.5ZM6.42037 9.5H17.5777L16.96 19.7949C16.9362 20.191 16.6081 20.5 16.2113 20.5H7.78672C7.38995 20.5 7.06183 20.191 7.03807 19.7949L6.42037 9.5Z" fill="#ffffff" />
                </svg>

            </div>
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
                            disabled={!edit}
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
                        <Form.Label className='text-light'>Teléfono</Form.Label>
                        <Form.Control type="text" placeholder="Teléfono"
                            id="phone"
                            value={phone}
                            disabled={!edit}
                            onChange={(e) => setPhone(e.target.value)}
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
                            disabled={!edit}
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
                            disabled={!edit}
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
                            disabled={!edit}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </Form.Group>
                </Row>
                <Row className='mb-3'>
                    {edit && <Form.Group as={Col} className="d-flex justify-content-center mt-3">
                        <div className='d-flex align-items-center justify-content-center w-25'>
                            <Button className="" variant="danger" onClick={resetForm}>
                                Cancelar
                            </Button>
                        </div>
                        {!loading ?
                            <div className='d-flex align-items-center justify-content-center w-25'>
                                <Button className="" variant="primary" type="submit">
                                    Guardar
                                </Button>
                            </div> :
                            <div className='d-flex align-items-center justify-content-center w-25'>
                                <Spinner variant="light" />
                            </div>}
                    </Form.Group>}
                </Row>
            </Form>
        </div> :
        <DeleteAppointment id={id} updateEvents={updateEvents}></DeleteAppointment>
    )
}

export default EditAppointment