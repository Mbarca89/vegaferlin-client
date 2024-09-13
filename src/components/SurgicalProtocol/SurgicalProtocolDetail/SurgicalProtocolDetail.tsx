import { useEffect, useState } from "react";
import type { SurgicalProtocol, SurgicalInfo } from "../../../types";
import { useFormik } from "formik";
import { Accordion, Col, Form, Row, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import handleError from "../../../utils/HandleErrors";
import { axiosWithToken } from "../../../utils/axiosInstances";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;


const SurgicalProtocolDetail = () => {

    const { protocolId } = useParams()
    const [loading, setLoading] = useState<boolean>(false)
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
        initialValues: {
            id: surgicalProtocol.id,
            date: surgicalProtocol.date,
            firstAssistant: surgicalProtocol.firstAssistant,
            secondAssistant: surgicalProtocol.secondAssistant,
            startTime: surgicalProtocol.startTime,
            endTime: surgicalProtocol.endTime,
            preMed: surgicalProtocol.preMed,
            postMed: surgicalProtocol.postMed,
            surgeryType: surgicalProtocol.surgeryType,
            topMaxillary: surgicalProtocol.topMaxillary,
            jaw: surgicalProtocol.jaw,
            topMaxillaryInfo: surgicalProtocol.topMaxillaryInfo,
            jawInfo: surgicalProtocol.jawInfo
        },
        validate,
        enableReinitialize: true,
        onSubmit: async values => {
        },
    });

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
                disabled
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
                disabled
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
                disabled
            />
        </Form.Group>
    );
    return (
        !loading ? <div className="w-100">
            <Form onSubmit={formik.handleSubmit} noValidate data-bs-theme="dark" className="text-start">
                <Row className="mb-2">
                    <Form.Group className='text-light' as={Col} xs={12} lg={6}>
                        <Form.Label >Fecha</Form.Label>
                        <Form.Control type="date"
                            id="date"
                            name="date"
                            value={formik.values.date}
                            disabled
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
                            disabled
                        />
                    </Form.Group>
                    <Form.Group as={Col} xs={12} lg={6}>
                        <Form.Label className='text-light'>Hora de finalización</Form.Label>
                        <Form.Control type="time"
                            placeholder="Hora de finalización"
                            id="endTime"
                            name="endTime"
                            value={formik.values.endTime}
                            disabled
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
                                            disabled
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} xs={12} lg={6}>
                                        <Form.Label className='text-light'>Hasta pieza</Form.Label>
                                        <Form.Control type="number"
                                            id="topMaxillaryInfo.incisionTo"
                                            name="topMaxillaryInfo.incisionTo"
                                            value={formik.values.topMaxillaryInfo?.incisionTo}
                                            disabled
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
                                            {formik.values.topMaxillaryInfo?.compensators?.map((compensator, index) => (
                                                <div>
                                                    <div className="container border rounded">
                                                        <p>Compensadora {index + 1}</p>
                                                        <p><b>Ubicación:</b> {compensator.location}</p>
                                                        <p><b>Localización:</b> {compensator.localization}</p>
                                                    </div>
                                                    <hr />
                                                </div>
                                            ))}
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                                <Accordion className="">
                                    <Accordion.Item eventKey="0">
                                        <Accordion.Header className={!formik.values.topMaxillary ? "pe-none" : "pe-auto"}>Implantes </Accordion.Header>
                                        <Accordion.Body>
                                            {formik.values.topMaxillaryInfo?.implants.map((implant, index) => (
                                                <div>
                                                    <div className="container border rounded">
                                                        <p>Implante {index + 1}</p>
                                                        <p><b>Ubicación:</b> {implant.location}</p>
                                                        <p><b>Marca y modelo:</b> {implant.brand}</p>
                                                        <p><b>Conexión:</b> {implant.connection}</p>
                                                        <p><b>Plataforma:</b> {implant.platform}</p>
                                                        <p><b>Longitud:</b> {implant.length}</p>
                                                        <p><b>Diametro del implante:</b> {implant.diameter}</p>
                                                        <p><b>Torque de inserción:</b> {implant.torque}</p>
                                                        <p><b>Estabilidad iniciál:</b> {implant.stability}</p>
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
                                            disabled
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} xs={12} lg={6}>
                                        <Form.Label className='text-light'>Hasta pieza</Form.Label>
                                        <Form.Control type="number"
                                            id="topMaxillaryInfo.regenerationTo"
                                            name="topMaxillaryInfo.regenerationTo"
                                            value={formik.values.topMaxillaryInfo?.regenerationTo}
                                            disabled
                                        />
                                    </Form.Group>
                                </Row>
                                <Row className="mb-3">
                                    {renderTopInfoTextField('membrane', 'Colocación de membrana')}
                                </Row>
                                <Accordion className="mb-3">
                                    <Accordion.Item eventKey={formik.values.topMaxillary ? "0" : ""}>
                                        <Accordion.Header className={!formik.values.topMaxillary ? "pe-none" : "pe-auto"}>Materiales</Accordion.Header>
                                        <Accordion.Body>
                                            {formik.values.topMaxillaryInfo?.materials?.map((material, index) => (
                                                <div>
                                                    <div className="container border rounded">
                                                        <p>Material {index + 1}</p>
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
                                            disabled
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} xs={12} lg={6}>
                                        <Form.Label className='text-light'>Hasta pieza</Form.Label>
                                        <Form.Control type="number"
                                            id="jawInfo.incisionTo"
                                            name="jawInfo.incisionTo"
                                            value={formik.values.jawInfo?.incisionTo}
                                            disabled
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
                                            {formik.values.jawInfo?.compensators?.map((compensator, index) => (
                                                <div>
                                                    <div className="container border rounded">
                                                        <p>Compensadora {index + 1}</p>
                                                        <p><b>Ubicación:</b> {compensator.location}</p>
                                                        <p><b>Localización:</b> {compensator.localization}</p>
                                                    </div>
                                                    <hr />
                                                </div>
                                            ))}
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                                <Accordion className="">
                                    <Accordion.Item eventKey="0">
                                        <Accordion.Header className={!formik.values.jaw ? "pe-none" : "pe-auto"}>Implantes </Accordion.Header>
                                        <Accordion.Body>
                                            {formik.values.jawInfo?.implants.map((implant, index) => (
                                                <div>
                                                    <div className="container border rounded">
                                                        <p>Implante {index + 1}</p>
                                                        <p><b>Ubicación:</b> {implant.location}</p>
                                                        <p><b>Marca y modelo:</b> {implant.brand}</p>
                                                        <p><b>Conexión:</b> {implant.connection}</p>
                                                        <p><b>Plataforma:</b> {implant.platform}</p>
                                                        <p><b>Longitud:</b> {implant.length}</p>
                                                        <p><b>Diametro del implante:</b> {implant.diameter}</p>
                                                        <p><b>Torque de inserción:</b> {implant.torque}</p>
                                                        <p><b>Estabilidad iniciál:</b> {implant.stability}</p>
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
                                            disabled
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} xs={12} lg={6}>
                                        <Form.Label className='text-light'>Hasta pieza</Form.Label>
                                        <Form.Control type="number"
                                            id="jawInfo.regenerationTo"
                                            name="jawInfo.regenerationTo"
                                            value={formik.values.jawInfo?.regenerationTo}
                                            disabled
                                        />
                                    </Form.Group>
                                </Row>
                                <Row className="mb-3">
                                    {renderJawInfoTextField('membrane', 'Colocación de membrana')}
                                </Row>
                                <Accordion className="mb-3">
                                    <Accordion.Item eventKey={formik.values.jaw ? "0" : ""}>
                                        <Accordion.Header className={!formik.values.jaw ? "pe-none" : "pe-auto"}>Materiales</Accordion.Header>
                                        <Accordion.Body>
                                            {formik.values.jawInfo?.materials?.map((material, index) => (
                                                <div>
                                                    <div className="container border rounded">
                                                        <p>Material {index + 1}</p>
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
            <Spinner></Spinner>
    )
}

export default SurgicalProtocolDetail