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

	const taskListMatch = currentLine.match(/^(\s*)([-*])\s+\[( |x)\](.*)$/);

	if (!taskListMatch) return false;

	e.preventDefault();

	const [, indent, bullet, , contentAfterCheckbox] = taskListMatch;
	if (!contentAfterCheckbox.trim()) {
		const newValue =
			value.substring(0, currentLineStart) +
			value.substring(selectionStart + 1);

		onChange(newValue);
		textarea.setSelectionRange(currentLineStart, currentLineStart);

		return true;
	}

	const newTaskItem = `\n${indent}${bullet} [ ] `;

	const newValue =
		value.substring(0, selectionStart) +
		newTaskItem +
		value.substring(selectionStart);

	const newCursorPos = selectionStart + newTaskItem.length;
	onChange(newValue);
	textarea.setSelectionRange(newCursorPos, newCursorPos);

	return true;
}

export { handleAutoCheckbox };
