import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux'
import type {AppDispatch, RootState} from './store'
import {ChangeEvent, KeyboardEvent, useState} from "react";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

/***
 * Custom hook for simpler input handling
 * @param initialValue
 * @param onEnter - Callback triggered when enter key is pressed.
 */
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