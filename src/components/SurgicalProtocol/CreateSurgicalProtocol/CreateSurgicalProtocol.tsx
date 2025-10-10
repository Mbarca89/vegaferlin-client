import { useState } from "react";
import type { SurgicalProtocol, SurgicalInfo } from "../../../types";
import { notifySuccess } from "../../Toaster/Toaster";
import handleError from "../../../utils/HandleErrors";
import { axiosWithToken } from "../../../utils/axiosInstances";
import { useFormik } from "formik";
import { Accordion, Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { useRecoilState } from "recoil";
import { formState, modalState } from "../../../app/store";
import CustomModal from "../../Modal/CustomModal";
import AddCompensator from "../AddCompensator/AddCompensator";
import Addimplant from "../AddImplant/AddImplant";
import AddMaterial from "../AddMaterial/AddMaterial";
import EditCompensator from "../EditCompensator/EditCompensator";
import EditImplant from "../EditImplant/EditImplant";
import EditMaterial from "../EditMaterial/EditMaterial";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface CreateSurgicalProtocolProps {
    patientId: number
    cancel: () => void
    updateList: () => void
}

const CreateSurgicalProtocol: React.FC<CreateSurgicalProtocolProps> = ({ patientId, updateList, cancel }) => {

    const [loading, setLoading] = useState<boolean>(false)
    const [show, setShow] = useRecoilState(modalState)
    const [dirtyForm, setDirtyForm] = useRecoilState(formState)
    const [modal, setModal] = useState<string>("")
    const [currentIndex, setCurrentIndex] = useState<number>(0)

    const validate = (values: SurgicalProtocol): SurgicalProtocol => {
        const errors: any = {};

        if (!values.date) errors.date = 'Ingrese la fecha';

        if (!values.startTime) errors.startTime = 'Ingrese la hora de inicio';

        if (!values.endTime) errors.endTime = 'Ingrese la hora de finalización';

        return errors;
    };

    const formik = useFormik<SurgicalProtocol>({
        initialValues: {
            id: 0,
            date: "",
            firstAssistant: "",
            secondAssistant: "",
            startTime: "",
            endTime: "",
            preMed: "",
            postMed: "",
            surgeryType: "",
            topMaxillary: false,
            jaw: false,
            topMaxillaryInfo: {
                zone: "",
                anaesthesia: "",
                incisionFrom: undefined,
                incisionTo: undefined,
                disposition: "",
                extension: false,
                compensators: [],
                implants: [],
                regenerationObjective: "",
                elevationMethod: "",
                regenerationFrom: undefined,
                regenerationTo: undefined,
                membrane: false,
                materials: [],
                sutureMaterial: "",
                technique: ""
            },
            jawInfo: {
                zone: "",
                anaesthesia: "",
                incisionFrom: undefined,
                incisionTo: undefined,
                disposition: "",
                extension: false,
                compensators: [],
                implants: [],
                regenerationObjective: "",
                elevationMethod: "",
                regenerationFrom: undefined,
                regenerationTo: undefined,
                membrane: false,
                materials: [],
                sutureMaterial: "",
                technique: ""
            },
            inChargeOfId: 0
        },
        validate,
        onSubmit: async values => {
            setLoading(true)
            const createSurgicalProtocol = {
                patientId: patientId,
                ...values
            }
            try {
                const res = await axiosWithToken.post(`${SERVER_URL}/api/surgicalProtocol/create`, createSurgicalProtocol)
                notifySuccess(res.data)
                updateList()
                setDirtyForm(false)
                cancel()
            } catch (error: any) {
                handleError(error)
            } finally {
                setLoading(false)
                setShow(false)
            }
        },
    });

    const renderTextField = (id: keyof SurgicalProtocol, label: string) => (
        <Form.Group as={Col} xs={12} lg={6}>
            <Form.Label className='text-light'>{label}</Form.Label>
            <Form.Control
                id={id}
                name={id}
                value={formik.values[id] as string}
                onChange={(e) => {
                    setDirtyForm(true)
                    formik.handleChange(e)
                }}
                isInvalid={!!(formik.touched[id] && formik.errors[id])}
                onBlur={formik.handleBlur}
            />
            <Form.Control.Feedback type="invalid">{formik.errors[id]?.toString()}</Form.Control.Feedback>
        </Form.Group>
    );
    const renderTopInfoTextField = (id: keyof SurgicalInfo, label: string) => (
        <Form.Group as={Col} xs={12} lg={6}>
            <Form.Label className='text-light'>{label}</Form.Label>
            <Form.Control
                id={`topMaxillaryInfo.${id}`}
                name={`topMaxillaryInfo.${id}`}
                value={formik.values.topMaxillaryInfo[id] as string}
                onChange={(e) => {
                    setDirtyForm(true)
                    formik.handleChange(e)
                }}
                onBlur={formik.handleBlur}
                disabled={!formik.values.topMaxillary}
                isInvalid={formik.errors.topMaxillaryInfo && !!formik.errors.topMaxillaryInfo[id]}
            />
            {formik.errors.topMaxillaryInfo && <Form.Control.Feedback type="invalid">{formik.errors.topMaxillaryInfo[id]?.toString()}</Form.Control.Feedback>}
        </Form.Group>
    );
    const renderJawInfoTextField = (id: keyof SurgicalInfo, label: string) => (
        <Form.Group as={Col} xs={12} lg={6}>
            <Form.Label className='text-light'>{label}</Form.Label>
            <Form.Control
                id={`jawInfo.${id}`}
                name={`jawInfo.${id}`}
                value={formik.values.jawInfo[id] as string}
                onChange={(e) => {
                    setDirtyForm(true)
                    formik.handleChange(e)
                }}
                onBlur={formik.handleBlur}
                disabled={!formik.values.jaw}
                isInvalid={formik.errors.jawInfo && !!formik.errors.jawInfo[id]}
            />
            {formik.errors.jawInfo && <Form.Control.Feedback type="invalid">{formik.errors.jawInfo[id]?.toString()}</Form.Control.Feedback>}
        </Form.Group>
    );

    const handleCompensator = (zone: string) => {
        zone === "top" ? setModal("topCompensator") : setModal("jawCompensator")
        setShow(true)
    }

    const handleImplant = (zone: string) => {
        zone === "top" ? setModal("topImplant") : setModal("jawImplant")
        setShow(true)
    }

    const handleMaterial = (zone: string) => {
        zone === "top" ? setModal("topMaterial") : setModal("jawMaterial")
        setShow(true)
    }


    const handleEditCompensator = (index: number, zone: string) => {
        zone === "top" ? setModal("editTopCompensator") : setModal("editJawCompensator")
        setCurrentIndex(index)
        setShow(true)
    }

    const handleDeleteCompensator = (index: number, zone: string) => {
        if (zone === "top") {
            const newCompensators = [...formik.values.topMaxillaryInfo.compensators];
            newCompensators.splice(index, 1);
            formik.setFieldValue("topMaxillaryInfo.compensators", newCompensators);
        } else {
            const newCompensators = [...formik.values.jawInfo.compensators];
            newCompensators.splice(index, 1);
            formik.setFieldValue("jawInfo.compensators", newCompensators);
        }
    };

    const handleEditImplant = (index: number, zone: string) => {
        zone === "top" ? setModal("editTopImplant") : setModal("editJawImplant")
        setCurrentIndex(index)
        setShow(true)
    }

    const handleDeleteImplant = (index: number, zone: string) => {
        if (zone === "top") {
            const newImplants = [...formik.values.topMaxillaryInfo.implants];
            newImplants.splice(index, 1);
            formik.setFieldValue("topMaxillaryInfo.implants", newImplants);
        } else {
            const newImplants = [...formik.values.jawInfo.implants];
            newImplants.splice(index, 1);
            formik.setFieldValue("jawInfo.implants", newImplants);
        }
    };

    const handleEditMaterial = (index: number, zone: string) => {
        zone === "top" ? setModal("editTopMaterial") : setModal("editJawMaterial")
        setCurrentIndex(index)
        setShow(true)
    }

    const handleDeleteMaterial = (index: number, zone: string) => {
        if (zone === "top") {
            const newMaterials = [...formik.values.topMaxillaryInfo.materials];
            newMaterials.splice(index, 1);
            formik.setFieldValue("topMaxillaryInfo.materials", newMaterials);
        } else {
            const newMaterials = [...formik.values.jawInfo.materials];
            newMaterials.splice(index, 1);
            formik.setFieldValue("jawInfo.materials", newMaterials);
        }
    };

    const resetForm = () => {
        formik.resetForm();
        cancel()
        setDirtyForm(false)
    }

    return (
        <div className="w-100">
            <Form onSubmit={formik.handleSubmit} noValidate data-bs-theme="dark" className="text-start">
                <Row className="mb-2">
                    <Form.Group className='text-light' as={Col} xs={12} lg={6}>
                        <Form.Label >Fecha</Form.Label>
                        <Form.Control type="date"
                            id="date"
                            name="date"
                            value={formik.values.date}
                            onChange={(e) => {
                                setDirtyForm(true)
                                formik.handleChange(e)
                            }}
                            onBlur={formik.handleBlur}
                            isInvalid={!!(formik.touched.date && formik.errors.date)}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.date}</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row>
                    {renderTextField('firstAssistant', "Primer asistente")}
                </Row>
                <Row>
                    {renderTextField('secondAssistant', 'Segundo asistente')}
                </Row>
                <Row>
                    <Form.Group as={Col} xs={12} lg={6}>
                        <Form.Label className='text-light'>Hora de inicio</Form.Label>
                        <Form.Control type="time"
                            placeholder="Hora de inicio"
                            id="startTime"
                            name="startTime"
                            value={formik.values.startTime}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={!!(formik.touched.startTime && formik.errors.startTime)}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.startTime}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} xs={12} lg={6}>
                        <Form.Label className='text-light'>Hora de finalización</Form.Label>
                        <Form.Control type="time"
                            placeholder="Hora de finalización"
                            id="endTime"
                            name="endTime"
                            value={formik.values.endTime}
                            onChange={(e) => {
                                setDirtyForm(true)
                                formik.handleChange(e)
                            }}
                            onBlur={formik.handleBlur}
                            isInvalid={!!(formik.touched.endTime && formik.errors.endTime)}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.endTime}</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row >
                    {renderTextField('preMed', 'Medicación previa')}
                </Row>
                <Row>
                    {renderTextField('postMed', 'Medicación posterior')}
                </Row>
                <Row className="mb-3">
                    {renderTextField('surgeryType', 'Tipo de cirugía')}
                </Row>
                <Row className="mb-3">
                    <Accordion className="">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Maxiliar superior</Accordion.Header>
                            <Accordion.Body>
                                <Form.Check
                                    type="switch"
                                    id="topMaxillary"
                                    value={formik.values.topMaxillary ? "true" : "false"}
                                    onChange={e => {
                                        formik.setFieldValue("topMaxillary", e.target.checked === true)
                                        if (e.target.checked === false) {
                                            formik.setFieldValue("topMaxillaryInfo", formik.initialValues.topMaxillaryInfo)
                                            formik.setFieldValue("topMaxillaryInfo.incisionFrom", "")
                                            formik.setFieldValue("topMaxillaryInfo.incisionTo", "")
                                        }

                                    }}
                                    onBlur={formik.handleBlur}
                                />
                                {renderTopInfoTextField('zone', 'Zona implantológica')}
                                {renderTopInfoTextField('anaesthesia', 'Anestesia')}
                                <Row>
                                    <Form.Label>Insición</Form.Label>
                                    <Form.Group as={Col} xs={12} lg={6}>
                                        <Form.Label className='text-light'>Desde pieza</Form.Label>
                                        <Form.Control type="number"
                                            id="topMaxillaryInfo.incisionFrom"
                                            name="topMaxillaryInfo.incisionFrom"
                                            value={formik.values.topMaxillaryInfo.incisionFrom}
                                            onChange={(e) => {
                                                setDirtyForm(true)
                                                formik.handleChange(e)
                                            }}
                                            onBlur={formik.handleBlur}
                                            disabled={!formik.values.topMaxillary}
                                            isInvalid={formik.errors.topMaxillaryInfo && !!formik.errors.topMaxillaryInfo.incisionFrom}
                                        />
                                        {formik.errors.topMaxillaryInfo && <Form.Control.Feedback type="invalid">{formik.errors.topMaxillaryInfo.incisionFrom}</Form.Control.Feedback>}
                                    </Form.Group>
                                    <Form.Group as={Col} xs={12} lg={6}>
                                        <Form.Label className='text-light'>Hasta pieza</Form.Label>
                                        <Form.Control type="number"
                                            id="topMaxillaryInfo.incisionTo"
                                            name="topMaxillaryInfo.incisionTo"
                                            value={formik.values.topMaxillaryInfo.incisionTo}
                                            onChange={(e) => {
                                                setDirtyForm(true)
                                                formik.handleChange(e)
                                            }}
                                            onBlur={formik.handleBlur}
                                            disabled={!formik.values.topMaxillary}
                                            isInvalid={formik.errors.topMaxillaryInfo && !!formik.errors.topMaxillaryInfo.incisionTo}
                                        />
                                        {formik.errors.topMaxillaryInfo && <Form.Control.Feedback type="invalid">{formik.errors.topMaxillaryInfo.incisionTo}</Form.Control.Feedback>}
                                    </Form.Group>
                                </Row>
                                <Row>
                                    <Form.Group as={Col} xs={12} lg={6}>
                                        <Form.Label className="text-light">Disposición</Form.Label>
                                        <Form.Select
                                            id="topMaxillaryInfo.disposition"
                                            name="topMaxillaryInfo.disposition"
                                            value={formik.values.topMaxillaryInfo.disposition}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            disabled={!formik.values.topMaxillary}
                                        >
                                            <option value="">Seleccionar...</option>
                                            <option value="Vestibularizada">Vestibularizada</option>
                                            <option value="Palitinizada">Palitinizada</option>
                                            <option value="Sobre reborde">Sobre reborde</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Row>
                                <Row className="mb-3">
                                    <Form.Group as={Col} xs={12} lg={6}>
                                        <Form.Label className='text-light'>Maniobras de extensión</Form.Label>
                                        <Form.Select
                                            id="topMaxillaryInfo.extension"
                                            name="topMaxillaryInfo.extension"
                                            value={formik.values.topMaxillaryInfo.extension ? "true" : "false"}
                                            onChange={e => formik.setFieldValue("topMaxillaryInfo.extension", e.target.value === 'true')}
                                            onBlur={formik.handleBlur}
                                            disabled={!formik.values.topMaxillary}
                                        >
                                            <option value="false">No</option>
                                            <option value="true">Sí</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Row>
                                <Accordion className="mb-3">
                                    <Accordion.Item eventKey={formik.values.topMaxillary ? "0" : ""}>
                                        <Accordion.Header className={!formik.values.topMaxillary ? "pe-none" : "pe-auto"}>Compensadoras</Accordion.Header>
                                        <Accordion.Body>
                                            <p role="button" onClick={() => handleCompensator("top")}>Agregar <svg width="25" height="25" viewBox="0 0 512 512" style={{ color: "#ffffff" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 24 24" fill="#632f6b" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#632f6b"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M12 20v-8m0 0V4m0 8h8m-8 0H4" /></g></svg></svg></p>
                                            <hr />
                                            {formik.values.topMaxillaryInfo.compensators?.map((compensator, index) => (
                                                <div className="container border rounded">
                                                    <div className="d-flex flex-row justify-content-between">
                                                        <p><b>Compensadora {index + 1}</b></p>
                                                        <div className="d-flex gap-2">
                                                            <svg onClick={() => handleEditCompensator(index, "top")} role="button" width="25" height="25" viewBox="0 0 512 512" style={{ color: "#ffffff" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full cursor-pointer"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 1024 1024" fill="#D040EE" x="0" y="0" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#D040EE"><path fill="currentColor" d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 0 0 0-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 0 0 9.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3l-362.7 362.6l-88.9 15.7l15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z" /></g></svg></svg>
                                                            <svg onClick={() => handleDeleteCompensator(index, "top")} role="button" width="25" height="25" viewBox="0 0 512 512" style={{ color: "#ffffff" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 24 24" fill="#632f6b" x="0" y="0" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#632f6b"><path fill="currentColor" d="M14.12 10.47L12 12.59l-2.13-2.12l-1.41 1.41L10.59 14l-2.12 2.12l1.41 1.41L12 15.41l2.12 2.12l1.41-1.41L13.41 14l2.12-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4zM6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9z" /></g></svg></svg>
                                                        </div>
                                                    </div>
                                                    <div >
                                                        <p><b>Ubicación:</b> {compensator.location}</p>
                                                        <p><b>Localización:</b> {compensator.localization}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                                <Accordion className="">
                                    <Accordion.Item eventKey="0">
                                        <Accordion.Header className={!formik.values.topMaxillary ? "pe-none" : "pe-auto"}>Implantes </Accordion.Header>
                                        <Accordion.Body>
                                            <p role="button" onClick={() => handleImplant("top")}>Agregar <svg width="25" height="25" viewBox="0 0 512 512" style={{ color: "#ffffff" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 24 24" fill="#632f6b" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#632f6b"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M12 20v-8m0 0V4m0 8h8m-8 0H4" /></g></svg></svg></p>
                                            <hr />
                                            {formik.values.topMaxillaryInfo.implants.map((implant, index) => (
                                                <div className="container border rounded">
                                                    <div className="d-flex flex-row justify-content-between">
                                                        <p><b>Implante {index + 1}</b></p>
                                                        <div className="d-flex gap-2">
                                                            <svg onClick={() => handleEditImplant(index, "top")} role="button" width="25" height="25" viewBox="0 0 512 512" style={{ color: "#ffffff" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full cursor-pointer"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 1024 1024" fill="#D040EE" x="0" y="0" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#D040EE"><path fill="currentColor" d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 0 0 0-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 0 0 9.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3l-362.7 362.6l-88.9 15.7l15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z" /></g></svg></svg>
                                                            <svg onClick={() => handleDeleteImplant(index, "top")} role="button" width="25" height="25" viewBox="0 0 512 512" style={{ color: "#ffffff" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 24 24" fill="#632f6b" x="0" y="0" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#632f6b"><path fill="currentColor" d="M14.12 10.47L12 12.59l-2.13-2.12l-1.41 1.41L10.59 14l-2.12 2.12l1.41 1.41L12 15.41l2.12 2.12l1.41-1.41L13.41 14l2.12-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4zM6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9z" /></g></svg></svg>
                                                        </div>
                                                    </div>
                                                    <div >
                                                        <p><b>Ubicación:</b> {implant.location}</p>
                                                        <p><b>Marca y modelo:</b> {implant.brand}</p>
                                                        <p><b>Conexión:</b> {implant.connection}</p>
                                                        <p><b>Plataforma:</b> {implant.platform}</p>
                                                        <p><b>Longitud:</b> {implant.length}</p>
                                                        <p><b>Diametro del implante:</b> {implant.diameter}</p>
                                                        <p><b>Torque de inserción:</b> {implant.torque}</p>
                                                        <p><b>Estabilidad iniciál:</b> {implant.stability ? "Si" : "No"}</p>
                                                        <p><b>Oportunidad de colocación:</b> {implant.placement}</p>
                                                        <p><b>Método de maniobra instrumental:</b> {implant.instrumentalMethod}</p>
                                                    </div>
                                                    <hr />
                                                </div>
                                            ))}
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                                <Row>
                                    {renderTopInfoTextField('regenerationObjective', 'Objetivo de regeneración ósea')}
                                </Row>
                                <Row>
                                    {renderTopInfoTextField('elevationMethod', 'Método de elevación de piso de seno')}
                                </Row>
                                <Row>
                                    <Form.Label>Extensión de regeneración</Form.Label>
                                    <Form.Group as={Col} xs={12} lg={6}>
                                        <Form.Label className='text-light'>Desde pieza</Form.Label>
                                        <Form.Control type="number"
                                            id="topMaxillaryInfo.regenerationFrom"
                                            name="topMaxillaryInfo.regenerationFrom"
                                            value={formik.values.topMaxillaryInfo.regenerationFrom}
                                            onChange={(e) => {
                                                setDirtyForm(true)
                                                formik.handleChange(e)
                                            }}
                                            onBlur={formik.handleBlur}
                                            disabled={!formik.values.topMaxillary}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} xs={12} lg={6}>
                                        <Form.Label className='text-light'>Hasta pieza</Form.Label>
                                        <Form.Control type="number"
                                            id="topMaxillaryInfo.regenerationTo"
                                            name="topMaxillaryInfo.regenerationTo"
                                            value={formik.values.topMaxillaryInfo.regenerationTo}
                                            onChange={(e) => {
                                                setDirtyForm(true)
                                                formik.handleChange(e)
                                            }}
                                            onBlur={formik.handleBlur}
                                            disabled={!formik.values.topMaxillary}
                                        />
                                    </Form.Group>
                                </Row>
                                <Row className="mb-3">
                                    <Form.Group as={Col} xs={12} lg={6}>
                                        <Form.Label className='text-light'>Colocación de membrana</Form.Label>
                                        <Form.Select
                                            id="topMaxillaryInfo.membrane"
                                            name="topMaxillaryInfo.membrane"
                                            value={formik.values.topMaxillaryInfo.membrane ? "true" : "false"}
                                            onChange={e => formik.setFieldValue("topMaxillaryInfo.membrane", e.target.value === 'true')}
                                            onBlur={formik.handleBlur}
                                            disabled={!formik.values.topMaxillary}
                                        >
                                            <option value="false">No</option>
                                            <option value="true">Sí</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Row>
                                <Accordion className="mb-3">
                                    <Accordion.Item eventKey={formik.values.topMaxillary ? "0" : ""}>
                                        <Accordion.Header className={!formik.values.topMaxillary ? "pe-none" : "pe-auto"}>Materiales de regeneración</Accordion.Header>
                                        <Accordion.Body>
                                            <p role="button" onClick={() => handleMaterial("top")}>Agregar <svg width="25" height="25" viewBox="0 0 512 512" style={{ color: "#ffffff" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 24 24" fill="#632f6b" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#632f6b"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M12 20v-8m0 0V4m0 8h8m-8 0H4" /></g></svg></svg></p>
                                            <hr />
                                            {formik.values.topMaxillaryInfo.materials?.map((material, index) => (
                                                <div className="container border rounded">
                                                    <div className="d-flex flex-row justify-content-between">
                                                        <p><b>Material {index + 1}</b></p>
                                                        <div className="d-flex gap-2">
                                                            <svg onClick={() => handleEditMaterial(index, "top")} role="button" width="25" height="25" viewBox="0 0 512 512" style={{ color: "#ffffff" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full cursor-pointer"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 1024 1024" fill="#D040EE" x="0" y="0" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#D040EE"><path fill="currentColor" d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 0 0 0-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 0 0 9.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3l-362.7 362.6l-88.9 15.7l15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z" /></g></svg></svg>
                                                            <svg onClick={() => handleDeleteMaterial(index, "top")} role="button" width="25" height="25" viewBox="0 0 512 512" style={{ color: "#ffffff" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 24 24" fill="#632f6b" x="0" y="0" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#632f6b"><path fill="currentColor" d="M14.12 10.47L12 12.59l-2.13-2.12l-1.41 1.41L10.59 14l-2.12 2.12l1.41 1.41L12 15.41l2.12 2.12l1.41-1.41L13.41 14l2.12-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4zM6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9z" /></g></svg></svg>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p><b>Injerto:</b> {material.grafting}</p>
                                                        <p><b>Zona dadora de autólogo:</b> {material.autologue}</p>
                                                    </div>
                                                    <hr />
                                                </div>
                                            ))}
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                                <Row >
                                    {renderTopInfoTextField('sutureMaterial', 'Material de sutura')}
                                </Row>
                                <Row className="mb-3">
                                    {renderTopInfoTextField('technique', 'Técnica de sutura')}
                                </Row>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>

                </Row>
                <Row>
                    <Accordion className="">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Mandíbula</Accordion.Header>
                            <Accordion.Body>
                                <Form.Check
                                    type="switch"
                                    id="jaw"
                                    value={formik.values.jaw ? "true" : "false"}
                                    onChange={e => {
                                        formik.setFieldValue("jaw", e.target.checked === true)
                                        if (e.target.checked === false) {
                                            formik.setFieldValue("jawInfo", formik.initialValues.jawInfo)
                                            formik.setFieldValue("jawInfo.incisionFrom", "")
                                            formik.setFieldValue("jawInfo.incisionTo", "")
                                        }

                                    }}
                                    onBlur={formik.handleBlur}
                                />
                                {renderJawInfoTextField('zone', 'Zona implantológica')}
                                {renderJawInfoTextField('anaesthesia', 'Anestesia')}
                                <Row>
                                    <Form.Label>Insición</Form.Label>
                                    <Form.Group as={Col} xs={12} lg={6}>
                                        <Form.Label className='text-light'>Desde pieza</Form.Label>
                                        <Form.Control type="number"
                                            id="jawInfo.incisionFrom"
                                            name="jawInfo.incisionFrom"
                                            value={formik.values.jawInfo.incisionFrom}
                                            onChange={(e) => {
                                                setDirtyForm(true)
                                                formik.handleChange(e)
                                            }}
                                            onBlur={formik.handleBlur}
                                            disabled={!formik.values.jaw}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} xs={12} lg={6}>
                                        <Form.Label className='text-light'>Hasta pieza</Form.Label>
                                        <Form.Control type="number"
                                            id="jawInfo.incisionTo"
                                            name="jawInfo.incisionTo"
                                            value={formik.values.jawInfo.incisionTo}
                                            onChange={(e) => {
                                                setDirtyForm(true)
                                                formik.handleChange(e)
                                            }}
                                            onBlur={formik.handleBlur}
                                            disabled={!formik.values.jaw}
                                        />
                                    </Form.Group>
                                </Row>
                                <Row>
                                    <Form.Group as={Col} xs={12} lg={6}>
                                        <Form.Label className="text-light">Disposición</Form.Label>
                                        <Form.Select
                                            id="jawInfo.disposition"
                                            name="jawInfo.disposition"
                                            value={formik.values.jawInfo.disposition}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            disabled={!formik.values.jaw}
                                        >
                                            <option value="">Seleccionar...</option>
                                            <option value="Lingualizada">Lingualizada</option>
                                            <option value="Vestibularizada">Vestibularizada</option>
                                            <option value="Sobre reborde">Sobre reborde</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Row>
                                <Row className="mb-3">
                                    <Form.Group as={Col} xs={12} lg={6}>
                                        <Form.Label className='text-light'>Maniobras de extensión</Form.Label>
                                        <Form.Select
                                            id="jawInfo.extension"
                                            name="jawInfo.extension"
                                            value={formik.values.jawInfo.extension ? "true" : "false"}
                                            onChange={e => formik.setFieldValue("jawInfo.extension", e.target.value === 'true')}
                                            onBlur={formik.handleBlur}
                                            disabled={!formik.values.jaw}
                                        >
                                            <option value="false">No</option>
                                            <option value="true">Sí</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Row>
                                <Accordion className="mb-3">
                                    <Accordion.Item eventKey={formik.values.jaw ? "0" : ""}>
                                        <Accordion.Header className={!formik.values.jaw ? "pe-none" : "pe-auto"}>Compensadoras</Accordion.Header>
                                        <Accordion.Body>
                                            <p role="button" onClick={() => handleCompensator("jaw")}>Agregar <svg width="25" height="25" viewBox="0 0 512 512" style={{ color: "#ffffff" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 24 24" fill="#632f6b" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#632f6b"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M12 20v-8m0 0V4m0 8h8m-8 0H4" /></g></svg></svg></p>
                                            <hr />
                                            {formik.values.jawInfo.compensators?.map((compensator, index) => (
                                                <div className="container border rounded">
                                                    <div className="d-flex flex-row justify-content-between">
                                                        <p><b>Compensadora {index + 1}</b></p>
                                                        <div className="d-flex gap-2">
                                                            <svg onClick={() => handleEditCompensator(index, "jaw")} role="button" width="25" height="25" viewBox="0 0 512 512" style={{ color: "#ffffff" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full cursor-pointer"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 1024 1024" fill="#D040EE" x="0" y="0" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#D040EE"><path fill="currentColor" d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 0 0 0-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 0 0 9.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3l-362.7 362.6l-88.9 15.7l15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z" /></g></svg></svg>
                                                            <svg onClick={() => handleDeleteCompensator(index, "jaw")} role="button" width="25" height="25" viewBox="0 0 512 512" style={{ color: "#ffffff" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 24 24" fill="#632f6b" x="0" y="0" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#632f6b"><path fill="currentColor" d="M14.12 10.47L12 12.59l-2.13-2.12l-1.41 1.41L10.59 14l-2.12 2.12l1.41 1.41L12 15.41l2.12 2.12l1.41-1.41L13.41 14l2.12-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4zM6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9z" /></g></svg></svg>
                                                        </div>
                                                    </div>
                                                    <div >
                                                        <p><b>Ubicación:</b> {compensator.location}</p>
                                                        <p><b>Localización:</b> {compensator.localization}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                                <Accordion className="">
                                    <Accordion.Item eventKey="0">
                                        <Accordion.Header className={!formik.values.jaw ? "pe-none" : "pe-auto"}>Implantes </Accordion.Header>
                                        <Accordion.Body>
                                            <p role="button" onClick={() => handleImplant("jaw")}>Agregar <svg width="25" height="25" viewBox="0 0 512 512" style={{ color: "#ffffff" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 24 24" fill="#632f6b" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#632f6b"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M12 20v-8m0 0V4m0 8h8m-8 0H4" /></g></svg></svg></p>
                                            <hr />
                                            {formik.values.jawInfo.implants.map((implant, index) => (
                                                <div className="container border rounded">
                                                    <div className="d-flex flex-row justify-content-between">
                                                        <p><b>Implante {index + 1}</b></p>
                                                        <div className="d-flex gap-2">
                                                            <svg onClick={() => handleEditImplant(index, "jaw")} role="button" width="25" height="25" viewBox="0 0 512 512" style={{ color: "#ffffff" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full cursor-pointer"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 1024 1024" fill="#D040EE" x="0" y="0" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#D040EE"><path fill="currentColor" d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 0 0 0-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 0 0 9.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3l-362.7 362.6l-88.9 15.7l15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z" /></g></svg></svg>
                                                            <svg onClick={() => handleDeleteImplant(index, "jaw")} role="button" width="25" height="25" viewBox="0 0 512 512" style={{ color: "#ffffff" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 24 24" fill="#632f6b" x="0" y="0" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#632f6b"><path fill="currentColor" d="M14.12 10.47L12 12.59l-2.13-2.12l-1.41 1.41L10.59 14l-2.12 2.12l1.41 1.41L12 15.41l2.12 2.12l1.41-1.41L13.41 14l2.12-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4zM6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9z" /></g></svg></svg>
                                                        </div>
                                                    </div>
                                                    <div >
                                                        <p><b>Ubicación:</b> {implant.location}</p>
                                                        <p><b>Marca y modelo:</b> {implant.brand}</p>
                                                        <p><b>Conexión:</b> {implant.connection}</p>
                                                        <p><b>Plataforma:</b> {implant.platform}</p>
                                                        <p><b>Longitud:</b> {implant.length}</p>
                                                        <p><b>Diametro del implante:</b> {implant.diameter}</p>
                                                        <p><b>Torque de inserción:</b> {implant.torque}</p>
                                                        <p><b>Estabilidad iniciál:</b> {implant.stability ? "Si" : "No"}</p>
                                                        <p><b>Oportunidad de colocación:</b> {implant.placement}</p>
                                                        <p><b>Método de maniobra instrumental:</b> {implant.instrumentalMethod}</p>
                                                    </div>
                                                    <hr />
                                                </div>
                                            ))}
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                                <Row>
                                    {renderJawInfoTextField('regenerationObjective', 'Objetivo de regeneración ósea')}
                                </Row>
                                <Row>
                                    {renderJawInfoTextField('elevationMethod', 'Método de elevación de piso de seno')}
                                </Row>
                                <Row>
                                    <Form.Label>Extensión de regeneración</Form.Label>
                                    <Form.Group as={Col} xs={12} lg={6}>
                                        <Form.Label className='text-light'>Desde pieza</Form.Label>
                                        <Form.Control type="number"
                                            id="jawInfo.regenerationFrom"
                                            name="jawInfo.regenerationFrom"
                                            value={formik.values.jawInfo.regenerationFrom}
                                            onChange={(e) => {
                                                setDirtyForm(true)
                                                formik.handleChange(e)
                                            }}
                                            onBlur={formik.handleBlur}
                                            disabled={!formik.values.jaw}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} xs={12} lg={6}>
                                        <Form.Label className='text-light'>Hasta pieza</Form.Label>
                                        <Form.Control type="number"
                                            id="jawInfo.regenerationTo"
                                            name="jawInfo.regenerationTo"
                                            value={formik.values.jawInfo.regenerationTo}
                                            onChange={(e) => {
                                                setDirtyForm(true)
                                                formik.handleChange(e)
                                            }}
                                            onBlur={formik.handleBlur}
                                            disabled={!formik.values.jaw}
                                        />
                                    </Form.Group>
                                </Row>
                                <Row className="mb-3">
                                    <Form.Group as={Col} xs={12} lg={6}>
                                        <Form.Label className='text-light'>Colocación de membrana</Form.Label>
                                        <Form.Select
                                            id="jawInfo.membrane"
                                            name="jawInfo.membrane"
                                            value={formik.values.jawInfo.membrane ? "true" : "false"}
                                            onChange={e => formik.setFieldValue("jawInfo.membrane", e.target.value === 'true')}
                                            onBlur={formik.handleBlur}
                                            disabled={!formik.values.jaw}
                                        >
                                            <option value="false">No</option>
                                            <option value="true">Sí</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Row>
                                <Accordion className="mb-3">
                                    <Accordion.Item eventKey={formik.values.jaw ? "0" : ""}>
                                        <Accordion.Header className={!formik.values.jaw ? "pe-none" : "pe-auto"}>Materiales de regeneración</Accordion.Header>
                                        <Accordion.Body>
                                            <p role="button" onClick={() => handleMaterial("jaw")}>Agregar <svg width="25" height="25" viewBox="0 0 512 512" style={{ color: "#ffffff" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 24 24" fill="#632f6b" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#632f6b"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M12 20v-8m0 0V4m0 8h8m-8 0H4" /></g></svg></svg></p>
                                            <hr />
                                            {formik.values.jawInfo.materials?.map((material, index) => (
                                                <div className="container border rounded">
                                                    <div className="d-flex flex-row justify-content-between">
                                                        <p><b>Material {index + 1}</b></p>
                                                        <div className="d-flex gap-2">
                                                            <svg onClick={() => handleEditMaterial(index, "jaw")} role="button" width="25" height="25" viewBox="0 0 512 512" style={{ color: "#ffffff" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full cursor-pointer"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 1024 1024" fill="#D040EE" x="0" y="0" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#D040EE"><path fill="currentColor" d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 0 0 0-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 0 0 9.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3l-362.7 362.6l-88.9 15.7l15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z" /></g></svg></svg>
                                                            <svg onClick={() => handleDeleteMaterial(index, "jaw")} role="button" width="25" height="25" viewBox="0 0 512 512" style={{ color: "#ffffff" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 24 24" fill="#632f6b" x="0" y="0" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#632f6b"><path fill="currentColor" d="M14.12 10.47L12 12.59l-2.13-2.12l-1.41 1.41L10.59 14l-2.12 2.12l1.41 1.41L12 15.41l2.12 2.12l1.41-1.41L13.41 14l2.12-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4zM6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9z" /></g></svg></svg>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p><b>Injerto:</b> {material.grafting}</p>
                                                        <p><b>Zona dadora de autólogo:</b> {material.autologue}</p>
                                                    </div>
                                                    <hr />
                                                </div>
                                            ))}
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                                <Row >
                                    {renderJawInfoTextField('sutureMaterial', 'Material de sutura')}
                                </Row>
                                <Row className="mb-3">
                                    {renderJawInfoTextField('technique', 'Técnica de sutura')}
                                </Row>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
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
                                    Crear
                                </Button>
                            </div> :
                            <div className='d-flex align-items-center justify-content-center w-25'>
                                <Spinner />
                            </div>}
                    </Form.Group>
                </Row>
            </Form>
            {
                show && modal === "topCompensator" &&
                <CustomModal title="Agregar compensadora">
                    <AddCompensator compensators={formik.values.topMaxillaryInfo.compensators}></AddCompensator>
                </CustomModal>
            }
            {
                show && modal === "editTopCompensator" &&
                <CustomModal title="Editar compensadora">
                    <EditCompensator compensators={formik.values.topMaxillaryInfo.compensators} index={currentIndex}></EditCompensator>
                </CustomModal>
            }
            {
                show && modal === "topImplant" &&
                <CustomModal title="Agregar implante">
                    <Addimplant implants={formik.values.topMaxillaryInfo.implants}></Addimplant>
                </CustomModal>
            }
            {
                show && modal === "topMaterial" &&
                <CustomModal title="Agregar materiales">
                    <AddMaterial materials={formik.values.topMaxillaryInfo.materials}></AddMaterial>
                </CustomModal>
            }
            {
                show && modal === "editTopMaterial" &&
                <CustomModal title="Editar material">
                    <EditMaterial materials={formik.values.topMaxillaryInfo.materials} index={currentIndex}></EditMaterial>
                </CustomModal>
            }
            {
                show && modal === "editTopImplant" &&
                <CustomModal title="Editar implante">
                    <EditImplant implants={formik.values.topMaxillaryInfo.implants} index={currentIndex}></EditImplant>
                </CustomModal>
            }
            {
                show && modal === "jawCompensator" &&
                <CustomModal title="Agregar compensadora">
                    <AddCompensator compensators={formik.values.jawInfo.compensators}></AddCompensator>
                </CustomModal>
            }
            {
                show && modal === "editJawCompensator" &&
                <CustomModal title="Editar compensadora">
                    <EditCompensator compensators={formik.values.jawInfo.compensators} index={currentIndex}></EditCompensator>
                </CustomModal>
            }
            {
                show && modal === "jawImplant" &&
                <CustomModal title="Agregar implante">
                    <Addimplant implants={formik.values.jawInfo.implants}></Addimplant>
                </CustomModal>
            }
            {
                show && modal === "editJawImplant" &&
                <CustomModal title="Editar implante">
                    <EditImplant implants={formik.values.jawInfo.implants} index={currentIndex}></EditImplant>
                </CustomModal>
            }
            {
                show && modal === "jawMaterial" &&
                <CustomModal title="Agregar materiales">
                    <AddMaterial materials={formik.values.jawInfo.materials}></AddMaterial>
                </CustomModal>
            }
            {
                show && modal === "editJawMaterial" &&
                <CustomModal title="Editar material">
                    <EditMaterial materials={formik.values.jawInfo.materials} index={currentIndex}></EditMaterial>
                </CustomModal>
            }
        </div >
    )
}

export default CreateSurgicalProtocol