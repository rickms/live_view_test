import {FunctionComponent} from "react";
import {TodoList} from "./TodoList";
import React from "react"
import {NewTodoInput} from "./NewTodoInput";
import {useSelector} from "react-redux";
import {RootState} from "../../store";

export const Todo:FunctionComponent<any> = () => {
    const error = useSelector( (state:RootState) => state.todos.error )

    let error_component = error ? <div className="row"><div className="alert alert-danger">{error}</div></div> : <></>;


    return  <div className="container tasks">
                <div className="row">
                    <div className="col col-4">
                        <h3>Tasks</h3>
                    </div>
                </div>
                {error_component}
                <NewTodoInput/>
                <TodoList/>

    </div>;
}