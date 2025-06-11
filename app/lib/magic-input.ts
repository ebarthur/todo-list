import { handleAutoBrackets } from "./auto-brackets";
import { handleAutoCheckbox } from "./auto-checkbox";

function magicInput(
	e: React.KeyboardEvent<HTMLTextAreaElement>,
	value: string,
	onChange: (newValue: string) => void,
): boolean {
	if (handleAutoCheckbox(e, value, onChange)) return true;

	if (handleAutoBrackets(e, value, onChange)) return true;

	return false;
}

export { magicInput };
