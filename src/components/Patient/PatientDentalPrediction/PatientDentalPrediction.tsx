import { useEffect, useState } from "react"
import { useRecoilState } from "recoil"
import { formState, userState } from "../../../app/store"
import { notifyError, notifySuccess } from "../../Toaster/Toaster"
import { useFormik } from "formik"
import { axiosWithToken } from "../../../utils/axiosInstances"
import handleError from "../../../utils/HandleErrors"
import { Form, Spinner, Table } from "react-bootstrap"
import type { DentalPrediction } from "../../../types"
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface PatientDentalPredictionProps {
    patientId: number
    inChargeOfId: number,
}

const PatientDentalPrediction: React.FC<PatientDentalPredictionProps> = ({ patientId, inChargeOfId }) => {

    const [loading, setLoading] = useState<boolean>(false)
    const [uploading, setUploading] = useState<boolean>(false)
    const [edit, setEdit] = useState<boolean>(false)
    const [user, setUser] = useRecoilState(userState)
    const [dirtyForm, setDirtyForm] = useRecoilState(formState)
    const [dentalPrediction, setDentalPrediction] = useState<DentalPrediction>({
        top: new Map([
            ["18", ""],
            ["17", ""],
            ["16", ""],
            ["15", ""],
            ["14", ""],
            ["13", ""],
            ["12", ""],
            ["11", ""],
            ["21", ""],
            ["22", ""],
            ["23", ""],
            ["24", ""],
            ["25", ""],
            ["26", ""],
            ["27", ""],
            ["28", ""]
        ]),
        bottom: new Map([
            ["48", ""],
            ["47", ""],
            ["46", ""],
            ["45", ""],
            ["44", ""],
            ["43", ""],
            ["42", ""],
            ["41", ""],
            ["31", ""],
            ["32", ""],
            ["33", ""],
            ["34", ""],
            ["35", ""],
            ["36", ""],
            ["37", ""],
            ["38", ""]
        ])
    })
    const [resetDentalPrediction, setResetDentalPrediction] = useState<DentalPrediction>(dentalPrediction)

    const getDentalPrediction = async () => {
        setLoading(true)
        try {
            const res = await axiosWithToken.get<DentalPrediction>(`${SERVER_URL}/api/dentalPrediction/getByPatientId?patientId=${patientId}`)
            if (res.data) {
                const topMap = new Map(Object.entries(res.data.top))
                const bottomMap = new Map(Object.entries(res.data.bottom))
                if (topMap.size > 0 && bottomMap.size > 0) {
                    setDentalPrediction({
                        top: topMap,
                        bottom: bottomMap
                    })
                    setResetDentalPrediction({
                        top: topMap,
                        bottom: bottomMap
                    })
                }
            }
        } catch (error) {
            handleError(error)
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (allowed: boolean) => {
        if (!allowed) notifyError("Solo el profesional a cargo puede editar.")
        else {
            setDirtyForm(true)
            setEdit(!edit)
        }
    }

    const handleChange = (key: string, value: string, map: 'top' | 'bottom') => {
        setDentalPrediction(prevState => {
            const newMap = new Map(prevState[map])
            newMap.set(key, value)
            return {
                ...prevState,
                [map]: newMap
            };
        });
    };

    const mapToObject = (map: Map<string, string>) => {
        const obj: { [key: string]: string } = {}
        map.forEach((value, key) => {
            obj[key] = value
        });
        return obj;
    };

    const formik = useFormik({
        initialValues: {
            resetDentalPrediction
        },
        enableReinitialize: true,
        onSubmit: async values => {
            setUploading(true)
            const newDentalPrediction = {
                top: mapToObject(dentalPrediction.top),
                bottom: mapToObject(dentalPrediction.bottom),
            };
            try {
                const res = await axiosWithToken.put(`${SERVER_URL}/api/dentalPrediction/update?patientId=${patientId}`, newDentalPrediction)
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

    const resetForm = () => {
            setDentalPrediction(resetDentalPrediction)
            setDirtyForm(false)
            setUploading(false)
            setEdit(false)
    }

    useEffect(() => {
        if (patientId) getDentalPrediction()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [patientId])

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
            <Form>
                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            <th>Pronóstico</th>
                            {Array.from(dentalPrediction.top.keys()).map((piece) => (
                                <th>{piece}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Sin posibilidad de tratamiento</td>
                            {Array.from(dentalPrediction.top.entries()).map(([key, value], index) => (
                                <td>
                                    <Form.Check
                                        inline
                                        name={key.toString()}
                                        type="radio"
                                        id={index.toString()}
                                        checked={value === "Sin"}
                                        disabled={!edit}
                                        onChange={() => handleChange(key, 'Sin', 'top')}
                                    />
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td>Bueno</td>
                            {Array.from(dentalPrediction.top.entries()).map(([key, value], index) => (
                                <td>
                                    <Form.Check
                                        inline
                                        name={key.toString()}
                                        type="radio"
                                        id={index.toString()}
                                        checked={value === "Bueno"}
                                        disabled={!edit}
                                        onChange={() => handleChange(key, 'Bueno', 'top')}
                                    />
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td>Dudoso</td>
                            {Array.from(dentalPrediction.top.entries()).map(([key, value], index) => (
                                <td>
                                    <Form.Check
                                        inline
                                        name={key.toString()}
                                        type="radio"
                                        id={index.toString()}
                                        checked={value === "Dudoso"}
                                        disabled={!edit}
                                        onChange={() => handleChange(key, 'Dudoso', 'top')}
                                    />
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td>Ausente</td>
                            {Array.from(dentalPrediction.top.entries()).map(([key, value], index) => (
                                <td>
                                    <Form.Check
                                        inline
                                        name={key.toString()}
                                        type="radio"
                                        id={index.toString()}
                                        checked={value === "Ausente"}
                                        disabled={!edit}
                                        onChange={() => handleChange(key, 'Ausente', 'top')}
                                    />
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </Table>
                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            <th>Pronóstico</th>
                            {Array.from(dentalPrediction.bottom.keys()).map((piece) => (
                                <th>{piece}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Sin posibilidad de tratamiento</td>
                            {Array.from(dentalPrediction.bottom.entries()).map(([key, value], index) => (
                                <td>
                                    <Form.Check
                                        inline
                                        name={key.toString()}
                                        type="radio"
                                        id={index.toString()}
                                        checked={value === "Sin"}
                                        disabled={!edit}
                                        onChange={() => handleChange(key, 'Sin', 'bottom')}
                                    />
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td>Bueno</td>
                            {Array.from(dentalPrediction.bottom.entries()).map(([key, value], index) => (
                                <td>
                                    <Form.Check
                                        inline
                                        name={key.toString()}
                                        type="radio"
                                        id={index.toString()}
                                        checked={value === "Bueno"}
                                        disabled={!edit}
                                        onChange={() => handleChange(key, 'Bueno', 'bottom')}
                                    />
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td>Dudoso</td>
                            {Array.from(dentalPrediction.bottom.entries()).map(([key, value], index) => (
                                <td>
                                    <Form.Check
                                        inline
                                        name={key.toString()}
                                        type="radio"
                                        id={index.toString()}
                                        checked={value === "Dudoso"}
                                        disabled={!edit}
                                        onChange={() => handleChange(key, 'Dudoso', 'bottom')}
                                    />
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td>Ausente</td>
                            {Array.from(dentalPrediction.bottom.entries()).map(([key, value], index) => (
                                <td>
                                    <Form.Check
                                        inline
                                        name={key.toString()}
                                        type="radio"
                                        id={index.toString()}
                                        checked={value === "Ausente"}
                                        disabled={!edit}
                                        onChange={() => handleChange(key, 'Ausente', 'bottom')}
                                    />
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </Table>
            </Form>
        </div> :
            <div className="position-relative d-flex flex-column justify-content-center align-items-center">
                <Spinner></Spinner>
            </div>
    )
}

export default PatientDentalPrediction