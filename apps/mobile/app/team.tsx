import { StatusBar } from 'expo-status-bar'
import { Platform, StyleSheet } from 'react-native'
import { getLocales } from 'expo-localization'
import { SUPPORTED_LANGUAGES } from '@repo/core/i18n'

import EditScreenInfo from '~/components/EditScreenInfo'
import { View } from '~/components/Themed'
import { PortableText } from '~/components/PortableText'
import { Typography } from '~/components/Typography'
import { trpc } from './api/QueryProvider'

export default function ModalScreen() {
	const { data } = trpc.pages.public.getAllPages.useQuery({
		language:
			getLocales()[0]?.languageCode || SUPPORTED_LANGUAGES[0] || 'en',
	})

	if (!data) {
		return null
	}

	return (
		<View style={styles.container}>
			<Typography variant="h2">
				{data.aboutUsPageContent.header.pageTitle}
			</Typography>
			<View style={styles.separator}>
				<Typography variant="h3">
					{data.aboutUsPageContent.header.teamTitle}
				</Typography>
			</View>
			<View style={styles.separator}>
				<PortableText value={data.manifestoPageContent.content} />
			</View>

			{/* Use a light status bar on iOS to account for the black space above the modal */}
			<StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: '80%',
	},
})
