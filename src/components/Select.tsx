import React, {useEffect, useState} from "react";
import styles from "../styles/select.module.css"

export type SelectOption = {
    label: string,
    value: string | number
}

type SelectProps = {
    options: SelectOption[],
    value?: SelectOption
    onChange: (value: SelectOption | undefined) => void
}

function Select({value, onChange, options}: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(0)

    const toggle = () => setIsOpen(prevState => !prevState);

    const clearOptions = (event: React.MouseEvent) => {
        event.stopPropagation();
        onChange(undefined)
    };

    const selectOption = (option: SelectOption) => {
        if (option !== value) onChange(option);
        setIsOpen(false);
    }

    const isOptionSelected = (option: SelectOption) => option === value;

    useEffect(() => {
        if (isOpen) setHighlightedIndex(0);
    }, [isOpen])

    return (
        <>
            <div
                onBlur={() => setIsOpen(false)}
                onClick={toggle}
                tabIndex={0}
                className={styles.container}
            >
                <span className={styles.value}>{value?.label}</span>
                <button onClick={clearOptions} className={styles['close-btn']}>&times;</button>
                <div className={styles.divider}></div>
                <div className={styles.caret}></div>
                <ul className={`${styles.options} ${isOpen ? styles.show : ""}`}>
                    {options.map((option, index) =>
                        (
                            <li
                                key={option.value}
                                onMouseEnter={() => setHighlightedIndex(index)}
                                className={`
                                ${styles.option} 
                                ${isOptionSelected(option) ? styles.selected : ''}
                                ${index === highlightedIndex ? styles.highlighted : ''}
                                `}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    selectOption(option);
                                }}
                            >
                                {option.label}
                            </li>
                        )
                    )
                    }
                </ul>
            </div>
        </>
    )
}

export default Select
