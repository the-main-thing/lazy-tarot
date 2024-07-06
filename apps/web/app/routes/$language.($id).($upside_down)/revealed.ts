export const revealed = ({
	id,
	upside_down,
}: Record<string, unknown>): boolean => {
	return Boolean(
		typeof id === 'string' &&
			id &&
			(upside_down === '1' || upside_down === '0'),
	)
}
