const trim = (text: TemplateStringsArray) =>
  text[0].replace(/^[\n]{1}/, '').replace(/[\n]{1}$/, '');

export const shortSubjectRaw = trim`
Lorem ipsum

dolor sit amet, consectetur adipiscing elit.
`;

export const truncateSubjectRaw = trim`
Lorem ipsum dolor sit amet, consectetur adipiscing elit.
`;

export const truncateSubjectWrapped = trim`
Lorem ipsum dolor sit amet, consectetur adipiscing
elit.
`;

export const indentWithTabsRaw = trim`
Lorem ipsum

		Nullam et lacus aliquet, imperdiet dui vitae, tempor turpis. Cras consequat sed tellus ut pharetra. Nam malesuada odio at ligula imperdiet, sed porta mi rutrum.
`;

export const indentWithTabsWrapped = trim`
Lorem ipsum

		Nullam et lacus aliquet, imperdiet dui vitae, tempor turpis.
		Cras consequat sed tellus ut pharetra. Nam malesuada
		odio at ligula imperdiet, sed porta mi rutrum.
`;

export const indentWithSpacesRaw = trim`
Lorem ipsum

    Nullam et lacus aliquet, imperdiet dui vitae, tempor turpis. Cras consequat sed tellus ut pharetra. Nam malesuada odio at ligula imperdiet, sed porta mi rutrum.
`;

export const listDecimalTabsRaw = trim`
Lorem ipsum

	1.	Nullam et lacus aliquet, imperdiet dui vitae, tempor turpis. Cras consequat sed tellus ut pharetra. Nam malesuada odio at ligula imperdiet, sed porta mi rutrum.
`;

export const listDecimalTabsWrapped = trim`
Lorem ipsum

	1.	Nullam et lacus aliquet, imperdiet dui vitae, tempor turpis.
		Cras consequat sed tellus ut pharetra. Nam malesuada
		odio at ligula imperdiet, sed porta mi rutrum.
`;

export const listAlphaTabsRaw = trim`
Lorem ipsum

	a.	Nullam et lacus aliquet, imperdiet dui vitae, tempor turpis. Cras consequat sed tellus ut pharetra. Nam malesuada odio at ligula imperdiet, sed porta mi rutrum.
`;


export const listAlphaTabsWrapped = trim`
Lorem ipsum

	a.	Nullam et lacus aliquet, imperdiet dui vitae, tempor turpis.
		Cras consequat sed tellus ut pharetra. Nam malesuada
		odio at ligula imperdiet, sed porta mi rutrum.
`;

export const listAlphaBraketTabsRaw = trim`
Lorem ipsum

	a.)	Nullam et lacus aliquet, imperdiet dui vitae, tempor turpis. Cras consequat sed tellus ut pharetra. Nam malesuada odio at ligula imperdiet, sed porta mi rutrum.
`;

export const listAlphaBraketTabsWrapped = trim`
Lorem ipsum

	a.)	Nullam et lacus aliquet, imperdiet dui vitae, tempor turpis.
		Cras consequat sed tellus ut pharetra. Nam malesuada
		odio at ligula imperdiet, sed porta mi rutrum.
`;

export const listAsteriskTabsRaw = trim`
Lorem ipsum

	*	Nullam et lacus aliquet, imperdiet dui vitae, tempor turpis. Cras consequat sed tellus ut pharetra. Nam malesuada odio at ligula imperdiet, sed porta mi rutrum.
`;

export const listAsteriskTabsWrapped = trim`
Lorem ipsum

	*	Nullam et lacus aliquet, imperdiet dui vitae, tempor turpis.
		Cras consequat sed tellus ut pharetra. Nam malesuada
		odio at ligula imperdiet, sed porta mi rutrum.
`;

export const listDashTabsRaw = trim`
Lorem ipsum

	-	Nullam et lacus aliquet, imperdiet dui vitae, tempor turpis. Cras consequat sed tellus ut pharetra. Nam malesuada odio at ligula imperdiet, sed porta mi rutrum.
`;

export const listDashTabsWrapped = trim`
Lorem ipsum

	-	Nullam et lacus aliquet, imperdiet dui vitae, tempor turpis.
		Cras consequat sed tellus ut pharetra. Nam malesuada
		odio at ligula imperdiet, sed porta mi rutrum.
`;
