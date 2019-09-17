import { Movie } from "../model/movie";
import { User } from "../model/user";

export interface ISearchService {
    search(query: string): Promise<Movie[]>;
}

export interface IMailService {
    sendWelcomeEmail(
        to: string,
        subject: string,
        text: string
    ): Promise<{ delivered: string; status: string }>;
    startEmailSequence(
        sequence: string,
        user: Partial<User>
    ): { delivered: number; status: string };
}

export interface ILoggerService {}
