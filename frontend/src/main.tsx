import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<div className="container mx-auto mt-10">
			<App />
		</div>
	</StrictMode>
);
