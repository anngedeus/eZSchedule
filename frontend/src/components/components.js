// @flow

import styled from '@emotion/styled'

export const Header = styled.header`
	text-align: center;

	h1 {
		font-weight: 800;
		font-family: "Lucida Console", "Courier New", monospace;
		color: #FEDB74;
	}
	h2 {
		font-weight: 300;
		font-family: "Lucida Console", "Courier New", monospace;
		color: #9695F0;
	}
`

export const Choices = styled.section`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-gap: 1em;

	button {
		margin-bottom: 1em;
	}
`
