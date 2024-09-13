import "./Tooth.css";
import { Dropdown, DropdownButton, ListGroup } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import type { Odontogram, ToothType } from "../../types";

interface ToothProps<T extends keyof Odontogram> {
    side: T;
    section: keyof (Odontogram[T]);
    number: number;
    status: ToothType;
    onAction: (side: T, section: keyof (Odontogram[T]), number: number, part: keyof ToothType, action: string) => void;
}

const Tooth = <T extends keyof Odontogram>({ side, section, number, status, onAction }: ToothProps<T>) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [selectedPart, setSelectedPart] = useState<keyof ToothType | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleClick = (part: keyof ToothType, event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        setSelectedPart(part);

        const { clientX: x, clientY: y } = event;

        const menuWidth = 150;
        const menuHeight = 100;

        let menuX = x;
        let menuY = y;

        if (x + menuWidth > window.innerWidth) {
            menuX = window.innerWidth - menuWidth - 10;
        }

        if (y + menuHeight > window.innerHeight) {
            menuY = window.innerHeight - menuHeight - 10;
        }

        setMenuPosition({ top: menuY, left: menuX });
        setMenuVisible(true);
    };

    const handleOptionSelect = (option: string) => {
        if (selectedPart) {
            onAction(side, section, number, selectedPart, option);
        }
        setMenuVisible(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuVisible(false);
            }
        };

        const handleEscPress = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setMenuVisible(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        document.addEventListener('keydown', handleEscPress);

        return () => {
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('keydown', handleEscPress);
        };
    }, []);

    switch (true) {
        case (number <= 30):
            return (
                <div>
                    <div>
                        <img style={{ height: "80px" }} src={`/images/teeth/${number}.png`} alt="" />
                        <div className="tooth bg-light position-relative" onClick={(e) => e.stopPropagation()}>
                            <img className="position-absolute top-0 start-0" src="/images/teeth.png" alt="" />
                            <div className={`left ${status.left}`} onClick={(e) => handleClick("left", e)} />
                            <div className={`top ${status.top}`} onClick={(e) => handleClick("top", e)} />
                            <div className={`right ${status.right}`} onClick={(e) => handleClick("right", e)} />
                            <div className={`bot ${status.bot}`} onClick={(e) => handleClick("bot", e)} />
                            <div className={`center ${status.center}`} onClick={(e) => handleClick("center", e)} />
                        </div>
                        <p className="text-light">{number}</p>
                    </div>
                </div>
            );

        case (number > 50 && number < 70):
            return (
                <div>
                    <div>
                        <div className="tooth bg-light position-relative" onClick={(e) => e.stopPropagation()}>
                            <img className="position-absolute top-0 start-0" src="/images/teeth.png" alt="" />
                            <div className={`left ${status.left}`} onClick={(e) => handleClick("left", e)} />
                            <div className={`top ${status.top}`} onClick={(e) => handleClick("top", e)} />
                            <div className={`right ${status.right}`} onClick={(e) => handleClick("right", e)} />
                            <div className={`bot ${status.bot}`} onClick={(e) => handleClick("bot", e)} />
                            <div className={`center ${status.center}`} onClick={(e) => handleClick("center", e)} />
                        </div>
                        <p className="text-light">{number}</p>
                    </div>
                </div>
            );
        case (number > 70 && number < 90):
            return (
                <div>
                    <div>
                        <p className="text-light m-0">{number}</p>
                        <div className="tooth bg-light position-relative" onClick={(e) => e.stopPropagation()}>
                            <img className="position-absolute top-0 start-0" src="/images/teeth.png" alt="" />
                            <div className={`left ${status.left}`} onClick={(e) => handleClick("left", e)} />
                            <div className={`top ${status.top}`} onClick={(e) => handleClick("top", e)} />
                            <div className={`right ${status.right}`} onClick={(e) => handleClick("right", e)} />
                            <div className={`bot ${status.bot}`} onClick={(e) => handleClick("bot", e)} />
                            <div className={`center ${status.center}`} onClick={(e) => handleClick("center", e)} />
                        </div>
                    </div>
                </div>
            );
        case (number > 30 && number < 50):
            return (
                <div className="mt-3 mb-3">
                    <div>
                        <p className="text-light m-0">{number}</p>
                        <div className="tooth bg-light position-relative" onClick={(e) => e.stopPropagation()}>
                            <img className="position-absolute top-0 start-0" src="/images/teeth.png" alt="" />
                            <div className={`left ${status.left}`} onClick={(e) => handleClick("left", e)} />
                            <div className={`top ${status.top}`} onClick={(e) => handleClick("top", e)} />
                            <div className={`right ${status.right}`} onClick={(e) => handleClick("right", e)} />
                            <div className={`bot ${status.bot}`} onClick={(e) => handleClick("bot", e)} />
                            <div className={`center ${status.center}`} onClick={(e) => handleClick("center", e)} />

                            {/* {menuVisible && (
                                <div ref={menuRef} className="context-menu" style={{ top: menuPosition.top, left: menuPosition.left }}>
                                    <ListGroup>
                                        <ListGroup.Item action onClick={() => handleOptionSelect("bg-danger")}>
                                            Realizado
                                        </ListGroup.Item>
                                        <ListGroup.Item action onClick={() => handleOptionSelect("bg-primary")}>
                                            Pendiente
                                        </ListGroup.Item>
                                        {selectedPart === "center" && <ListGroup.Item >
                                            <DropdownButton
                                                key="end"
                                                id={`dropdown-button-drop-end`}
                                                drop="end"
                                                variant="none"
                                                title={`Extracción`}
                                            >
                                                <Dropdown.Item eventKey="1" onClick={() => handleOptionSelect("extraction")}>Realizada</Dropdown.Item>
                                                <Dropdown.Item eventKey="2" onClick={() => handleOptionSelect("pendingExtraction")}>Pendiente</Dropdown.Item>
                                            </DropdownButton>
                                        </ListGroup.Item>}

                                        {selectedPart === "center" && <ListGroup.Item >
                                            <DropdownButton
                                                key="end"
                                                id={`dropdown-button-drop-end`}
                                                drop="end"
                                                variant="none"
                                                title={`Corona`}
                                            >
                                                <Dropdown.Item eventKey="1" onClick={() => handleOptionSelect("crown")}>Realizada</Dropdown.Item>
                                                <Dropdown.Item eventKey="2" onClick={() => handleOptionSelect("pendingCrown")}>Pendiente</Dropdown.Item>
                                            </DropdownButton>
                                        </ListGroup.Item>}
                                        <ListGroup.Item action onClick={() => handleOptionSelect("clean")}>
                                            Borrar
                                        </ListGroup.Item>
                                    </ListGroup>
                                </div>
                            )} */}
                        </div>
                    </div>
                    <img style={{ height: "80px" }} src={`/images/teeth/${number}.png`} alt="" />
                </div>
            );
    }


}

export default Tooth;