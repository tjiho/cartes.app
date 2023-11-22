import { useLocalStorage, useMediaQuery } from 'usehooks-ts'
import dynamic from 'next/dynamic'

const ModalSheet = dynamic(() => import('./ModalSheet'), {
	ssr: false,
})
const SideSheet = dynamic(() => import('./SideSheet'), {
	ssr: true,
})

export default function ModalSwitch(props) {
	const matches = useMediaQuery('(min-width: 800px)')

	const [tutorials] = useLocalStorage('tutorials', {})
	console.log('tutorials', tutorials)

	if (tutorials.introduction && !props.isSheetOpen) return null

	if (matches) return <SideSheet {...props} />

	return <ModalSheet {...props} />
}