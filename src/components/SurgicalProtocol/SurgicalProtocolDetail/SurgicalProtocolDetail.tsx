import "./SurgicalProtocolDetail.css"
import { useEffect, useState } from "react";
import type { SurgicalProtocol, SurgicalInfo } from "../../../types";
import { useFormik } from "formik";
import { Accordion, Col, Form, Row, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import handleError from "../../../utils/HandleErrors";
import { axiosWithToken } from "../../../utils/axiosInstances";
import { useRecoilState } from "recoil";
import { formState, modalState, userState } from "../../../app/store";
import { notifyError, notifySuccess } from "../../Toaster/Toaster";
import CustomModal from "../../Modal/CustomModal";
import AddCompensator from "../AddCompensator/AddCompensator";
import EditCompensator from "../EditCompensator/EditCompensator";
import Addimplant from "../AddImplant/AddImplant";
import AddMaterial from "../AddMaterial/AddMaterial";
import EditMaterial from "../EditMaterial/EditMaterial";
import EditImplant from "../EditImplant/EditImplant";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

const SurgicalProtocolDetail = () => {

    const { protocolId } = useParams()
    const [loading, setLoading] = useState<boolean>(false)
    const [edit, setEdit] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [dirtyForm, setDirtyForm] = useRecoilState(formState)
    const [user] = useRecoilState(userState)
    const [show, setShow] = useRecoilState(modalState)
    const [modal, setModal] = useState<string>("")
    const [currentIndex, setCurrentIndex] = useState<number>(0)

    const [surgicalProtocol, setSurgicalProtocol] = useState<SurgicalProtocol>({
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
            incisionFrom: 0,
            incisionTo: 0,
            disposition: "",
            extension: false,
            compensators: [],
            implants: [],
            regenerationObjective: "",
            elevationMethod: "",
            regenerationFrom: 0,
            regenerationTo: 0,
            membrane: false,
            materials: [],
            sutureMaterial: "",
            technique: "",
        },
        jawInfo: {
            zone: "",
            anaesthesia: "",
            incisionFrom: 0,
            incisionTo: 0,
            disposition: "",
            extension: false,
            compensators: [],
            implants: [],
            regenerationObjective: "",
            elevationMethod: "",
            regenerationFrom: 0,
            regenerationTo: 0,
            membrane: false,
            materials: [],
            sutureMaterial: "",
            technique: "",
        },
        inChargeOfId: 0
    })

    const getSurgicalProtocol = async () => {
        try {
            const res = await axiosWithToken.get(`${SERVER_URL}/api/surgicalProtocol/getById?id=${protocolId}`)
            if (res.data) {
                setSurgicalProtocol(res.data)
            }
        } catch (error: any) {
            handleError(error)
        } finally {
            setLoading(false)
        }
    }

    const validate = (values: SurgicalProtocol): SurgicalProtocol => {
        const errors: any = {};
        return errors;
    };

    const formik = useFormik<SurgicalProtocol>({
        initialValues: surgicalProtocol,
        enableReinitialize: true,
        onSubmit: async values => {
            setUploading(true)
            try {
                const res = await axiosWithToken.put(`${SERVER_URL}/api/surgicalProtocol/update?id=${protocolId}`, values)
                if (res.data) {
                    notifySuccess(res.data)
                    setDirtyForm(false)
                }
            } catch (error) {
                handleError(error)
            } finally {
                setUploading(false)
                setEdit(false)
            }
        },
    })

    const handleEdit = (allowed: boolean) => {
        if (!allowed) notifyError("Solo el profesional a cargo puede editar.")
        else {
            setDirtyForm(true)
            setEdit(!edit)
        }
    }

    const resetForm = () => {
        formik.resetForm()
        setDirtyForm(false)
        setUploading(false)
        setEdit(false)
    }

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

    useEffect(() => {
        if (protocolId) getSurgicalProtocol()
    }, [protocolId])

    const renderTextField = (id: keyof SurgicalProtocol, label: string) => (
        <Form.Group as={Col} xs={12} lg={6}>
            <Form.Label className='text-light'>{label}</Form.Label>
            <Form.Control
                id={id}
                name={id}
                value={formik.values[id] as string}
                disabled={!edit}
                onChange={(e) => {
                    setDirtyForm(true)
                    formik.handleChange(e)
                }}
            />
        </Form.Group>
    );
    const renderTopInfoTextField = (id: keyof SurgicalInfo, label: string) => (
        <Form.Group as={Col} xs={12} lg={6}>
            <Form.Label className='text-light'>{label}</Form.Label>
            <Form.Control
                id={`topMaxillaryInfo.${id}`}
                name={`topMaxillaryInfo.${id}`}
                value={formik.values.topMaxillaryInfo[id] as string}
                disabled={!edit}
                onChange={(e) => {
                    setDirtyForm(true)
                    formik.handleChange(e)
                }}
            />
        </Form.Group>
    );
    const renderJawInfoTextField = (id: keyof SurgicalInfo, label: string) => (
        <Form.Group as={Col} xs={12} lg={6}>
            <Form.Label className='text-light'>{label}</Form.Label>
            <Form.Control
                id={`jawInfo.${id}`}
                name={`jawInfo.${id}`}
                value={formik.values.jawInfo && formik.values.jawInfo[id] as string}
                disabled={!edit}
                onChange={(e) => {
                    setDirtyForm(true)
                    formik.handleChange(e)
                }}
            />
        </Form.Group>
    );
    return (
        <div className="position-relative d-flex flex-column justify-content-center align-items-center">
            <div className="d-flex container position-fixed justify-content-end bottom-0 pe-4 pb-1 z-top">
                {surgicalProtocol.inChargeOfId == user.id ?
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
            {!loading ? <div className="w-100 mb-5">
                <Form onSubmit={formik.handleSubmit} noValidate data-bs-theme="dark" className="text-start">
                    <Row className="mb-2">
                        <Form.Group className='text-light' as={Col} xs={12} lg={6}>
                            <Form.Label >Fecha</Form.Label>
                            <Form.Control type="date"
                                id="date"
                                name="date"
                                value={formik.values.date}
                                disabled={!edit}
                            />
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
                                onChange={(e) => {
                                    setDirtyForm(true)
                                    formik.handleChange(e)
                                }}
                                disabled={!edit}
                            />
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
                                disabled={!edit}
                            />
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
                                        checked={formik.values.topMaxillary}
                                        onChange={e => {
                                            setDirtyForm(true)
                                            const checked = e.target.checked
                                            formik.setFieldValue("topMaxillary", checked)
                                            if (!checked) {
                                                formik.setFieldValue("topMaxillaryInfo", formik.initialValues.topMaxillaryInfo)
                                                formik.setFieldValue("topMaxillaryInfo.incisionFrom", "")
                                                formik.setFieldValue("topMaxillaryInfo.incisionTo", "")
                                            }
                                        }}
                                        onBlur={formik.handleBlur}
                                        disabled={!edit}
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
                                                value={formik.values.topMaxillaryInfo?.incisionFrom}
                                                disabled={!edit}
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} xs={12} lg={6}>
                                            <Form.Label className='text-light'>Hasta pieza</Form.Label>
                                            <Form.Control type="number"
                                                id="topMaxillaryInfo.incisionTo"
                                                name="topMaxillaryInfo.incisionTo"
                                                value={formik.values.topMaxillaryInfo?.incisionTo}
                                                disabled={!edit}
                                            />
                                        </Form.Group>
                                    </Row>
                                    <Row>
                                        {renderTopInfoTextField('disposition', 'Disposición')}
                                    </Row>
                                    <Row className="mb-3">
                                        {renderTopInfoTextField('extension', 'Maniobras de extensión')}
                                    </Row>
                                    <Accordion className="mb-3">
                                        <Accordion.Item eventKey={formik.values.topMaxillary ? "0" : ""}>
                                        <Accordion.Header className={!formik.values.topMaxillary ? "pe-none" : "pe-auto"}>Compensadoras</Accordion.Header>
                                        <Accordion.Body>
                                            <p role="button" onClick={edit ? () => handleCompensator("top") : ()=>{return}}>Agregar <svg width="25" height="25" viewBox="0 0 512 512" style={{ color: "#ffffff" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 24 24" fill="#632f6b" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#632f6b"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M12 20v-8m0 0V4m0 8h8m-8 0H4" /></g></svg></svg></p>
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
                                                value={formik.values.topMaxillaryInfo?.regenerationFrom}
                                                disabled={!edit}
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} xs={12} lg={6}>
                                            <Form.Label className='text-light'>Hasta pieza</Form.Label>
                                            <Form.Control type="number"
                                                id="topMaxillaryInfo.regenerationTo"
                                                name="topMaxillaryInfo.regenerationTo"
                                                value={formik.values.topMaxillaryInfo?.regenerationTo}
                                                disabled={!edit}
                                            />
                                        </Form.Group>
                                    </Row>
                                    <Row className="mb-3">
                                        {renderTopInfoTextField('membrane', 'Colocación de membrana')}
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
                                        id="topMaxillary"
                                        checked={formik.values.topMaxillary}
                                        onChange={e => {
                                            setDirtyForm(true)
                                            const checked = e.target.checked
                                            formik.setFieldValue("topMaxillary", checked)
                                            if (!checked) {
                                                formik.setFieldValue("topMaxillaryInfo", formik.initialValues.topMaxillaryInfo)
                                                formik.setFieldValue("topMaxillaryInfo.incisionFrom", "")
                                                formik.setFieldValue("topMaxillaryInfo.incisionTo", "")
                                            }
                                        }}
                                        onBlur={formik.handleBlur}
                                        disabled={!edit}
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
                                                value={formik.values.jawInfo?.incisionFrom}
                                                onChange={(e) => {
                                                    setDirtyForm(true)
                                                    formik.handleChange(e)
                                                }}
                                                disabled={!edit}
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} xs={12} lg={6}>
                                            <Form.Label className='text-light'>Hasta pieza</Form.Label>
                                            <Form.Control type="number"
                                                id="jawInfo.incisionTo"
                                                name="jawInfo.incisionTo"
                                                value={formik.values.jawInfo?.incisionTo}
                                                onChange={(e) => {
                                                    setDirtyForm(true)
                                                    formik.handleChange(e)
                                                }}
                                                disabled={!edit}
                                            />
                                        </Form.Group>
                                    </Row>
                                    <Row>
                                        {renderJawInfoTextField('disposition', 'Disposición')}
                                    </Row>
                                    <Row className="mb-3">
                                        {renderJawInfoTextField('extension', 'Maniobras de extensión')}
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
                                                value={formik.values.jawInfo?.regenerationFrom}
                                                onChange={(e) => {
                                                    setDirtyForm(true)
                                                    formik.handleChange(e)
                                                }}
                                                disabled={!edit}
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} xs={12} lg={6}>
                                            <Form.Label className='text-light'>Hasta pieza</Form.Label>
                                            <Form.Control type="number"
                                                id="jawInfo.regenerationTo"
                                                name="jawInfo.regenerationTo"
                                                value={formik.values.jawInfo?.regenerationTo}
                                                onChange={(e) => {
                                                    setDirtyForm(true)
                                                    formik.handleChange(e)
                                                }}
                                                disabled={!edit}
                                            />
                                        </Form.Group>
                                    </Row>
                                    <Row className="mb-3">
                                        {renderJawInfoTextField('membrane', 'Colocación de membrana')}
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
                </Form>
            </div> :
                <Spinner></Spinner>}
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
        </div>
    )
}

export default SurgicalProtocolDetail