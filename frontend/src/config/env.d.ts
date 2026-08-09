/**
 * env.ts
 *
 * Typed environment variable access.
 * All process.env / import.meta.env reads should go through this module.
 */
export declare const ENV: {
    readonly API_BASE_URL: any;
    readonly APP_ENV: any;
    readonly IS_DEV: any;
    readonly IS_PROD: any;
};
export type AppEnv = 'development' | 'staging' | 'production';
