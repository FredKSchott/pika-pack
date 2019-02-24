import { PersonObject } from '../../types.js';
export declare function isValidLicense(license: string): boolean;
export declare function stringifyPerson(person: any): any;
export declare function parsePerson(person: any): PersonObject;
export declare function normalizePerson(person: any): any | PersonObject;
export declare function extractDescription(readme: any): string;
