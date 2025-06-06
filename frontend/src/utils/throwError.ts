export function throwError(message: string, error: unknown): never {
	if (error instanceof Error) {
		throw new Error(message + " " + error.message)
	} else {
		throw new Error(message + " " + "Unknown error occured.");
	}
}
