export abstract class ResponseDto<T> {
	constructor(partial: Partial<T> = {}) {
		Object.assign(this, partial);
	}

	arrayFrom(items: T[]): this[] {
		// @ts-ignore
		return items.map((item) => new this.constructor(item));
	}
}
