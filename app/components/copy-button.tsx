import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { Button } from "./button";

function CopyButton({
	text,
	className,
	disabled,
}: {
	text: string;
	className?: string;
	disabled?: boolean;
}) {
	const [copyStarted, setCopyStarted] = React.useState(false);
	const [copyStatus, setCopyStatus] = React.useState<
		"failed" | "copied" | null
	>(null);

	React.useEffect(() => {
		const timeout = setTimeout(() => {
			if (copyStarted) {
				setCopyStarted(false);
				setCopyStatus(null);
			}
		}, 1000);

		return () => clearTimeout(timeout);
	}, [copyStarted]);

	const handleCopy = async () => {
		setCopyStarted(true);
		try {
			await navigator.clipboard.writeText(text);
			setCopyStatus("copied");
		} catch {
			setCopyStatus("failed");
		}
	};

	return (
		<Button
			onClick={handleCopy}
			className={clsx(
				"relative w-full text-sm font-medium flex items-center justify-center bg-neutral-700 text-white dark:bg-white dark:text-neutral-900 px-3 !py-1 gap-1",
				className,
			)}
			disabled={disabled}
		>
			{copyStatus === "copied" ? "Copied" : "Copy Link"}
			<AnimatePresence>
				{copyStarted ? (
					copyStatus === "copied" ? (
						<motion.div
							key="check"
							initial={{ scale: 0 }}
							animate={{ scale: [0, 1.5, 1] }}
							exit={{ scale: 0.8 }}
							className="i-lucide-check text-green-600"
						/>
					) : (
						<motion.div
							key="x"
							initial={{ scale: 0 }}
							animate={{ scale: [0, 1.5, 1] }}
							exit={{ scale: 0.8 }}
							className="i-lucide-x text-red-600"
						/>
					)
				) : (
					<motion.div
						key="copy"
						initial={{ scale: 0 }}
						animate={{ scale: [0, 1] }}
						exit={{ scale: 0.5 }}
						className="i-solar-copy-linear text-white dark:text-black"
					/>
				)}
			</AnimatePresence>
		</Button>
	);
}

export { CopyButton };
