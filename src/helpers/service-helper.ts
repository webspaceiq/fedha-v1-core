import { IExecutionContext } from "@webspaceiq/service-objects";
import { serviceExecutor } from "..";

export class ServiceHelper {
    
    public static async execute<T, U>(context: IExecutionContext<T>): Promise<U> {
        return await serviceExecutor.executeService<T, Promise<U>>(context);
    }
}