import { useNavigation } from "react-router";
import React from "react";

function PendingUI() {
	const navigation = useNavigation();
	const intervalRef = React.useRef<ReturnType<typeof setTimeout>>();
	const divRef = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		if (!divRef.current) return;

		const loader = divRef.current;
		if (["loading", "submitting"].includes(navigation.state)) {
			intervalRef.current = setInterval(() => {
				const previous = Number.parseInt(loader.style.width);

				if (previous >= 80) {
					clearInterval(intervalRef.current);
					return;
				}

				loader.style.width = `${previous + 2}%`;
			}, 200);
		}

		return () => {
			if (intervalRef.current) {
				loader.style.width = "100%";
				setTimeout(() => {
					loader.style.width = "0%";
				}, 200);

				clearInterval(intervalRef.current);
				intervalRef.current = undefined;
			}
		};
	}, [navigation]);

	return (
		<div
			className="loader sticky left-0 top-0 h-1 -mb-1 bg-current transition-[width] duration-200 transition-ease-in z-20"
			style={{ width: "0%" }}
			ref={divRef}
		/>
	);
}

export { PendingUI };
