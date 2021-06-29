use crate::{Msg, Model};
use seed::*;
use seed::prelude::*;

const ENTER_KEY: &str = "Enter";

pub fn view(model: &Model) -> Node<Msg> {
    div![C!["container main"],
        div![C!["row"],
            div![C!["col"],
                view_header(),
            ]
        ],
        div![C!["row"],
            div![C!["col"],
                view_body(model)
            ]
        ]
    ]
}

fn view_header() -> Node<Msg> {
    img![
        attrs!{At::Src => "static/LVLogo_small.png"}
    ]
}
fn view_body(model: &Model) -> Node<Msg> {
    div![
        C!["container tasks"],
        div![ C!["row"],
            div![ C!["col col-4"] ,
                h3!["Tasks"]
            ]
        ],
        IF!(model.error.is_some() =>
            div![ C!["row"],
                div![
                    C!["alert alert-danger"],
                    model.error.as_ref().unwrap()
                ]
            ]
        ),
        div![ C!["row"],
            div![ C!["col col-3 float-end"] ,
                input![
                    C!["form-control"],
                    attrs!{ At::Type => "text" , At::Placeholder => "New Task Description...", At::Value => model.new_todo_description.as_str()},
                    input_ev(Ev::Input, Msg::NewToDoDescriptionChange),
                    keyboard_ev(Ev::KeyDown, |keyboard_event| {
                        IF!(keyboard_event.key() == ENTER_KEY => Msg::AddToDo)
                    }),
                ],
            ],
            div![C!["col col-1"],
                button![
                    C!["btn btn-primary float-end"],
                    "Add",
                    ev(Ev::Click, |_| Msg::AddToDo)
                ]
            ]
        ],
        div![ C!["row"],
            div![ C!["col col-4"] ,
                ul![
                    C!["list-group"],
                    model.todos.iter().map(|item| {
                        let id = item.id;
                        let completed = item.completed;
                        li![C!["list-group-item d-flex justify-content-between align-items-start"],
                            input![
                                C!["checkbox form-check-input"],
                                attrs! { At::Type => "checkbox", At::Checked => item.completed.as_at_value() },
                                ev(Ev::Change, move |_| Msg::UpdateCompletedState(id, !completed))
                            ],
                            div![C!["ms-2 me-auto", IF!(completed => "task-completed")], &item.description],
                            button![
                                C!["btn-close btn-close-custom"],
                                ev(Ev::Click, move |_| Msg::RemoveToDo(id))
                            ],
                        ]
                    })
                ]
            ],
        ],
        IF!(model.todos.len() > 0 =>
        div![ C!["row"],
            div![C!["col col-4"],
                button![
                    C!["btn btn-danger float-end"],
                    "Clear",
                    ev(Ev::Click, |_| Msg::ClearToDos)
                ]
            ]
        ]),
    ]
}