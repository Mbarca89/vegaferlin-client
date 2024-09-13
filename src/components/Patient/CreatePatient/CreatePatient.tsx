import { useEffect, useRef, useState } from "react";
import type { patient, userData } from "../../../types"
import { useFormik } from "formik";
import { axiosWithToken } from "../../../utils/axiosInstances";
import { notifyError, notifySuccess } from "../../Toaster/Toaster";
import handleError from "../../../utils/HandleErrors";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { useRecoilState } from "recoil";
import { formState } from "../../../app/store";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface createPatientProps {
    updateList: () => void
}

const CreatePatient: React.FC<createPatientProps> = ({ updateList }) => {

    const [loading, setLoading] = useState<boolean>(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const [image, setImage] = useState<File | null>(null);
    const [dirtyForm, setDirtyForm] = useRecoilState(formState)
    setDirtyForm(true)

    const validate = (values: patient): patient => {
        const errors: any = {};

        if (!values.inChargeOf) {
            errors.inChargeOf = '1';
        }

        if (!values.name) {
            errors.name = '1';
        }

        if (!values.surname) {
            errors.surname = '1';
        }
        if (!values.docType) {
            errors.docType = '1';
        }
        if (!values.doc) {
            errors.doc = '1';
        }
        if (!values.gender) {
            errors.gender = '1';
        }
        if (!values.birth) {
            errors.birth = '1';
        }
        if (!values.nationality) {
            errors.nationality = '1';
        }
        if (!values.civilState) {
            errors.civilState = '1';
        }
        if (!values.country) {
            errors.country = '1';
        }
        if (!values.state) {
            errors.state = '1';
        }
        if (!values.city) {
            errors.city = '1';
        }
        if (!values.address) {
            errors.address = '1';
        }
        return errors;
    };

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

    const formik = useFormik({
        initialValues: {
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
        },
        validate,
        onSubmit: async values => {
            setLoading(true)
            const createPatient = {
                inChargeOf: values.inChargeOf,
                inChargeOfId: values.inChargeOfId,
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
                const res = await axiosWithToken.post(`${SERVER_URL}/api/patients/create`, formData)
                notifySuccess(res.data)
                setDirtyForm(false)
                updateList()
            } catch (error: any) {
                handleError(error)
            } finally {
                setLoading(false)
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
        updateList()
    }



    useEffect(() => {
        if(formik.isSubmitting && Object.keys(formik.errors).length) notifyError("Ingrese los datos marcados con *")
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[formik.isSubmitting])

    return (
        <div className='container d-flex flex-column bg-dark-800'>
            <Form onSubmit={formik.handleSubmit} noValidate data-bs-theme="dark">
                <h2 className="mb-5 text-light">Alta paciente</h2>
                <Row className="bg-dark-700 mb-3 rounded">
                    <Form.Group className="mb-3">
                        <Form.Label className='text-light'>Profesional a cargo *</Form.Label>
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
                <Row className="gap-1">
                    <Col xs={12} md={6} className="bg-dark-700 rounded">
                        <Row>

                            <h3 className="text-light text-start">Datos Personales</h3>
                            <hr />
                            <Form.Group>
                                <Form.Label className="text-light">Foto de perfil</Form.Label>
                                <Form.Control type="file"
                                    id="image"
                                    name="image"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    ref={inputRef}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className='text-light'>Nombre *</Form.Label>
                                <Form.Control type="text" placeholder="Nombre"
                                    id="name"
                                    name="name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={!!(formik.touched.name && formik.errors.name)}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className='text-light'>Apellido *</Form.Label>
                                <Form.Control type="text" placeholder="Apellido"
                                    id="surname"
                                    name="surname"
                                    value={formik.values.surname}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={!!(formik.touched.surname && formik.errors.surname)}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className='text-light'>Tipo de Documento *</Form.Label>
                                <Form.Select
                                    id="docType"
                                    name="docType"
                                    value={formik.values.docType}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={!!(formik.touched.docType && formik.errors.docType)}
                                >
                                    <option value="">Seleccionar...</option>
                                    <option value="DNI">DNI</option>
                                    <option value="Pasaporte">Pasaporte</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className='text-light'>Número de documento *</Form.Label>
                                <Form.Control type="number" placeholder="Número de documento"
                                    id="doc"
                                    name="doc"
                                    value={formik.values.doc}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={!!(formik.touched.doc && formik.errors.doc)}
                                />
                            </Form.Group>
                            <Form.Group >
                                <Form.Label className='text-light'>Sexo *</Form.Label>
                                <Form.Select
                                    id="gender"
                                    name="gender"
                                    value={formik.values.gender}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={!!(formik.touched.gender && formik.errors.gender)}
                                >
                                    <option value="">Seleccionar...</option>
                                    <option value="Femenino">Femenino</option>
                                    <option value="Masculino">Masculino</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group >
                                <Form.Label className='text-light'>Fecha de Nacimiento *</Form.Label>
                                <Form.Control type="date"
                                    id="birth"
                                    name="birth"
                                    value={formik.values.birth}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={!!(formik.touched.birth && formik.errors.birth)}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className='text-light'>Nacionalidad *</Form.Label>
                                <Form.Control type="text" placeholder="Nacionalidad"
                                    id="nationality"
                                    name="nationality"
                                    value={formik.values.nationality}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={!!(formik.touched.nationality && formik.errors.nationality)}
                                />
                            </Form.Group>
                            <Form.Group >
                                <Form.Label className='text-light'>Estado civil *</Form.Label>
                                <Form.Select
                                    id="civilState"
                                    name="civilState"
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
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className='text-light'>País *</Form.Label>
                                <Form.Control type="text" placeholder="País "
                                    id="country"
                                    name="country"
                                    value={formik.values.country}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={!!(formik.touched.country && formik.errors.country)}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className='text-light'>Provincia *</Form.Label>
                                <Form.Control type="text" placeholder="Provincia"
                                    id="state"
                                    name="state"
                                    value={formik.values.state}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={!!(formik.touched.state && formik.errors.state)}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className='text-light'>Ciudad *</Form.Label>
                                <Form.Control type="text" placeholder="Ciudad"
                                    id="city"
                                    name="city"
                                    value={formik.values.city}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={!!(formik.touched.city && formik.errors.city)}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className='text-light'>Domicilio *</Form.Label>
                                <Form.Control type="text" placeholder="Domicilio"
                                    id="address"
                                    name="address"
                                    value={formik.values.address}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={!!(formik.touched.address && formik.errors.address)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label className='text-light'>Derivado por</Form.Label>
                                <Form.Control type="text" placeholder="Derivado por"
                                    id="derivedBy"
                                    name="derivedBy"
                                    value={formik.values.derivedBy}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={!!(formik.touched.derivedBy && formik.errors.derivedBy)}
                                />
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
                                    value={formik.values.phone}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={!!(formik.touched.phone && formik.errors.phone)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label className='text-light'>Email</Form.Label>
                                <Form.Control type="text" placeholder="Email"
                                    id="email"
                                    name="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={!!(formik.touched.email && formik.errors.email)}
                                />
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
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className='text-light'>Domicilio laboral</Form.Label>
                                <Form.Control type="text" placeholder="Domicilio laboral"
                                    id="workAddress"
                                    name="workAddress"
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
                            value={formik.values.observations}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </Form.Group>
                </Row>
                <Row className='mb-3'>
                    <Form.Group as={Col} className="d-flex justify-content-center mt-3">
                        <div className='d-flex align-items-center justify-content-center w-25'>
                            <Button className="" variant="danger" onClick={resetForm}>
                                Cancelar
                            </Button>
                        </div>
                        {!loading ?
                            <div className='d-flex align-items-center justify-content-center w-25'>
                                <Button className="" variant="primary" type="submit">
                                    Confirmar
                                </Button>
                            </div> :
                            <div className='d-flex align-items-center justify-content-center w-25'>
                                <Spinner />
                            </div>}
                    </Form.Group>
                </Row>
            </Form>
        </div>
    )
}

export default CreatePatient