const BRACKET_PAIRS: Record<string, string> = {
	"(": ")",
	"[": "]",
	"{": "}",
	'"': '"',
	"'": "'",
	"`": "`",
};

export function handleAutoBrackets(
	e: React.KeyboardEvent<HTMLTextAreaElement>,
	value: string,
	onChange: (newValue: string) => void,
): boolean {
	const { key } = e;
	const textarea = e.currentTarget;
	const { selectionStart, selectionEnd } = textarea;

	// Bracket indentation
	if (key === "Enter") {
		const beforeChar = value.charAt(selectionStart - 1);
		const afterChar = value.charAt(selectionStart);

		if (BRACKET_PAIRS[beforeChar] !== afterChar) return false;

		e.preventDefault();

		const beforeCursor = value.substring(0, selectionStart);
		const currentLineStart = beforeCursor.lastIndexOf("\n") + 1;
		const indent =
			value
				.substring(currentLineStart, selectionStart - 1)
				.match(/^(\s*)/)?.[1] || "";

		onChange(
			insertText(
				value,
				selectionStart,
				selectionStart,
				`\n${indent}\t\n${indent}`,
			),
		);
		setCursor(textarea, selectionStart + indent.length + 2);
		return true;
	}

	const closingChar = BRACKET_PAIRS[key];
	if (!closingChar) return false;

	e.preventDefault();
	const hasSelection = selectionStart !== selectionEnd;
	const nextChar = value.charAt(selectionStart);
	const prevChar = value.charAt(selectionStart - 1);

	// Text selection (wrap)
	if (hasSelection) {
		const selectedText = value.substring(selectionStart, selectionEnd);
		onChange(
			insertText(
				value,
				selectionStart,
				selectionEnd,
				key + selectedText + closingChar,
			),
		);
		setCursor(textarea, selectionStart + 1 + selectedText.length);
		return true;
	}

	// Backticks (code blocks)
	if (key === "`") {
		if (nextChar === "`") {
			setCursor(textarea, selectionStart + 1);
			return true;
		}

		if (prevChar === "`" && value.charAt(selectionStart - 2) === "`") {
			onChange(insertText(value, selectionStart, selectionStart, "`\n\n```"));
			setCursor(textarea, selectionStart + 2);
			return true;
		}

		onChange(insertText(value, selectionStart, selectionStart, "``"));
		setCursor(textarea, selectionStart + 1);
		return true;
	}

	// Quotes
	if (
		(key === '"' || key === "'") &&
		nextChar === key &&
		isInSameWord(value, selectionStart)
	) {
		setCursor(textarea, selectionStart + 1);
		return true;
	}

	if ((key === '"' || key === "'") && isInSameWord(value, selectionStart)) {
		return false;
	}

	// Default behaviour
	onChange(
		insertText(value, selectionStart, selectionStart, key + closingChar),
	);
	setCursor(textarea, selectionStart + 1);
	return true;
}

function insertText(
	value: string,
	start: number,
	end: number,
	text: string,
): string {
	return value.substring(0, start) + text + value.substring(end);
}

function isWordCharacter(char: string): boolean {
	return /\w/.test(char);
}

function isInSameWord(value: string, position: number): boolean {
	return (
		isWordCharacter(value.charAt(position - 1)) ||
		isWordCharacter(value.charAt(position))
	);
}

function setCursor(textarea: HTMLTextAreaElement, position: number): void {
	textarea.setSelectionRange(position, position);
}
