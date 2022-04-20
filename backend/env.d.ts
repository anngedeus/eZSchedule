export {};

declare global {
	namespace NodeJS {
		export interface ProcessEnv {
			PORT?: string,
			ATLAS_URI?: string,
			JWT_SECRET?: string,
			STATIC_DIR?: string,
		}
	}
}
