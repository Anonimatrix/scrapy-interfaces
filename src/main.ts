import { Readable } from "stream";
import { ClassProvider, ValueProvider } from "tsyringe";

export abstract class Exception extends Error {
    statusCode?: number;
  
    /**
     * @property needStop
     * @description This property is used to know if the exception is fatal or not
     * @type {boolean}
     */
    needStop?: boolean;
  
    /**
     * @function cry
     * @description This function is used to cry when an exception is thrown
     * @returns {void}
     */
    cry?(): void;
}

type Instantiable<T> = new (...args: any[]) => T;

type Registable = {
    [key: string]: ValueProvider<unknown> | ClassProvider<unknown>;
};

interface ScraperConfigInterface<T extends object> {
    uploaders: Instantiable<UploaderInterface>[];
    processors: Instantiable<ProcessorInterface<T>>[];
    scrapers: Instantiable<PageScraperInterface<T>>[];
    services?: Instantiable<any>[];
    providers?: Registable[];
    exceptionHandler?: Instantiable<ExceptionHandlerInterface>;
}

interface UploaderInterface {
    /**
     * Uploads a file to a remote location
     * @param { Readable } data Stream of data to be uploaded
     * @param { string } filepath Path to the file to be uploaded
     * @returns { Promise<void> }
     */
    upload: (data: Readable, filepath: string) => Promise<void>;
}

interface ProcessorInterface<T extends object> {
    extension: string;
    /**
     *  Process user data to a stream
     * @param { T[] } data
     * @returns { Promise<Readable> }
     */
    process: (data: T[]) => Promise<Readable>;
}

interface PageScraperInterface<T extends object> {
    scrap: () => Promise<T[]>;
}
  
interface ExceptionHandlerInterface {
    /**
     * @function handle
     * @description This function is used to handle an exception
     * @param {Exception} exception The exception to handle
     */
    handle(exception: Exception): void;
}


export {
    ScraperConfigInterface,
    UploaderInterface,
    ProcessorInterface,
    PageScraperInterface,
    ExceptionHandlerInterface,
    Instantiable,
    Registable
}