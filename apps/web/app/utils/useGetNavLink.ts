import { useSearchParams, useLocation } from '@remix-run/react'

const getLink = (hash: string, path: string, searchParams: URLSearchParams) => {
	let search = searchParams.toString()
	if (search) {
		search = `?${search}`
	}
	if (hash) {
		return `${path}${search}#${hash}`
	}

	return `${path}${search}`
}

export const useGetNavLink = ({
	hash,
	path,
}: {
	hash?: string
	path?: string
}) => {
	const [searchParams] = useSearchParams()
	const { pathname } = useLocation()

	return getLink(hash || '', path || pathname, searchParams)
}
