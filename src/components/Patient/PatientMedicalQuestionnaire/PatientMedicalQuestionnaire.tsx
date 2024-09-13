import { useFormik } from "formik";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import type { healthQuestionnaire } from "../../../types";
import { useRecoilState } from "recoil";
import { formState, userState } from "../../../app/store";
import type React from "react";
import { useEffect, useState } from "react";
import { axiosWithToken } from "../../../utils/axiosInstances";
import handleError from "../../../utils/HandleErrors";
import { notifyError, notifySuccess } from "../../Toaster/Toaster";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface PatientMedicalQuestionnaireProps {
    patientId: number
    inChargeOfId: number
}

const PatientMedicalQuestionnaire: React.FC<PatientMedicalQuestionnaireProps> = ({ patientId, inChargeOfId }) => {

    const [fetching, setFetching] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [edit, setEdit] = useState<boolean>(false)
    const [uploading, setUploading] = useState<boolean>(false)
    const [dirtyForm, setDirtyForm] = useRecoilState(formState)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [user, setUser] = useRecoilState(userState)
    const [heathQuestionnaire, setHealthQuestionnaire] = useState<healthQuestionnaire>({
        healthAlteration: false,
        healthChange: false,
        lastMedicalCheck: '',
        medicalAttention: false,
        medicalAttentionReason: '',
        medicInformation: '',
        majorSurgery: false,
        majorSurgeryReason: '',
        hospitalized: false,
        hospitalizedReason: '',
        height: undefined,
        weight: undefined,
        maxBloodPressure: undefined,
        minBloodPressure: undefined,
        pulse: undefined,
        generalObservations: '',
        heartAttacks: false,
        rheumatic: false,
        chestPain: false,
        breath: false,
        ankle: false,
        pillow: false,
        pacemaker: false,
        bloodPressureProblems: false,
        hearthObservations: '',
        epilepsy: false,
        faints: false,
        seizures: false,
        emotionalAlteration: false,
        alterationsTreatment: false,
        nervousObservations: '',
        cough: false,
        tuberculosis: false,
        familyTuberculosis: false,
        sinusitis: false,
        asma: false,
        breathObservations: '',
        stomachUlcer: false,
        hepatitis: false,
        jaundice: false,
        liver: false,
        bloodVomit: false,
        digestiveObservations: '',
        diabetis: false,
        familyDiabetis: false,
        urinate: false,
        thirst: false,
        hypothyroidism: false,
        hyperthyroidism: false,
        endocrineObservations: '',
        bloodProblems: false,
        familyBloodProblems: false,
        hemophiliac: false,
        abnormalBlood: false,
        bloodTransfusion: false,
        bloodObservation: '',
        anestheticsAlergy: false,
        antibioticsAlergy: false,
        barbituratesAlergy: false,
        analgesicsAlergy: false,
        asthma: false,
        skin: false,
        alergyObservations: '',
        kidneyProblems: false,
        syphilis: false,
        hiv: false,
        genitourinaryObservations: '',
        tumors: false,
        quimio: false,
        xrays: false,
        neoplaciaObservations: '',
        alcohol: false,
        smoker: false,
        smokeTimes: undefined,
        habitsObservations: '',
        antibiotics: false,
        anticoagulants: false,
        bloodMedicines: false,
        tranquillizers: false,
        hormones: false,
        aspirines: false,
        bisphosphonates: false,
        otherMeds: '',
        midicineObservations: '',
        pregnant: false,
        pregnantPosibilities: false,
        breastfeeding: false,
        menstrual: false,
        hormonalTreatment: false,
        menstrualDisease: false,
        otherDiseases: false,
        otherDiseasesReason: '',
        womanObservations: '',
        mainDentalProblem: '',
        pain: false,
        dentalAspect: false,
        eatingProblems: false,
        headache: false,
        sinuses: false,
        previousTreatmentProblems: false,
        previousTreatmentProblemsReason: '',
        dentalObservations: '',
    })

    const getHealthQuestionnaire = async () => {
        setFetching(true)
        try {
            const res = await axiosWithToken.get(`${SERVER_URL}/api/healthQuestionnaire/getByPatientId?patientId=${patientId}`)
            if (res.data) {
                setHealthQuestionnaire(res.data)
            }
        } catch (error) {
            handleError(error)
        } finally {
            setFetching(false)
        }
    }

    useEffect(() => {
        if (patientId) getHealthQuestionnaire()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [patientId])

    const formik = useFormik({
        initialValues: {
            healthAlteration: heathQuestionnaire.healthAlteration,
            healthChange: heathQuestionnaire.healthChange,
            lastMedicalCheck: heathQuestionnaire.lastMedicalCheck,
            medicalAttention: heathQuestionnaire.medicalAttention,
            medicalAttentionReason: heathQuestionnaire.medicalAttentionReason,
            medicInformation: heathQuestionnaire.medicInformation,
            majorSurgery: heathQuestionnaire.majorSurgery,
            majorSurgeryReason: heathQuestionnaire.majorSurgeryReason,
            hospitalized: heathQuestionnaire.hospitalized,
            hospitalizedReason: heathQuestionnaire.hospitalizedReason,
            height: heathQuestionnaire.height,
            weight: heathQuestionnaire.weight,
            maxBloodPressure: heathQuestionnaire.maxBloodPressure,
            minBloodPressure: heathQuestionnaire.minBloodPressure,
            pulse: heathQuestionnaire.pulse,
            generalObservations: heathQuestionnaire.generalObservations || "S/P",
            heartAttacks: heathQuestionnaire.heartAttacks,
            rheumatic: heathQuestionnaire.rheumatic,
            chestPain: heathQuestionnaire.chestPain,
            breath: heathQuestionnaire.breath,
            ankle: heathQuestionnaire.ankle,
            pillow: heathQuestionnaire.pillow,
            pacemaker: heathQuestionnaire.pacemaker,
            bloodPressureProblems: heathQuestionnaire.bloodPressureProblems,
            hearthObservations: heathQuestionnaire.hearthObservations || "S/P",
            epilepsy: heathQuestionnaire.epilepsy,
            faints: heathQuestionnaire.faints,
            seizures: heathQuestionnaire.seizures,
            emotionalAlteration: heathQuestionnaire.emotionalAlteration,
            alterationsTreatment: heathQuestionnaire.alterationsTreatment,
            nervousObservations: heathQuestionnaire.nervousObservations || "S/P",
            cough: heathQuestionnaire.cough,
            tuberculosis: heathQuestionnaire.tuberculosis,
            familyTuberculosis: heathQuestionnaire.familyTuberculosis,
            sinusitis: heathQuestionnaire.sinusitis,
            asma: heathQuestionnaire.asma,
            breathObservations: heathQuestionnaire.breathObservations || "S/P",
            stomachUlcer: heathQuestionnaire.stomachUlcer,
            hepatitis: heathQuestionnaire.hepatitis,
            jaundice: heathQuestionnaire.jaundice,
            liver: heathQuestionnaire.liver,
            bloodVomit: heathQuestionnaire.bloodVomit,
            digestiveObservations: heathQuestionnaire.digestiveObservations || "S/P",
            diabetis: heathQuestionnaire.diabetis,
            familyDiabetis: heathQuestionnaire.familyDiabetis,
            urinate: heathQuestionnaire.urinate,
            thirst: heathQuestionnaire.thirst,
            hypothyroidism: heathQuestionnaire.hypothyroidism,
            hyperthyroidism: heathQuestionnaire.hyperthyroidism,
            endocrineObservations: heathQuestionnaire.endocrineObservations || "S/P",
            bloodProblems: heathQuestionnaire.bloodProblems,
            familyBloodProblems: heathQuestionnaire.familyBloodProblems,
            hemophiliac: heathQuestionnaire.hemophiliac,
            abnormalBlood: heathQuestionnaire.abnormalBlood,
            bloodTransfusion: heathQuestionnaire.bloodTransfusion,
            bloodObservation: heathQuestionnaire.bloodObservation || "S/P",
            anestheticsAlergy: heathQuestionnaire.anestheticsAlergy,
            antibioticsAlergy: heathQuestionnaire.antibioticsAlergy,
            barbituratesAlergy: heathQuestionnaire.barbituratesAlergy,
            analgesicsAlergy: heathQuestionnaire.analgesicsAlergy,
            asthma: heathQuestionnaire.asthma,
            skin: heathQuestionnaire.skin,
            alergyObservations: heathQuestionnaire.alergyObservations || "S/P",
            kidneyProblems: heathQuestionnaire.kidneyProblems,
            syphilis: heathQuestionnaire.syphilis,
            hiv: heathQuestionnaire.hiv,
            genitourinaryObservations: heathQuestionnaire.genitourinaryObservations || "S/P",
            tumors: heathQuestionnaire.tumors,
            quimio: heathQuestionnaire.quimio,
            xrays: heathQuestionnaire.xrays,
            neoplaciaObservations: heathQuestionnaire.neoplaciaObservations || "S/P",
            alcohol: heathQuestionnaire.alcohol,
            smoker: heathQuestionnaire.smoker,
            smokeTimes: heathQuestionnaire.smokeTimes,
            habitsObservations: heathQuestionnaire.habitsObservations || "S/P",
            antibiotics: heathQuestionnaire.antibiotics,
            anticoagulants: heathQuestionnaire.anticoagulants,
            bloodMedicines: heathQuestionnaire.bloodMedicines,
            tranquillizers: heathQuestionnaire.tranquillizers,
            hormones: heathQuestionnaire.hormones,
            aspirines: heathQuestionnaire.aspirines,
            bisphosphonates: heathQuestionnaire.bisphosphonates,
            otherMeds: heathQuestionnaire.otherMeds,
            midicineObservations: heathQuestionnaire.midicineObservations || "S/P",
            pregnant: heathQuestionnaire.pregnant,
            pregnantPosibilities: heathQuestionnaire.pregnantPosibilities,
            breastfeeding: heathQuestionnaire.breastfeeding,
            menstrual: heathQuestionnaire.menstrual,
            hormonalTreatment: heathQuestionnaire.hormonalTreatment,
            menstrualDisease: heathQuestionnaire.menstrualDisease,
            otherDiseases: heathQuestionnaire.otherDiseases,
            otherDiseasesReason: heathQuestionnaire.otherDiseasesReason,
            womanObservations: heathQuestionnaire.womanObservations || "S/P",
            mainDentalProblem: heathQuestionnaire.mainDentalProblem,
            pain: heathQuestionnaire.pain,
            dentalAspect: heathQuestionnaire.dentalAspect,
            eatingProblems: heathQuestionnaire.eatingProblems,
            headache: heathQuestionnaire.headache,
            sinuses: heathQuestionnaire.sinuses,
            previousTreatmentProblems: heathQuestionnaire.previousTreatmentProblems,
            previousTreatmentProblemsReason: heathQuestionnaire.previousTreatmentProblemsReason,
            dentalObservations: heathQuestionnaire.dentalObservations || "S/P",
        },
        enableReinitialize: true,
        onSubmit: async values => {
            setLoading(true)
            try {
                const healthQuestionnaireRequest = {
                    ...values,
                }

                const res = await axiosWithToken.put(`${SERVER_URL}/api/healthQuestionnaire/update?patientId=${patientId}`, healthQuestionnaireRequest)
                if (res.data) {
                    notifySuccess(res.data)
                    setDirtyForm(false)
                }
            } catch (error) {
                handleError(error)
            } finally {
                setLoading(false)
                setEdit(false)
            }
        },
    });

    const renderBooleanField = (id: keyof healthQuestionnaire, label: string) => (
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

    const renderTextAreaField = (id: keyof healthQuestionnaire, label: string) => (
        <Form.Group>
            <Form.Label className='text-light'>{label}</Form.Label>
            <Form.Control
                as="textarea"
                id={id}
                name={id}
                value={formik.values[id] as string}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!edit}
            />
        </Form.Group>
    );
    const renderTextField = (id: keyof healthQuestionnaire, label: string) => (
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
            <Form onSubmit={formik.handleSubmit} noValidate className="text-start" data-bs-theme="dark">
                <Row className="gap-1">
                    <Col xs={12} lg={6} className="">
                        <Row className="mb-3">
                            <h3 className="text-light text-start">Cuestionario de Salud</h3>
                            <hr />
                            {renderBooleanField('healthAlteration', '¿Tiene alguna alteración de la salud?')}
                            {renderBooleanField('healthChange', '¿Ha experimentado algun cambio en su salud el último año?')}
                            <Form.Group>
                                <Form.Label className='text-light'>¿Cuando fue su ultimo checkeo médico?</Form.Label>
                                <Form.Control
                                    type="date"
                                    id="lastMedicalCheck"
                                    name="lastMedicalCheck"
                                    value={formik.values.lastMedicalCheck}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    disabled={!edit}
                                />
                            </Form.Group>
                            {renderBooleanField('medicalAttention', '¿Está siendo atendido por algún médico?')}
                            {renderTextField('medicalAttentionReason', 'Si lo estuviera ¿Por que motivo?')}
                            {renderTextField('medicInformation', 'Nombre y teléfono de su médico.')}
                            {renderBooleanField('majorSurgery', '¿Ha sufrido alguna operación de gravedad?')}
                            {renderBooleanField('majorSurgeryReason', 'En caso afirmativo, explíquelo.')}
                            {renderBooleanField('hospitalized', '¿Ha sido hospitalizado o ha sufrido algun trastorno grave en los últimos 5 años?')}
                            {renderTextField('hospitalizedReason', 'En caso afirmativo, explíquelo.')}
                            <Form.Group>
                                <Form.Label className='text-light'>Estatura</Form.Label>
                                <Form.Control
                                    type="number"
                                    id="height"
                                    name="height"
                                    value={formik.values.height}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    disabled={!edit}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className='text-light'>Peso</Form.Label>
                                <Form.Control
                                    type="number"
                                    id="weight"
                                    name="weight"
                                    value={formik.values.weight}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    disabled={!edit}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className='text-light'>Presión arterial máxima</Form.Label>
                                <Form.Control
                                    type="number"
                                    id="maxBloodPressure"
                                    name="maxBloodPressure"
                                    value={formik.values.maxBloodPressure}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    disabled={!edit}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className='text-light'>Presión arterial mínima</Form.Label>
                                <Form.Control
                                    type="number"
                                    id="minBloodPressure"
                                    name="minBloodPressure"
                                    value={formik.values.minBloodPressure}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    disabled={!edit}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className='text-light'>Pulso</Form.Label>
                                <Form.Control
                                    type="number"
                                    id="pulse"
                                    name="pulse"
                                    value={formik.values.pulse}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    disabled={!edit}
                                />
                            </Form.Group>
                            {renderTextAreaField('generalObservations', 'Observaciones')}
                            <h3 className="text-light text-start mt-5">Aparato cardiovascular</h3>
                            <hr />
                            <p className="text-light">¿Tiene o ha tenido alguna vez...</p>
                            {renderBooleanField('heartAttacks', 'Ataques cardíacos, trombosis o embolias, insuficiencia coronaria, lesiones de válvulas cardíacas o cardiopatias congénitas?')}
                            {renderBooleanField('rheumatic', 'Cardiopatía reunmática o soplos al corazón?')}
                            {renderBooleanField('chestPain', 'Dolor torácico trs un esfuerzo?')}
                            {renderBooleanField('breath', 'Falta de aire tras un ejercicio leve?')}
                            {renderBooleanField('ankle', 'Hinchazón de tobillos?')}
                            <hr className="mt-3 mb-1" />
                            {renderBooleanField('pillow', '¿Usa de más de una almohada para dormir?')}
                            {renderBooleanField('pacemaker', '¿Usa marcapasos?')}
                            {renderBooleanField('bloodPressureProblems', '¿Tiene problemas de presión arterial?')}
                            {renderTextAreaField('hearthObservations', 'Observaciones')}
                            <h3 className="text-light text-start mt-5">Sistema nervioso central</h3>
                            <hr />
                            <p className="text-light">¿Tiene o ha tenido alguna vez...</p>
                            {renderBooleanField('epilepsy', 'Epilepsia?')}
                            {renderBooleanField('faints', 'Desmayos?')}
                            {renderBooleanField('seizures', 'Convulsiones?')}
                            {renderBooleanField('emotionalAlteration', 'Alteraciones emocionales?')}
                            <hr className="mt-3 mb-1" />
                            {renderBooleanField('alterationsTreatment', '¿Sigue algun tratamiento por alteraciones nerviosas?')}
                            {renderTextAreaField('nervousObservations', 'Observaciones')}
                            <h3 className="text-light text-start mt-5">Sistema respiratorio</h3>
                            <hr />
                            {renderBooleanField('cough', '¿Padece resfriado o tos habitual?')}
                            {renderBooleanField('tuberculosis', 'Tiene o ha tenido alguna vez tuberculosis?')}
                            {renderBooleanField('familyTuberculosis', '¿Hay antecedentes de tuberculosis en su familia?')}
                            {renderBooleanField('sinusitis', '¿Tiene sinusitis o problemas sinusales?')}
                            {renderBooleanField('asma', '¿Tiene bronquitis crónica o asma?')}
                            {renderTextAreaField('breathObservations', 'Observaciones')}
                            <h3 className="text-light text-start mt-5">Aparato digestivo</h3>
                            <hr />
                            {renderBooleanField('stomachUlcer', '¿Tiene alguna úlcera de estómago?')}
                            {renderBooleanField('hepatitis', '¿Tiene o ha tenido hepatitis?')}
                            {renderBooleanField('jaundice', '¿Tiene o ha tenido ictericia?')}
                            {renderBooleanField('liver', '¿Tiene o ha tenido enfermedades hepáticas?')}
                            {renderBooleanField('bloodVomit', '¿Ha vomitado sangre?')}
                            {renderTextAreaField('digestiveObservations', 'Observaciones')}
                            <h3 className="text-light text-start mt-5">Sistema endócrino</h3>
                            <hr />
                            {renderBooleanField('diabetis', '¿Padece diabetes?')}
                            {renderBooleanField('familyDiabetis', '¿Padece diabetes alguien en su familia?')}
                            {renderBooleanField('urinate', '¿Orina mas de seis veces al dia?')}
                            {renderBooleanField('thirst', '¿Siente sed muy a menudo o tiene sequedad en la boca?')}
                            {renderBooleanField('hypothyroidism', '¿Tiene hipotiroidismo?')}
                            {renderBooleanField('hyperthyroidism', '¿Tiene hipertiroidismo?')}
                            {renderTextAreaField('endocrineObservations', 'Observaciones')}
                            <h3 className="text-light text-start mt-5">Sistema hematopoyetico</h3>
                            <hr />
                            {renderBooleanField('bloodProblems', '¿Padece anemia, anemia hemolítica o trastornos sanguíneos?')}
                            {renderBooleanField('familyBloodProblems', '¿Tiene antecedentes familiares de alteraciones sanguíneas?')}
                            {renderBooleanField('hemophiliac', '¿Es usted hemofílico?')}
                            {renderBooleanField('abnormalBlood', '¿Ha sangrado anormalmente tras una operación o traumatismo?')}
                            {renderBooleanField('bloodTransfusion', '¿Ha recibido alguna vez una transfusión sanguínea?')}
                            {renderTextAreaField('bloodObservation', 'Observaciones')}
                            <h3 className="text-light text-start mt-5">Alergias</h3>
                            <hr />
                            <p className="text-light">¿Tiene alergia o reacciona adversamente a...</p>
                            {renderBooleanField('anestheticsAlergy', 'Anestésicos locales?')}
                            {renderBooleanField('antibioticsAlergy', 'Antibióticos, penicilinas o sulfamidas?')}
                            {renderBooleanField('barbituratesAlergy', 'Barbitúricos, sedantes o somniferos?')}
                            {renderBooleanField('analgesicsAlergy', 'Antiinflamatorios o analgésicos?')}
                            <hr className="mt-3 mb-1" />
                            {renderBooleanField('asthma', '¿Tiene asma?')}
                            {renderBooleanField('skin', '¿Tiene o ha tenido alguna vez ronchas o erupciones cutáneas?')}
                            {renderTextAreaField('alergyObservations', 'Observaciones')}
                            <h3 className="text-light text-start mt-5">Sistema genitourinario</h3>
                            <hr />
                            <p className="text-light">¿Tiene o ha tenido alguna vez...</p>
                            {renderBooleanField('kidneyProblems', 'Problemas de riñón?')}
                            {renderBooleanField('syphilis', 'Sífilis o gonorrea?')}
                            {renderBooleanField('hiv', 'SIDA (serología HIV positivo)?')}
                            {renderTextAreaField('genitourinaryObservations', 'Observaciones')}
                            <h3 className="text-light text-start mt-5">Neoplasias</h3>
                            <hr />
                            <p className="text-light">¿Tiene o ha tenido alguna vez...</p>
                            {renderBooleanField('tumors', 'Tumores o masa maligna?')}
                            {renderBooleanField('quimio', 'Quimioterapia o radioterapia?')}
                            <hr className="mt-3 mb-1" />
                            {renderBooleanField('xrays', '¿Está expuesto regularmente a rayos X u otra radiación ionizante o tóxica?')}
                            {renderTextAreaField('neoplaciaObservations', 'Observaciones')}
                            <h3 className="text-light text-start mt-5">Hábitos</h3>
                            <hr />
                            {renderBooleanField('alcohol', '¿Bebe alcohol?')}
                            {renderBooleanField('smoker', '¿Fuma?')}
                            {renderTextField('smokeTimes', '¿Cuantos cigarrillos al dia?')}
                            {renderTextAreaField('habitsObservations', 'Observaciones')}
                            <h3 className="text-light text-start mt-5">Medicamentos</h3>
                            <hr />
                            <p className="text-light">¿Está tomando alguno de los siguientes medicamentos?</p>
                            {renderBooleanField('antibiotics', 'Antibióticos')}
                            {renderBooleanField('anticoagulants', 'Anticoagulantes')}
                            {renderBooleanField('bloodMedicines', 'Medicamentos para la hipertensión arterial')}
                            {renderBooleanField('tranquillizers', 'Tranquilizantes')}
                            {renderBooleanField('hormones', 'Hormonas')}
                            {renderBooleanField('aspirines', 'Aspirinas')}
                            {renderBooleanField('bisphosphonates', 'Medicamentos recetados para el control de la osteoporosis (bifosfonatos)')}
                            {renderTextField('otherMeds', 'Otros')}
                            {renderTextAreaField('midicineObservations', 'Observaciones')}
                            <h3 className="text-light text-start mt-5">Mujeres</h3>
                            <hr />
                            {renderBooleanField('pregnant', '¿Está embarajada?')}
                            {renderBooleanField('pregnantPosibilities', '¿Cree que puede estarlo?')}
                            {renderBooleanField('breastfeeding', '¿Está dando el pecho?')}
                            {renderBooleanField('menstrual', '¿Tiene algún problema relacionado con su ciclo menstrual?')}
                            {renderBooleanField('hormonalTreatment', '¿Está tomando anticonceptivos o realizando algún tratamiento hormonal?')}
                            {renderBooleanField('menstrualDisease', '¿Se ha retirado definitivamente su periodo menstrual?')}
                            {renderBooleanField('otherDiseases', '¿Padece alguna enfermedad, alteración o problema que no hayamos enumedaro y que crea que deberiamos conocer?')}
                            {renderTextField('otherDiseasesReason', 'En caso afirmativo explíquelo')}
                            {renderTextAreaField('womanObservations', 'Observaciones')}
                            <h3 className="text-light text-start mt-5">Cuestionario odontológico</h3>
                            <hr />
                            {renderTextField('mainDentalProblem', '¿Cual es su principal problema dental o motivo de consulta?')}
                            {renderBooleanField('pain', '¿Siente alguna molestia o dolor en este momento?')}
                            {renderBooleanField('dentalAspect', '¿Se siente insatisfecho con el aspecto de sus dientes?')}
                            {renderBooleanField('eatingProblems', '¿Tiene alguna dificultad para comer y masticar los alimentos?')}
                            {renderBooleanField('headache', '¿Padece dolores de cabeza, de oídos o cuello?')}
                            {renderBooleanField('sinuses', '¿Padece con frecuencia problemas de senos paranasales?')}
                            {renderBooleanField('previousTreatmentProblems', '¿Ha tenido algún problema relacionado con algún tratamiento anterior?')}
                            {renderTextField('previousTreatmentProblemsReason', 'En caso afirmativo explíquelo')}
                            {renderTextAreaField('dentalObservations', 'Observaciones')}
                        </Row>
                    </Col>
                </Row>
            </Form>
        </div> :
            <Spinner></Spinner>
    );
};

export default PatientMedicalQuestionnaire