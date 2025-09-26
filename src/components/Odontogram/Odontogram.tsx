import type { Odontogram, ToothType } from "../../types";
import Tooth from "../Tooth/Tooth";

interface OdontogramChartProps {
    odontogram: Odontogram;
}

const OdontogramChart: React.FC<OdontogramChartProps> = ({ odontogram }) => {

    function createEmptyTooth(): ToothType {
        return {
            D: "",
            V: "",
            M: "",
            L: "",
            O: "",
        };
    }

    const sortedOdontogram = {
            left: {
                top1: new Map([
                    [18, odontogram.teeth.get(18) || createEmptyTooth()],
                    [17, odontogram.teeth.get(17) || createEmptyTooth()],
                    [16, odontogram.teeth.get(16) || createEmptyTooth()],
                    [15, odontogram.teeth.get(15) || createEmptyTooth()],
                    [14, odontogram.teeth.get(14) || createEmptyTooth()],
                    [13, odontogram.teeth.get(13) || createEmptyTooth()],
                    [12, odontogram.teeth.get(12) || createEmptyTooth()],
                    [11, odontogram.teeth.get(11) || createEmptyTooth()],
                ]),
                top2: new Map([
                    [55, odontogram.teeth.get(55) || createEmptyTooth()],
                    [54, odontogram.teeth.get(54) || createEmptyTooth()],
                    [53, odontogram.teeth.get(53) || createEmptyTooth()],
                    [52, odontogram.teeth.get(52) || createEmptyTooth()],
                    [51, odontogram.teeth.get(51) || createEmptyTooth()],
                ]),
                bottom1: new Map([
                    [48, odontogram.teeth.get(48) || createEmptyTooth()],
                    [47, odontogram.teeth.get(47) || createEmptyTooth()],
                    [46, odontogram.teeth.get(46) || createEmptyTooth()],
                    [45, odontogram.teeth.get(45) || createEmptyTooth()],
                    [44, odontogram.teeth.get(44) || createEmptyTooth()],
                    [43, odontogram.teeth.get(43) || createEmptyTooth()],
                    [42, odontogram.teeth.get(42) || createEmptyTooth()],
                    [41, odontogram.teeth.get(41) || createEmptyTooth()],
                ]),
                bottom2: new Map([
                    [85, odontogram.teeth.get(85) || createEmptyTooth()],
                    [84, odontogram.teeth.get(84) || createEmptyTooth()],
                    [83, odontogram.teeth.get(83) || createEmptyTooth()],
                    [82, odontogram.teeth.get(82) || createEmptyTooth()],
                    [81, odontogram.teeth.get(81) || createEmptyTooth()],
                ])
            },
            right: {
                top1: new Map([
                    [21, odontogram.teeth.get(21) || createEmptyTooth()],
                    [22, odontogram.teeth.get(22) || createEmptyTooth()],
                    [23, odontogram.teeth.get(23) || createEmptyTooth()],
                    [24, odontogram.teeth.get(24) || createEmptyTooth()],
                    [25, odontogram.teeth.get(25) || createEmptyTooth()],
                    [26, odontogram.teeth.get(26) || createEmptyTooth()],
                    [27, odontogram.teeth.get(27) || createEmptyTooth()],
                    [28, odontogram.teeth.get(28) || createEmptyTooth()],
                ]),
                top2: new Map([
                    [61, odontogram.teeth.get(61) || createEmptyTooth()],
                    [62, odontogram.teeth.get(62) || createEmptyTooth()],
                    [63, odontogram.teeth.get(63) || createEmptyTooth()],
                    [64, odontogram.teeth.get(64) || createEmptyTooth()],
                    [65, odontogram.teeth.get(65) || createEmptyTooth()],
                ]),
                bottom1: new Map([
                    [31, odontogram.teeth.get(31) || createEmptyTooth()],
                    [32, odontogram.teeth.get(32) || createEmptyTooth()],
                    [33, odontogram.teeth.get(33) || createEmptyTooth()],
                    [34, odontogram.teeth.get(34) || createEmptyTooth()],
                    [35, odontogram.teeth.get(35) || createEmptyTooth()],
                    [36, odontogram.teeth.get(36) || createEmptyTooth()],
                    [37, odontogram.teeth.get(37) || createEmptyTooth()],
                    [38, odontogram.teeth.get(38) || createEmptyTooth()],
                ]),
                bottom2: new Map([
                    [71, odontogram.teeth.get(71) || createEmptyTooth()],
                    [72, odontogram.teeth.get(72) || createEmptyTooth()],
                    [73, odontogram.teeth.get(73) || createEmptyTooth()],
                    [74, odontogram.teeth.get(74) || createEmptyTooth()],
                    [75, odontogram.teeth.get(75) || createEmptyTooth()],
                ])
            }
        };

    return (
        <div className="d-flex flex-row justify-content-around gap-2">
            <div className="d-flex flex-column align-items-end">
                <div className="d-flex flex-row gap-1">
                    {Array.from(sortedOdontogram.left.top1.entries()).map(([key, value], index) => (
                        <Tooth number={key} status={value} key={index}></Tooth>
                    ))}
                </div>
                <div className="d-flex flex-row gap-1">
                    {Array.from(sortedOdontogram.left.top2.entries()).map(([key, value], index) => (
                        <Tooth number={key} status={value} key={index}></Tooth>
                    ))}
                </div>
                <div className="d-flex flex-column align-items-end">
                    <div className="d-flex flex-row gap-1">
                        {Array.from(sortedOdontogram.left.bottom2.entries()).map(([key, value], index) => (
                            <Tooth number={key} status={value} key={index}></Tooth>
                        ))}
                    </div>
                    <div className="d-flex flex-row gap-1">
                        {Array.from(sortedOdontogram.left.bottom1.entries()).map(([key, value], index) => (
                            <Tooth number={key} status={value} key={index}></Tooth>
                        ))}
                    </div>
                </div>
            </div>
            <div>
                <div className="d-flex flex-row gap-1">
                    {Array.from(sortedOdontogram.right.top1.entries()).map(([key, value], index) => (
                        <Tooth number={key} status={value} key={index}></Tooth>
                    ))}
                </div>
                <div className="d-flex flex-row gap-1">
                    {Array.from(sortedOdontogram.right.top2.entries()).map(([key, value], index) => (
                        <Tooth number={key} status={value} key={index}></Tooth>
                    ))}
                </div>
                <div>
                    <div className="d-flex flex-row gap-1">
                        {Array.from(sortedOdontogram.right.bottom2.entries()).map(([key, value], index) => (
                            <Tooth number={key} status={value} key={index}></Tooth>
                        ))}
                    </div>
                    <div className="d-flex flex-row gap-1">
                        {Array.from(sortedOdontogram.right.bottom1.entries()).map(([key, value], index) => (
                            <Tooth number={key} status={value} key={index}></Tooth>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OdontogramChart