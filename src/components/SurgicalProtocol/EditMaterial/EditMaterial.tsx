import { useRecoilState } from "recoil"
import { modalState } from "../../../app/store"
import type { Material } from "../../../types"
import { Button, Col, Form, Row, Spinner } from "react-bootstrap"
import { useFormik } from "formik"
import { useState } from "react"

interface EditMaterialProps {
    materials: Material[]
    index:number
}


const EditMaterial: React.FC<EditMaterialProps> = ({ materials, index }) => {

    const [show, setShow] = useRecoilState(modalState)
    const [loading, setLoading] = useState<boolean>(false)

    const validate = (values: Material): Material => {
        const errors: any = {};

        if (!values.grafting) {
            errors.grafting = 'Ingrese el injerto';
        }
        if (!values.autologue) {
            errors.autologue = 'Ingrese la zona dadora de autólogo';
        }
        return errors;
    };

    const formik = useFormik({
        initialValues: {
            grafting: materials[index].grafting,
            autologue: materials[index].autologue
        },
        validate,
        enableReinitialize: true,
        onSubmit: async values => {
            materials[index] = values
            setShow(false)
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
                        <Form.Label >Injerto</Form.Label>
                        <Form.Control type="text"
                            placeholder="Injerto"
                            id="grafting"
                            name="grafting"
                            value={formik.values.grafting}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={!!(formik.touched.grafting && formik.errors.grafting)}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.grafting}</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group as={Col} xs={12} lg={12}>
                        <Form.Label className='text-light'>Zona dadora de autólogo</Form.Label>
                        <Form.Control type="text" placeholder="Zona dadora de autólogo"
                            id="autologue"
                            name="autologue"
                            value={formik.values.autologue}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={!!(formik.touched.autologue && formik.errors.autologue)}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.autologue}</Form.Control.Feedback>
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

export default EditMaterial