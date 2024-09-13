import "./PatientOdontogram.css"
import { useState } from "react";
import type { Odontogram, Quadrant, ToothType } from "../../../types";
import OdontogramChart from "../../Odontogram/Odontogram";
import { Col, Form, Row } from "react-bootstrap";
import { treatmentCodes } from "../../../utils/codes";

const PatientOdontogram = () => {

    const treatments = treatmentCodes
    const [selectedPiece, setSelectedPiece] = useState<number | undefined>()
    const [selectedSides, setSelectedSides] = useState<string>("")

    function createEmptyTooth(): ToothType {
        return {
            left: "",
            top: "",
            right: "",
            bot: "",
            center: "",
        };
    }

    const [odontogram, setOdontogram] = useState<Odontogram>({
        left: {
            top1: new Map([
                [18, createEmptyTooth()],
                [17, createEmptyTooth()],
                [16, createEmptyTooth()],
                [15, createEmptyTooth()],
                [14, createEmptyTooth()],
                [13, createEmptyTooth()],
                [12, createEmptyTooth()],
                [11, createEmptyTooth()],
            ]),
            top2: new Map([
                [55, createEmptyTooth()],
                [54, createEmptyTooth()],
                [53, createEmptyTooth()],
                [52, createEmptyTooth()],
                [51, createEmptyTooth()],
            ]),
            bottom1: new Map([
                [48, createEmptyTooth()],
                [47, createEmptyTooth()],
                [46, createEmptyTooth()],
                [45, createEmptyTooth()],
                [44, createEmptyTooth()],
                [43, createEmptyTooth()],
                [42, createEmptyTooth()],
                [41, createEmptyTooth()],
            ]),
            bottom2: new Map([
                [85, createEmptyTooth()],
                [84, createEmptyTooth()],
                [83, createEmptyTooth()],
                [82, createEmptyTooth()],
                [81, createEmptyTooth()],
            ])
        },
        right: {
            top1: new Map([
                [21, createEmptyTooth()],
                [22, createEmptyTooth()],
                [23, createEmptyTooth()],
                [24, createEmptyTooth()],
                [25, createEmptyTooth()],
                [26, createEmptyTooth()],
                [27, createEmptyTooth()],
                [28, createEmptyTooth()],
            ]),
            top2: new Map([
                [61, createEmptyTooth()],
                [62, createEmptyTooth()],
                [63, createEmptyTooth()],
                [64, createEmptyTooth()],
                [65, createEmptyTooth()],
            ]),
            bottom1: new Map([
                [31, createEmptyTooth()],
                [32, createEmptyTooth()],
                [33, createEmptyTooth()],
                [34, createEmptyTooth()],
                [35, createEmptyTooth()],
                [36, createEmptyTooth()],
                [37, createEmptyTooth()],
                [38, createEmptyTooth()],
            ]),
            bottom2: new Map([
                [71, createEmptyTooth()],
                [72, createEmptyTooth()],
                [73, createEmptyTooth()],
                [74, createEmptyTooth()],
                [75, createEmptyTooth()],
            ])
        }
    });

    const handleAction = <T extends keyof Quadrant>(
        side: keyof Odontogram,
        section: T,
        toothNumber: number,
        selectedPart: keyof ToothType,
        action: string
    ) => {
        setOdontogram((prevOdontogram) => {
            const quadrantMap = prevOdontogram[side][section];
            const newQuadrantMap = new Map(quadrantMap);
            let currentTooth: ToothType = newQuadrantMap.get(toothNumber);
            if (action === "clean") {
                currentTooth = {
                    left: "",
                    top: "",
                    right: "",
                    bot: "",
                    center: "",
                }
            } else {
                currentTooth[selectedPart] = action
            }
            newQuadrantMap.set(toothNumber, currentTooth);
            return {
                ...prevOdontogram,
                [side]: {
                    ...prevOdontogram[side],
                    [section]: newQuadrantMap,
                },
            };
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

    return (
        <div>
            <div>
                <Form>
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
                                    value={selectedPiece}
                                    onChange={(e) => setSelectedPiece(parseInt(e.target.value))}
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
                    </Row>
                </Form>
            </div >
            <hr />
            <OdontogramChart odontogram={odontogram} handleAction={handleAction}></OdontogramChart>
            <hr className="mb-5" />
            <div>
                holi
            </div>
        </div >
    );
}

export default PatientOdontogram