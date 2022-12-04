import React, {useEffect, useRef, useState} from "react";
import styles from "../styles/select.module.css"
import {SelectOption, SelectProps} from "../types/Select";

function Select({multiple, value, onChange, options}: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)

    const toggle = () => setIsOpen(prevState => !prevState);

    const clearOptions = (event: React.MouseEvent) => {
        event.stopPropagation();
        multiple ? onChange([]) : onChange(undefined)
    };

    const selectOption = (option: SelectOption) => {
        if (multiple) {
            if (value.includes(option))
                onChange(value.filter(o => o !== option))
            else
                onChange([...value, option])
        } else {
            if (option !== value) onChange(option);
        }
        setIsOpen(false);
    }

    const isOptionSelected = (option: SelectOption) => {
        return multiple
            ? value.includes(option)
            : option === value
    };

    useEffect(() => {
        if (isOpen) setHighlightedIndex(0);
    }, [isOpen]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.target != containerRef.current) return;

            switch (e.code) {
                case 'Enter':
                case 'Space':
                    setIsOpen(prevState => !prevState);
                    if (isOpen) selectOption(options[highlightedIndex]);
                    break;
                case 'ArrowUp':
                case 'ArrowDown':
                    if (!isOpen) {
                        setIsOpen(true);
                        break;
                    }

                    const newValue = highlightedIndex + (e.code === 'ArrowDown' ? 1 : -1);
                    if (newValue >= 0 && newValue < options.length)
                        setHighlightedIndex(newValue)
                    break;
                case 'Escape':
                    setIsOpen(false);
                    break;
            }

        };
        containerRef.current?.addEventListener('keydown', handler)

        return () => {
            containerRef.current?.removeEventListener('keydown', handler)
        }

    }, [isOpen, highlightedIndex, options])

    return (
        <>
            <div
                ref={containerRef}
                onBlur={() => setIsOpen(false)}
                onClick={toggle}
                tabIndex={0}
                className={styles.container}
            >
                <span className={styles.value}>
                    {multiple
                        ? value.map(option => (
                                <button key={option.value}
                                        className={styles['option-badge']}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            selectOption(option)
                                        }}>
                                    {option.label}
                                    <span className={styles['remove-btn']}>&times;</span>
                                </button>
                            )
                        )
                        : value?.label}</span>
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
