import { Col, Form, Row, Spinner } from "react-bootstrap";
import type { patient } from "../../../types"
import { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { notifyError, notifySuccess } from "../../Toaster/Toaster";
import handleError from "../../../utils/HandleErrors";
import { axiosWithToken } from "../../../utils/axiosInstances";
import { useRecoilState } from "recoil";
import { formState, userState } from "../../../app/store";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface PatientPersonalInfoProps {
    patientId: number
    inChargeOfId: number
}

const PatientPersonalInfo: React.FC<PatientPersonalInfoProps> = ({ patientId, inChargeOfId }) => {
    const [image, setImage] = useState<File | null>(null);
    const [edit, setEdit] = useState<boolean>(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [uploading, setUploading] = useState<boolean>(false)
    const [user, setUser] = useRecoilState(userState)
    const [dirtyForm, setDirtyForm] = useRecoilState(formState)
    const [patient, setPatient] = useState<patient>({
        id: 0,
        image: "",
        inChargeOf: "",
        inChargeOfId: 0,
        name: "",
        surname: "",
        docType: "",
        doc: undefined,
        gender: "",
        birth: "",
        nationality: "",
        civilState: "",
        country: "",
        state: "",
        city: "",
        address: "",
        derivedBy: "",
        phone: undefined,
        email: "",
        occupation: "",
        studies: "",
        workAddress: "",
        workingHours: "",
        social: "",
        socialNumber: undefined,
        observations: "",
    })

    const getPatient = async () => {
        setLoading(true)
        try {
            const res = await axiosWithToken.get(`${SERVER_URL}/api/patients/getById?patientId=${patientId}`)
            if (res.data) {
                setPatient(res.data)
            }
        } catch (error) {
            handleError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (patientId) getPatient()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [patientId])

    const validate = (values: patient): patient => {
        const errors: any = {};

        if (!values.name.trim()) {
            errors.name = 'Ingrese el nombre';
        }

        if (!values.surname.trim()) {
            errors.surname = 'Ingrese el apellido';
        }
        return errors;
    };

    const formik = useFormik({
        initialValues: {
            id: patient.id,
            image: patient.image,
            inChargeOf: patient.inChargeOf,
            inChargeOfId: patient.inChargeOfId,
            name: patient.name,
            surname: patient.surname,
            docType: patient.docType,
            doc: patient.doc,
            gender: patient.gender,
            birth: patient.birth,
            nationality: patient.nationality,
            civilState: patient.civilState,
            country: patient.country,
            state: patient.state,
            city: patient.city,
            address: patient.address,
            derivedBy: patient.derivedBy,
            phone: patient.phone,
            email: patient.email,
            occupation: patient.occupation,
            studies: patient.studies,
            workAddress: patient.workAddress,
            workingHours: patient.workingHours,
            social: patient.social,
            socialNumber: patient.socialNumber,
            observations: patient.observations,
        },
        validate,
        enableReinitialize: true,
        onSubmit: async values => {
            setUploading(true)
            const createPatient = {
                id: patientId,
                inChargeOf: values.inChargeOf,
                name: values.name,
                surname: values.surname,
                docType: values.docType,
                doc: values.doc,
                gender: values.gender,
                birth: values.birth,
                nationality: values.nationality,
                civilState: values.civilState,
                country: values.country,
                state: values.state,
                city: values.city,
                address: values.address,
                derivedBy: values.derivedBy,
                phone: values.phone,
                email: values.email,
                occupation: values.occupation,
                studies: values.studies,
                workAddress: values.workAddress,
                workingHours: values.workingHours,
                social: values.social,
                socialNumber: values.socialNumber,
                observations: values.observations,
            }
            const formData = new FormData();
            if (image) formData.append('file', image);
            formData.append('patient', JSON.stringify(createPatient));

            try {
                const res = await axiosWithToken.put(`${SERVER_URL}/api/patients/update`, formData)
                notifySuccess(res.data)
                setDirtyForm(false)
            } catch (error: any) {
                handleError(error)
            } finally {
                setUploading(false)
                setEdit(false)
            }
        },
    });

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setImage(event.target.files[0]);
        }
    };

    const resetForm = () => {
        formik.resetForm();
        setDirtyForm(false)
        setUploading(false)
        setEdit(false)
    }

    const handleEdit = (allowed: boolean) => {
        if (!allowed) notifyError("Solo el profesional a cargo puede editar.")
        else {
            setDirtyForm(true)
            setEdit(!edit)
        }
    }

    return (
        !loading ? <div className="position-relative d-flex flex-column justify-content-center align-items-center">
            <div className="d-flex container position-fixed justify-content-end bottom-0 pe-4 pb-1">
                {inChargeOfId == user.id ?
                    edit ?
                        <div className="rounded-pill bg-dark p-1">
                            {!uploading ? <>
                                <svg onClick={() => formik.handleSubmit()} role="button" width="45" height="45" viewBox="0 0 512 512" style={{ color: "#7CC504" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full me-3"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 15 15" fill="#7CC504" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#7CC504"><path fill="none" stroke="currentColor" d="M4 7.5L7 10l4-5m-3.5 9.5a7 7 0 1 1 0-14a7 7 0 0 1 0 14Z" /></g></svg></svg>
                                <svg onClick={resetForm} role="button" width="45" height="45" viewBox="0 0 512 512" style={{ color: "#E8403E" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 36 36" fill="#E8403E" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#E8403E"><path fill="currentColor" d="M18 2a16 16 0 1 0 16 16A16 16 0 0 0 18 2ZM4 18a13.93 13.93 0 0 1 3.43-9.15l19.72 19.72A14 14 0 0 1 4 18Zm24.57 9.15L8.85 7.43a14 14 0 0 1 19.72 19.72Z" className="clr-i-outline clr-i-outline-path-1" /><path fill="none" d="M0 0h36v36H0z" /></g></svg></svg>
                            </>
                                : <Spinner variant="light" />}
                        </div>
                        :
                        <div className="rounded-circle bg-dark p-1">
                            <svg onClick={() => handleEdit(true)} role="button" width="45" height="45" viewBox="0 0 512 512" style={{ color: "#ffffff" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full cursor-pointer"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 1024 1024" fill="#D040EE" x="0" y="0" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#D040EE"><path fill="currentColor" d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 0 0 0-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 0 0 9.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3l-362.7 362.6l-88.9 15.7l15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z" /></g></svg></svg>
                        </div>
                    :
                    <div className="rounded-circle bg-dark p-1">
                        <svg onClick={() => handleEdit(false)} role="button" width="45" height="45" viewBox="0 0 512 512" style={{ color: "#ffffff" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 32 32" fill="#ffffff" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#ffffff"><path fill="currentColor" d="M30 28.6L3.4 2L2 3.4l10.1 10.1L4 21.6V28h6.4l8.1-8.1L28.6 30l1.4-1.4zM9.6 26H6v-3.6l7.5-7.5l3.6 3.6L9.6 26zM29.4 6.2l-3.6-3.6c-.8-.8-2-.8-2.8 0l-8 8l1.4 1.4L20 8.4l3.6 3.6l-3.6 3.6l1.4 1.4l8-8c.8-.8.8-2 0-2.8zM25 10.6L21.4 7l3-3L28 7.6l-3 3z" /></g></svg></svg>
                    </div>}
            </div>
            <Form onSubmit={formik.handleSubmit} noValidate className="text-start" data-bs-theme="dark">
                <Row className="gap-1">
                    <Col xs={12} md={6} className="bg-dark-700 rounded">
                        <Row>
                            <h3 className="text-light text-start">Datos Personales</h3>
                            <hr />
                            <Form.Group>
                                <Form.Label className="text-light">Cambiar foto de perfil</Form.Label>
                                <Form.Control type="file"
                                    id="image"
                                    name="image"
                                    disabled={!edit}
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    ref={inputRef}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className='text-light'>Nombre</Form.Label>
                                <Form.Control type="text" placeholder="Nombre"
                                    id="name"
                                    name="name"
                                    disabled={!edit}
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={!!(formik.touched.name && formik.errors.name)}
                                />
                                <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className='text-light'>Apellido</Form.Label>
                                <Form.Control type="text" placeholder="Apellido"
                                    id="surname"
                                    name="surname"
                                    disabled={!edit}
                                    value={formik.values.surname}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={!!(formik.touched.surname && formik.errors.surname)}
                                />
                                <Form.Control.Feedback type="invalid">{formik.errors.surname}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className='text-light'>Tipo de Documento</Form.Label>
                                <Form.Control type="text" placeholder="Tipo Documento"
                                    id="docType"
                                    name="docType"
                                    disabled={!edit}
                                    value={formik.values.docType}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={!!(formik.touched.docType && formik.errors.docType)}
                                />
                                <Form.Control.Feedback type="invalid">{formik.errors.docType}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className='text-light'>Número de documento</Form.Label>
                                <Form.Control type="number" placeholder="Número de documento"
                                    id="doc"
                                    name="doc"
                                    disabled={!edit}
                                    value={formik.values.doc}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={!!(formik.touched.doc && formik.errors.doc)}
                                />
                                <Form.Control.Feedback type="invalid">{formik.errors.doc}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group >
                                <Form.Label className='text-light'>Sexo</Form.Label>
                                <Form.Select
                                    id="gender"
                                    name="gender"
                                    disabled={!edit}
                                    value={formik.values.gender}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={!!(formik.touched.gender && formik.errors.gender)}
                                >
                                    <option value="">Seleccionar...</option>
                                    <option value="Femenino">Femenino</option>
                                    <option value="Masculino">Masculino</option>
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">{formik.errors.gender}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group >
                                <Form.Label className='text-light'>Fecha de Nacimiento</Form.Label>
                                <Form.Control type="date"
                                    id="birth"
                                    name="birth"
                                    disabled={!edit}
                                    value={formik.values.birth}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className='text-light'>Nacionalidad</Form.Label>
                                <Form.Control type="text" placeholder="Nacionalidad"
                                    id="nationality"
                                    name="nationality"
                                    disabled={!edit}
                                    value={formik.values.nationality}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={!!(formik.touched.nationality && formik.errors.nationality)}
                                />
                                <Form.Control.Feedback type="invalid">{formik.errors.nationality}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group >
                                <Form.Label className='text-light'>Estado civil</Form.Label>
                                <Form.Select
                                    id="civilState"
                                    name="civilState"
                                    disabled={!edit}
                                    value={formik.values.civilState}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={!!(formik.touched.civilState && formik.errors.civilState)}
                                >
                                    <option value="">Seleccionar...</option>
                                    <option value="Casado">Casado</option>
                                    <option value="Divorciado">Divorciado</option>
                                    <option value="Soltero">Soltero</option>
                                    <option value="Viudo">Viudo</option>
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">{formik.errors.civilState}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className='text-light'>País</Form.Label>
                                <Form.Control type="text" placeholder="País "
                                    id="country"
                                    name="country"
                                    disabled={!edit}
                                    value={formik.values.country}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={!!(formik.touched.country && formik.errors.country)}
                                />
                                <Form.Control.Feedback type="invalid">{formik.errors.country}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className='text-light'>Provincia</Form.Label>
                                <Form.Control type="text" placeholder="Provincia"
                                    id="state"
                                    name="state"
                                    disabled={!edit}
                                    value={formik.values.state}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={!!(formik.touched.state && formik.errors.state)}
                                />
                                <Form.Control.Feedback type="invalid">{formik.errors.state}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className='text-light'>Ciudad</Form.Label>
                                <Form.Control type="text" placeholder="Ciudad"
                                    id="city"
                                    name="city"
                                    disabled={!edit}
                                    value={formik.values.city}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={!!(formik.touched.city && formik.errors.city)}
                                />
                                <Form.Control.Feedback type="invalid">{formik.errors.city}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className='text-light'>Domicilio</Form.Label>
                                <Form.Control type="text" placeholder="Domicilio"
                                    id="address"
                                    name="address"
                                    disabled={!edit}
                                    value={formik.values.address}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={!!(formik.touched.address && formik.errors.address)}
                                />
                                <Form.Control.Feedback type="invalid">{formik.errors.address}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label className='text-light'>Derivado por</Form.Label>
                                <Form.Control type="text" placeholder="Derivado por"
                                    id="derivedBy"
                                    name="derivedBy"
                                    disabled={!edit}
                                    value={formik.values.derivedBy}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={!!(formik.touched.derivedBy && formik.errors.derivedBy)}
                                />
                                <Form.Control.Feedback type="invalid">{formik.errors.derivedBy}</Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                    </Col>
                    <Col className="">
                        <Row className="mb-1 bg-dark-700 rounded ">
                            <h3 className="text-light text-start">Contacto</h3>
                            <hr />
                            <Form.Group>
                                <Form.Label className='text-light'>Teléfono</Form.Label>
                                <Form.Control type="number" placeholder="Teléfono"
                                    id="phone"
                                    name="phone"
                                    disabled={!edit}
                                    value={formik.values.phone}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={!!(formik.touched.phone && formik.errors.phone)}
                                />
                                <Form.Control.Feedback type="invalid">{formik.errors.phone}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label className='text-light'>Email</Form.Label>
                                <Form.Control type="text" placeholder="Email"
                                    id="email"
                                    name="email"
                                    disabled={!edit}
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={!!(formik.touched.email && formik.errors.email)}
                                />
                                <Form.Control.Feedback type="invalid">{formik.errors.email}</Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <Row className="bg-dark-700 rounded mb-1">
                            <h3 className='text-light text-start'>Ocupación</h3>
                            <hr />
                            <Form.Group>
                                <Form.Label className='text-light'>Ocupación</Form.Label>
                                <Form.Control type="text" placeholder="Ocupación"
                                    id="occupation"
                                    name="occupation"
                                    disabled={!edit}
                                    value={formik.values.occupation}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className="text-light">Educación</Form.Label>
                                <Form.Select
                                    id="studies"
                                    name="studies"
                                    disabled={!edit}
                                    value={formik.values.studies}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={!!(formik.touched.studies && formik.errors.studies)}
                                >
                                    <option value="">Seleccionar...</option>
                                    <option value="Primario">Primario</option>
                                    <option value="Secundario incompleto">Secundario incompleto</option>
                                    <option value="Secundario completo">Secundario completo</option>
                                    <option value="Terciario">Terciario</option>
                                    <option value="Universitario incompleto">Universitario incompleto</option>
                                    <option value="Universitario completo">Universitario completo</option>
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">{formik.errors.studies}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className='text-light'>Domicilio laboral</Form.Label>
                                <Form.Control type="text" placeholder="Domicilio laboral"
                                    id="workAddress"
                                    name="workAddress"
                                    disabled={!edit}
                                    value={formik.values.workAddress}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label className='text-light'>Horario laboral</Form.Label>
                                <Form.Control type="text" placeholder="Horario laboral"
                                    id="workingHours"
                                    name="workingHours"
                                    disabled={!edit}
                                    value={formik.values.workingHours}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Form.Group>
                        </Row>
                        <Row className="bg-dark-700 rounded">
                            <h3 className='text-light text-start'>Obra social</h3>
                            <hr />
                            <Form.Group>
                                <Form.Label className='text-light'>Obra social</Form.Label>
                                <Form.Control type="text" placeholder="Obra social"
                                    id="social"
                                    name="social"
                                    disabled={!edit}
                                    value={formik.values.social}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label className='text-light'>Número de afiliado</Form.Label>
                                <Form.Control type="text" placeholder="Número de afiliado"
                                    id="socialNumber"
                                    name="socialNumber"
                                    disabled={!edit}
                                    value={formik.values.socialNumber}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Form.Group>
                        </Row>
                    </Col>
                </Row>
                <Row className="bg-dark-700 mt-3 rounded">
                    <Form.Group className="mb-3">
                        <Form.Label className='text-light'>Observaciones</Form.Label>
                        <Form.Control type="text" placeholder="Observaciones"
                            as={"textarea"}
                            id="observations"
                            name="observations"
                            disabled={!edit}
                            value={formik.values.observations}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </Form.Group>
                </Row>
            </Form>
        </div> : <Spinner />
    )
}

export default PatientPersonalInfo