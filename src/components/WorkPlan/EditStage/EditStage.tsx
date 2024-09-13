import { useState } from "react";
import type { WorkPlan } from "../../../types";
import { notifySuccess } from "../../Toaster/Toaster";
import handleError from "../../../utils/HandleErrors";
import { axiosWithToken } from "../../../utils/axiosInstances";
import { useFormik } from "formik";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { useRecoilState } from "recoil";
import { modalState } from "../../../app/store";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface EditStageProps {
    patientId: number
    workPlanId: number
    stages: string[]
    stageIndex: number
    updateList: () => void
}

const EditStage: React.FC<EditStageProps> = ({ patientId, workPlanId, stages, stageIndex, updateList }) => {

    const [loading, setLoading] = useState<boolean>(false)
    const [show, setShow] = useRecoilState(modalState)

    const validate = (values: any) => {
        const errors: any = {};

        if (!values.stage) {
            errors.stage = 'Ingrese una descripción';
        }
        return errors;
    };

    const formik = useFormik({
        initialValues: {
            stage: stages[stageIndex]
        },
        validate,
        enableReinitialize: true,
        onSubmit: async values => {
            setLoading(true)
            stages[stageIndex] = values.stage
            
            const workPlanRequestDto = {
                patientId: patientId,
                stages: stages
            }
            try {
                const res = await axiosWithToken.put(`${SERVER_URL}/api/workPlan/updateStage?id=${workPlanId}`, workPlanRequestDto)
                notifySuccess(res.data)
                updateList()
            } catch (error: any) {
                handleError(error)
            } finally {
                setLoading(false)
                setShow(false)
            }
        },
    });

    const resetForm = () => {
        formik.resetForm();
        setShow(false)
    }

    return (
        <div>
            <Form onSubmit={formik.handleSubmit} noValidate>
                <Row className="mb-2">
                    <Form.Group className='text-light' as={Col} xs={12} lg={12}>
                        <Form.Label >Descripción</Form.Label>
                        <Form.Control type="text"
                            id="stage"
                            name="stage"
                            value={formik.values.stage}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={!!(formik.touched.stage && formik.errors.stage)}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.stage}</Form.Control.Feedback>
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
                                    Guardar
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

export default EditStage