// export function eventDispatcher() {
//     return (object: any, propertyName: string, index?: number): void => {
//         const eventDispatcher = new EventDispatcherClass();

//         container.bind(TYPES.EventDispatcher).toConstantValue({
//             object,
//             propertyName,
//             index,
//             value: () => eventDispatcher
//         });
//     };
// }

export { EventDispatcher as IEventDispatcher } from "event-dispatch";
