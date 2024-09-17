import "./PatientOdontogram.css"
import { ReactEventHandler, useState } from "react";
import type { Odontogram, ToothType } from "../../../types";
import OdontogramChart from "../../Odontogram/Odontogram";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { treatmentCodes } from "../../../utils/codes";
import { notifyError } from "../../Toaster/Toaster";

const PatientOdontogram = () => {

    const treatments = treatmentCodes
    const [selectedPiece, setSelectedPiece] = useState<number | undefined>()
    const [selectedSides, setSelectedSides] = useState<string>("")
    const [selectedStatus, setSelectedStatus] = useState<string>("Pendiente")

    function createEmptyTooth(): ToothType {
        return {
            D: "",
            V: "",
            M: "",
            L: "",
            O: "",
        };
    }

    const [odontogram, setOdontogram] = useState<Odontogram>({
        teeth: new Map([
            [18, createEmptyTooth()],
            [17, createEmptyTooth()],
            [16, createEmptyTooth()],
            [15, createEmptyTooth()],
            [14, createEmptyTooth()],
            [13, createEmptyTooth()],
            [12, createEmptyTooth()],
            [11, createEmptyTooth()],
            [55, createEmptyTooth()],
            [54, createEmptyTooth()],
            [53, createEmptyTooth()],
            [52, createEmptyTooth()],
            [51, createEmptyTooth()],
            [48, createEmptyTooth()],
            [47, createEmptyTooth()],
            [46, createEmptyTooth()],
            [45, createEmptyTooth()],
            [44, createEmptyTooth()],
            [43, createEmptyTooth()],
            [42, createEmptyTooth()],
            [41, createEmptyTooth()],
            [85, createEmptyTooth()],
            [84, createEmptyTooth()],
            [83, createEmptyTooth()],
            [82, createEmptyTooth()],
            [81, createEmptyTooth()],
            [21, createEmptyTooth()],
            [22, createEmptyTooth()],
            [23, createEmptyTooth()],
            [24, createEmptyTooth()],
            [25, createEmptyTooth()],
            [26, createEmptyTooth()],
            [27, createEmptyTooth()],
            [28, createEmptyTooth()],
            [61, createEmptyTooth()],
            [62, createEmptyTooth()],
            [63, createEmptyTooth()],
            [64, createEmptyTooth()],
            [65, createEmptyTooth()],
            [31, createEmptyTooth()],
            [32, createEmptyTooth()],
            [33, createEmptyTooth()],
            [34, createEmptyTooth()],
            [35, createEmptyTooth()],
            [36, createEmptyTooth()],
            [37, createEmptyTooth()],
            [38, createEmptyTooth()],
            [71, createEmptyTooth()],
            [72, createEmptyTooth()],
            [73, createEmptyTooth()],
            [74, createEmptyTooth()],
            [75, createEmptyTooth()],
        ]),
        treatments: []
    }
    );

    const handleAction = (
        toothNumber: number,
        faces: string,
        description: string,
        status: string
    ) => {
        setOdontogram((prevOdontogram) => {
            try {
                const newTeethMap = new Map(prevOdontogram.teeth);
                const currentTooth = newTeethMap.get(toothNumber);
                let treatment = ""
                if (!currentTooth) {
                    throw new Error(`El diente con número ${toothNumber} no existe en el odontograma.`);
                }
                if (description === "clean") {
                    currentTooth.D = "";
                    currentTooth.V = "";
                    currentTooth.M = "";
                    currentTooth.L = "";
                    currentTooth.O = "";
                } else {
                    switch (true) {
                        case description.toLocaleLowerCase().includes("extracción"):
                            treatment = "Extracción"
                            faces = "O"
                            break
                        case description.toLocaleLowerCase().includes("corona"):
                            treatment = "Corona"
                            faces = "O"
                            break
                        case description.toLocaleLowerCase().includes("perno"):
                            treatment = "Perno"
                            faces = "O"
                            break
                        default:
                            treatment = "General"
                    }
                    const selectedFaces = faces.split("");
                    selectedFaces.forEach((face) => {
                        if (["D", "V", "M", "L", "O"].includes(face.toUpperCase())) {
                            currentTooth[face.toUpperCase() as keyof ToothType] = `${status}-${treatment}`;
                        } else {
                            throw new Error(`Se seleccionó una cara incorrecta`);
                        }
                    });
                }
                newTeethMap.set(toothNumber, currentTooth);
                const newTreatments = [...prevOdontogram.treatments, {
                    code: selectedCode,
                    description: description,
                    piece: selectedPiece,
                    faces: selectedSides,
                    status: selectedStatus,
                }]
                setSelectedCode("")
                setSelectedPiece(undefined)
                setSelectedSides("")
                setSelectedStatus("Pendiente")
                setDescription("")
                return {
                    teeth: newTeethMap,
                    treatments: newTreatments
                };

            } catch (error: any) {
                notifyError(error.message)
                return prevOdontogram
            }
        });

    };

    const [selectedCode, setSelectedCode] = useState('');
    const [description, setDescription] = useState('');

    const handleSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selected = event.target.value
        setSelectedCode(selected);

        if (treatments[selected]) {
            setDescription(treatments[selected]);
        } else {
            setDescription('');
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        handleAction(selectedPiece || 0, selectedSides, description, selectedStatus)
    }


    return (
        <div className="mb-3">
            <div className="mb-3">
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col xs={12} lg={2}>
                            <label className="text-light" htmlFor="treatmentCode">Código</label>
                            <input
                                className="form-control"
                                list="treatmentCodes"
                                id="treatmentCode"
                                value={selectedCode}
                                onChange={handleSelect}
                                placeholder="Ingrese el código"
                            />
                            <datalist id="treatmentCodes">
                                {Object.keys(treatments).map((code) => (
                                    <option key={code} value={code} />
                                ))}
                            </datalist>
                        </Col>
                        <Col xs={12} lg={4}>
                            <label className="text-light" htmlFor="treatmentDescription">Descripción</label>
                            <input
                                className="form-control"
                                type="text"
                                id="treatmentDescription"
                                value={description}
                                readOnly
                            />
                        </Col>
                        <Col xs={12} lg={1}>
                            <Form.Group>
                                <Form.Label className="m-0 text-light">Pieza</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={selectedPiece !== undefined ? selectedPiece : ""}
                                    onChange={(e) => setSelectedPiece(Number(e.target.value))}
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} lg={1}>
                            <Form.Group>
                                <Form.Label className="m-0 text-light">Caras</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedSides.toUpperCase()}
                                    onChange={(e) => setSelectedSides(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} lg={2}>
                            <Form.Group>
                                <Form.Label className="text-light m-0">Estado</Form.Label>
                                <Form.Select
                                    id="brushFrequency"
                                    name="brushFrequency"
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                >
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="Realizado">Realizado</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col xs={12} lg={2} className="d-flex align-items-end">
                            <Button type="submit">
                                Agregar
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </div >
            <hr />
            <OdontogramChart odontogram={odontogram}></OdontogramChart>
            <hr className="mb-5" />
            <div className="mb-3">
                <Table variant="dark" className="mb-3">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th className=''>Descripción</th>
                            <th>Pieza</th>
                            <th>Caras</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {odontogram.treatments.map((treatment, index) => <tr key={index}>
                            <td>{treatment.code}</td>
                            <td>{treatment.description}</td>
                            <td>{treatment.piece}</td>
                            <td>{treatment.faces.toUpperCase()}</td>
                            <td>{treatment.status}</td>
                        </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </div >
    );
}

export default PatientOdontogram