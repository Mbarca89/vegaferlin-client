import { useEffect, useState } from "react"
import { useRecoilState } from "recoil"
import { formState, userState } from "../../../app/store"
import { axiosWithToken } from "../../../utils/axiosInstances"
import handleError from "../../../utils/HandleErrors";
import { useFormik } from "formik";
import { notifyError, notifySuccess } from "../../Toaster/Toaster";
import type { dentalEvaluation } from "../../../types";
import { Col, Form, Row, Spinner } from "react-bootstrap";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface PatientDentalEvaluationProps {
    patientId: number
    inChargeOfId: number,
}

const PatientDentalEvaluation: React.FC<PatientDentalEvaluationProps> = ({ patientId, inChargeOfId }) => {

    const [fetching, setFetching] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [edit, setEdit] = useState<boolean>(false)
    const [uploading, setUploading] = useState<boolean>(false)
    const [dirtyForm, setDirtyForm] = useRecoilState(formState)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [user, setUser] = useRecoilState(userState)
    const [dentalEvaluation, setDentalEvaluation] = useState<dentalEvaluation>({
        brush: false,
        brushFrequency: "",
        floss: false,
        flossFrequency: "",
        interdentalBrush: false,
        interdentalBrushFrequency: "",
        biotype: "",
        smile: "",
        verticalLoss: false,
        jawPosition: false,
        dispersion: false,
        wear: false,
        wearType: "",
        internalExam: "",
        externalExam: ""
    })

    const getDentalEvaluation = async () => {
        setFetching(true)
        try {
            const res = await axiosWithToken.get(`${SERVER_URL}/api/dentalEvaluation/getByPatientId?patientId=${patientId}`)
            if (res.data) {
                setDentalEvaluation(res.data)
            }
        } catch (error) {
            handleError(error)
        } finally {
            setFetching(false)
        }
    }

    useEffect(() => {
        if (patientId) getDentalEvaluation()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [patientId])

    const formik = useFormik({
        initialValues: {
            brush: dentalEvaluation.brush,
            brushFrequency: dentalEvaluation.brushFrequency,
            floss: dentalEvaluation.floss,
            flossFrequency: dentalEvaluation.flossFrequency,
            interdentalBrush: dentalEvaluation.interdentalBrush,
            interdentalBrushFrequency: dentalEvaluation.interdentalBrushFrequency,
            biotype: dentalEvaluation.biotype,
            smile: dentalEvaluation.smile,
            verticalLoss: dentalEvaluation.verticalLoss,
            jawPosition: dentalEvaluation.jawPosition,
            dispersion: dentalEvaluation.dispersion,
            wear: dentalEvaluation.wear,
            wearType: dentalEvaluation.wearType,
            internalExam: dentalEvaluation.internalExam || "S/P",
            externalExam: dentalEvaluation.externalExam || "S/P"
        },
        enableReinitialize: true,
        onSubmit: async values => {
            setUploading(true)
            try {
                const dentalEvaluationRequest = {
                    ...values,
                }
                const res = await axiosWithToken.put(`${SERVER_URL}/api/dentalEvaluation/update?patientId=${patientId}`, dentalEvaluationRequest)
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
    });

    const renderBooleanField = (id: keyof dentalEvaluation, label: string) => (
        <Form.Group>
            <Form.Label className='text-light'>{label}</Form.Label>
            <Form.Select
                id={id}
                name={id}
                value={formik.values[id] ? "true" : "false"}
                onChange={e => formik.setFieldValue(id, e.target.value === 'true')}
                onBlur={formik.handleBlur}
                disabled={!edit}
            >
                <option value="false">No</option>
                <option value="true">Sí</option>
            </Form.Select>
        </Form.Group>
    );


    const renderTextField = (id: keyof dentalEvaluation, label: string) => (
        <Form.Group>
            <Form.Label className='text-light'>{label}</Form.Label>
            <Form.Control
                placeholder="S/P"
                id={id}
                name={id}
                value={formik.values[id] as string}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!edit}
            />
        </Form.Group>
    );

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
            {!fetching ? <Form onSubmit={formik.handleSubmit} noValidate className="text-start" data-bs-theme="dark">
                <Row className="gap-1">
                    <Col xs={12} lg={6} className="">
                        <Row className="mb-3">
                            <h3 className="text-light text-start">Evaluación odontológica</h3>
                            <hr />
                            {renderBooleanField('brush', 'Uso de cepillo dental')}
                            <Form.Group>
                                <Form.Label className="text-light">Frecuencia de uso del cepillo dental</Form.Label>
                                <Form.Select
                                    id="brushFrequency"
                                    name="brushFrequency"
                                    value={formik.values.brushFrequency}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    disabled={!edit}
                                >
                                    <option value="">Seleccionar...</option>
                                    <option value="1 vez al día">1 vez al día</option>
                                    <option value="2 veces al día">2 veces al día</option>
                                    <option value="3 veces al día">3 veces al día</option>
                                    <option value="4 veces al día">4 veces al día</option>
                                    <option value="Más de 4 veces al día">Más de 4 veces al día</option>
                                    <option value="Menos de 1 vez al día">Menos de 1 vez al día</option>
                                </Form.Select>
                            </Form.Group>
                            {renderBooleanField('floss', 'Uso de hilo dental')}
                            <Form.Group>
                                <Form.Label className="text-light">Frecuencia de uso de hilo dental</Form.Label>
                                <Form.Select
                                    id="flossFrequency"
                                    name="flossFrequency"
                                    value={formik.values.flossFrequency}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    disabled={!edit}
                                >
                                    <option value="">Seleccionar...</option>
                                    <option value="Menos de una vez a la semana">Menos de una vez a la semana</option>
                                    <option value="1 vez a la semana">1 vez a la semana</option>
                                    <option value="2 a 6 veces a la semana">2 a 6 veces a la semana</option>
                                    <option value="1 vez al día">1 vez al día</option>
                                    <option value="Más de 1 vez al día">Más de 1 vez al día</option>
                                </Form.Select>
                            </Form.Group>
                            {renderBooleanField('interdentalBrush', 'Uso de cepillo interdental')}
                            <Form.Group>
                                <Form.Label className="text-light">Frecuencia de uso de cepillo interdental</Form.Label>
                                <Form.Select
                                    id="interdentalBrushFrequency"
                                    name="interdentalBrushFrequency"
                                    value={formik.values.interdentalBrushFrequency}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    disabled={!edit}
                                >
                                    <option value="">Seleccionar...</option>
                                    <option value="Menos de una vez a la semana">Menos de una vez a la semana</option>
                                    <option value="1 vez a la semana">1 vez a la semana</option>
                                    <option value="2 a 6 veces a la semana">2 a 6 veces a la semana</option>
                                    <option value="1 vez al día">1 vez al día</option>
                                    <option value="Más de 1 vez al día">Más de 1 vez al día</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className="text-light">Biotipo periodontal</Form.Label>
                                <Form.Select
                                    id="biotype"
                                    name="biotype"
                                    value={formik.values.biotype}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    disabled={!edit}
                                >
                                    <option value="">Seleccionar...</option>
                                    <option value="plano-grueso">plano-grueso</option>
                                    <option value="festoneado-fino">festoneado-fino</option>
                                    <option value="no determinado">no determinado</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className="text-light">Línea de sonrisa</Form.Label>
                                <Form.Select
                                    id="smile"
                                    name="smile"
                                    value={formik.values.smile}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    disabled={!edit}
                                >
                                    <option value="">Seleccionar...</option>
                                    <option value="Baja">Baja</option>
                                    <option value="Media">Media</option>
                                    <option value="Alta">Alta</option>
                                </Form.Select>
                            </Form.Group>
                            {renderBooleanField('verticalLoss', 'Pérdida de dimensión vertical')}
                            {renderBooleanField('jawPosition', 'Cambio de posición mandibular')}
                            {renderBooleanField('dispersion', 'Dispersión anterior')}
                            {renderBooleanField('wear', 'Facetas de descaste anterior')}
                            <Form.Group>
                                <Form.Label className="text-light">Facetas de desgaste</Form.Label>
                                <Form.Select
                                    id="wearType"
                                    name="wearType"
                                    value={formik.values.wearType}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    disabled={!edit}
                                >
                                    <option value="">Seleccionar...</option>
                                    <option value="Grado 1(esmalte)">Grado 1(esmalte)</option>
                                    <option value="Grado 2 (dentina)">Grado 2 (dentina)</option>
                                    <option value="Grado 3 (cámara pulpar)">Grado 3 (cámara pulpar)</option>
                                </Form.Select>
                            </Form.Group>
                            {renderTextField('internalExam', 'Exámen intraoral de tejidos blandos')}
                            {renderTextField('externalExam', 'Exámen extraoral')}
                        </Row>
                    </Col>
                </Row>
            </Form> :
                <Spinner />}
        </div> :
            <Spinner></Spinner>
    )
}

export default PatientDentalEvaluation