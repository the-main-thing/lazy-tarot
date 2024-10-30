import { api } from '../QueryProvider'
import { useLanugage } from './useLanugage'

export const useGetPages = () => {
	const language = useLanugage()
	return api.public.pages.getAllPagesData.useQuery({
		language,
	})
}
