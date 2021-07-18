import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'
import { useState, ChangeEvent, KeyboardEvent} from "react";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export function useFormInput(initialValue:any, onEnter:undefined | (() => void) = undefined ) {
    const [value, setValue] = useState(initialValue);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if(e && e.target) {
            if (typeof initialValue == "number") {
                setValue(Number(e.target.value));
            } else {
                setValue(e.target.value);
            }
        }
    }

    const handleKeyPress = (e:KeyboardEvent<HTMLInputElement>) => {
        if (onEnter && (e.code === "Enter" || e.code === "NumpadEnter")) {
            onEnter();
        }
    }

    const setDefault = () => {
        setValue(initialValue);
    }

    return {
        value,
        set: setValue,
        setDefault: setDefault,
        hasChanged : () => value !== initialValue,
        bind : {
            value,
            onChange: handleChange,
            onKeyPress: handleKeyPress
        }
    }
}

export function useCheckboxInput(initialValue:boolean, onChange:undefined | ((value:boolean) => void) = undefined) {
    const [value, setValue] = useState(initialValue);

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        if(e?.target) {
            if (e.target.checked !== value) {
                setValue(e.target.checked);
                if (typeof onChange == "function") {
                    onChange(value);
                }
            }
        }
    }

    function setDefault() {
        setValue(initialValue);
    }

    return {
        value,
        set: setValue,
        setDefault: setDefault,
        hasChanged : () => value !== initialValue,
        bind : {
            checked: value,
            onChange: handleChange
        }
    }
}