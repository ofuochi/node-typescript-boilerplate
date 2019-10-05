export const TYPES = {
    App: Symbol("App"),
    DbClient: Symbol("DbClient"),
    Typegoose: Symbol("Typegoose"),
    AutoMapper: Symbol("AutoMapper"),

    UserRepository: Symbol("UserRepository"),
    TenantRepository: Symbol("TenantRepository"),

    LoggerService: Symbol("LoggerService"),
    MailService: Symbol("MailService"),
    AuthService: Symbol("AuthService"),
    TenantService: Symbol("TenantService"),

    EventDispatcher: Symbol("EventDispatcher"),
    Agenda: Symbol("Agenda"),
    TenantId: Symbol("TenantId"),
    RequestMiddleware: Symbol("RequestMiddleware")
};
