import { Movie } from "../model/movie";

export interface ISearchService {
    search(query: string): Promise<Movie[]>;
}

export interface IMailService {
    sendWelcomeEmail(
        to: string,
        subject: string,
        text: string
    ): Promise<boolean>;
}

export interface ILoggerService {
    silly(message: string): void;
    error(message: string): void;
    info(message: string): void;
    debug(message: string): void;
    warn(message: string): void;
}
