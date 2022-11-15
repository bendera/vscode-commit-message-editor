const trim = (text: TemplateStringsArray) =>
  text[0].replace(/^[\n]{1}/, '').replace(/[\n]{1}$/, '');

export const shortSubjectRaw = trim`
Lorem ipsum

dolor sit amet, consectetur adipiscing elit.
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
