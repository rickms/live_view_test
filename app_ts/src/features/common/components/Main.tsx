import React, {FunctionComponent} from "react"
import {Todo} from "../../todos/components/Todo";
import {Errors} from "./Errors";

export const Main:FunctionComponent<any> = () => {
    return <div><Todo/><Errors/></div>
}