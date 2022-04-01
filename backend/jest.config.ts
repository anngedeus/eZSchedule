import { Config } from '@jest/types';

const config: Config.InitialOptions = {
	transform: {
		'^.+\\.ts$': 'ts-jest',
	},
	testPathIgnorePatterns: [
		"/node_modules/",
		"/build/",
	],
	extensionsToTreatAsEsm: [
		".ts"
	],
	globals: {
		'ts-jest': {
			useESM: true,
		},
	},
	moduleNameMapper: {
		'^(\\.{1,2}/.*)\\.js$': '$1',
	},
};
export default config;
