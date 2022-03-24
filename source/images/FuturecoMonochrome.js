import { lightenColor } from '../components/utils/colors'

export default ({ color }) => {
	const darkest = lightenColor(color, -25),
		darker = lightenColor(color, -15)
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="100px"
			height="100px"
			version="1.1"
			viewBox="0 0 500 500"
		>
			<g transform="translate(0 203)">
				<g fillOpacity="1">
					<path
						fill={color}
						strokeWidth="1.163"
						d="M46.91 111.161L27.57 90.985l31.88-33.307L91.33 24.37l29.431 31.168 29.841 30.768-7.632 1.92c-23.125 5.817-52.036 20.128-69.208 36.692-3.66 3.53-6.847 6.42-7.084 6.42-.236 0-9.132-9.08-19.768-20.177z"
					></path>
					<path
						fill={color}
						strokeWidth="1.152"
						d="M276.103 122.547c-20.772-13.478-43.752-28.638-68.947-34.432-4.023-.925-8.046-1.791-8.303-2.048-.257-.257 47.263-49.005 104.963-108.204 57.699-59.199 105.593-108.358 106.431-109.242 1.287-1.356 6.665 3.295 34.445 29.788l32.92 31.395-60.887 61.82c-33.488 34-77.411 78.588-97.606 99.083l-35.25 36.88z"
					></path>
					<path
						fill={darker}
						strokeWidth="1.139"
						d="M81.905 146.601l-16.291-16.32 7.011-6.492c17.834-16.51 43.549-29.674 69.442-35.548l8.535-1.935 11.54 12.113c6.348 6.662 11.988 12.133 12.536 12.158.547.024 6.21-5.48 12.584-12.233l11.59-12.277 10.04 2.066c25.018 5.15 48.79 17.296 71.56 36.562l3.417 2.891-16.868 16.896-16.867 16.896-6.788-3.233c-16.858-8.029-33.565-12.55-53.931-14.594-26.252-2.635-55.286 2.665-81.246 14.83-5.329 2.498-9.753 4.54-9.83 4.54-.079 0-7.474-7.344-16.434-16.32z"
					></path>
					<path
						fill={darkest}
						strokeWidth="1.139"
						d="M119.6 183.895c-22.578-23.046-21.87-20.743-20.413-21.332l9.766-4.576c33.303-15.606 68.785-19.437 104.025-11.23 14.946 3.48 37.015 12.214 37.015 14.648 0 .672-17.04 18.382-37.869 39.357l-37.869 38.135z"
					></path>
				</g>
			</g>
		</svg>
	)
}
