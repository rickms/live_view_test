mod services;
mod app;

use actix_files::{self as fs};
use actix_web::*;

use crate::app::AppState;
use actix_web::middleware::Logger;
use env_logger::Env;
use actix_cors::Cors;

#[actix_web::main]
async fn main() -> std::io::Result<()> {

    env_logger::Builder::from_env(Env::default().default_filter_or("info")).init();

    let app_state = web::Data::new(AppState::default());
    HttpServer::new(move || {
        let cors = Cors::default()
            .allowed_origin("http://localhost:3000")
            .allowed_origin("http://localhost:8000")
            .allowed_methods(vec!["GET", "POST", "PUT", "DELETE"])
            .allowed_headers(vec![http::header::AUTHORIZATION, http::header::ACCEPT])
            .allowed_header(http::header::CONTENT_TYPE)
            .max_age(3600);

        App::new()
            .wrap(cors)
            .wrap(Logger::default())
            .app_data(app_state.clone())
            .service(services::todo::get_todos)
            .service(services::todo::create_todo)
            .service(services::todo::delete_todo)
            .service(services::todo::clear_todos)
            .service(services::todo::update_todo)
            .service(services::page)
            .service(services::mat_page)
            .service(fs::Files::new("/static", "./pkg").show_files_listing())
            .service(fs::Files::new("/mat/", "./app_ts/build"))

    })
    .bind("127.0.0.1:8000")?
    .run()
    .await
}