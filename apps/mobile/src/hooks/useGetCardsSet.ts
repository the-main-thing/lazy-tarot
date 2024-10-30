import { api } from '../QueryProvider'
import { useLanugage } from './useLanugage'

export const useGetCardsSet = () => {
	const language = useLanugage()
	return api.public.tarot.getCardsSet.useQuery({
		language,
	})
}
