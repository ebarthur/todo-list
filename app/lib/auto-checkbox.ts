function handleAutoCheckbox(
	e: React.KeyboardEvent<HTMLTextAreaElement>,
	value: string,
	onChange: (newValue: string) => void,
): boolean {
	if (e.key !== "Enter") return false;

	const textarea = e.currentTarget;
	const { selectionStart } = textarea;
	const beforeCursor = value.substring(0, selectionStart);

	const currentLineStart = beforeCursor.lastIndexOf("\n") + 1;
	const currentLine = value.substring(currentLineStart, selectionStart);

	const listMatch = currentLine.match(/^(\s*)([-*])\s+(?:\[( |x)\]\s*)?(.*)$/);

	if (listMatch) {
		e.preventDefault();

		const [, indent, bullet, checkboxState, content] = listMatch;
		const isCheckbox = checkboxState !== undefined;

		if (!content.trim()) {
			const newValue =
				value.substring(0, currentLineStart) +
				value.substring(selectionStart + 1);

			onChange(newValue);
			textarea.setSelectionRange(currentLineStart, currentLineStart);

			return true;
		}

		const newListItem = isCheckbox
			? `\n${indent}${bullet} [ ] `
			: `\n${indent}${bullet} `;

		const newValue =
			value.substring(0, selectionStart) +
			newListItem +
			value.substring(selectionStart);

		const newCursorPos = selectionStart + newListItem.length;
		onChange(newValue);
		textarea.setSelectionRange(newCursorPos, newCursorPos);

		return true;
	}

	return false;
}

export { handleAutoCheckbox };
