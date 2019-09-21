export const TYPES = {
    App: Symbol("App"),
    DbClient: Symbol("DbClient"),
    Typegoose: Symbol("Typegoose"),

    MovieRepository: Symbol("MovieRepository"),
    DirectorRepository: Symbol("DirectorRepository"),
    ActorRepository: Symbol("ActorRepository"),
    UserRepository: Symbol("UserRepository"),
    TenantRepository: Symbol("TenantRepository"),

    LoggerService: Symbol("LoggerService"),
    SearchService: Symbol("SearchService"),
    MailService: Symbol("MailService"),
    AuthService: Symbol("AuthService"),

    EventDispatcher: Symbol("EventDispatcher"),
    Agenda: Symbol("Agenda")
};
