import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import usePortal from "react-useportal";
import { useTranslation } from "react-i18next";

// Form
import { useForm } from "react-hook-form";
import { useStateMachine } from "little-state-machine";

// Update Action
import L from "leaflet";
import { updateAction } from "utils/wizard";

// Header Control
import useHeaderContext from "hooks/useHeaderContext";

// Utils
import { scrollToTop } from "helper/scrollHelper";

// Components
import WizardButtons from "components/WizardButtons";
import ProgressIndicator from "components/ProgressIndicator";

import {
	QuestionText,
	MainContainer,
	QuestionNote,
	MapContainer
} from "../style";

import "leaflet/dist/leaflet.css";

/* -------------------- Map Config -------------------- */

const customIcon = new L.Icon({
	iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

const LOCATIONS = {
	siliconValley: {
		label: "Silicon Valley",
		lat: 37.3875,
		lng: -122.0575,
		zoom: 12
	},
	dubai: {
		label: "Dubai",
		lat: 25.2048,
		lng: 55.2708,
		zoom: 12
	}
} as const;

type LocationKey = keyof typeof LOCATIONS;

/* -------------------- Component -------------------- */

const Step3 = ({
	previousStep,
	nextStep,
	storeKey,
	metadata
}: Wizard.StepProps) => {
	// Refs
	const mapContainerRef = useRef<HTMLDivElement>(null);
	const leafletMapRef = useRef<L.Map | null>(null);
	const markerRef = useRef<L.Marker | null>(null);

	// State
	const [selectedLocation, setSelectedLocation] =
		useState<LocationKey>("siliconValley");

	const [center, setCenter] = useState<{ lat: number; lng: number }>({
		lat: LOCATIONS.siliconValley.lat,
		lng: LOCATIONS.siliconValley.lng
	});

	const [activeStep, setActiveStep] = useState(true);

	// Wizard / App hooks
	const history = useHistory();
	const { t } = useTranslation();
	const { state, action } = useStateMachine(updateAction(storeKey));

	const { setDoGoBack, setTitle, setType, setSubtitle } = useHeaderContext();

	const { Portal } = usePortal({
		bindTo: document.getElementById("wizard-buttons") as HTMLDivElement
	});

	// Form
	const { handleSubmit, formState } = useForm({
		mode: "onChange",
		defaultValues: state?.[storeKey]
	});

	const { isValid } = formState;

	/* -------------------- Map Init (once) -------------------- */

	useEffect(() => {
		if (!mapContainerRef.current || leafletMapRef.current) return;

		const { lat, lng, zoom } = LOCATIONS[selectedLocation];

		const map = L.map(mapContainerRef.current, {
			center: [lat, lng],
			zoom
		});

		leafletMapRef.current = map;

		L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
			attribution: "&copy; OpenStreetMap contributors"
		}).addTo(map);

		const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
		markerRef.current = marker;

		map.on("move", () => {
			const newCenter = map.getCenter();
			marker.setLatLng(newCenter);
			setCenter({ lat: newCenter.lat, lng: newCenter.lng });
		});

		return () => {
			map.remove();
			leafletMapRef.current = null;
		};
		// eslint-disable-next-line
	}, []);

	/* -------------------- Location Switch -------------------- */

	useEffect(() => {
		const map = leafletMapRef.current;
		const marker = markerRef.current;
		if (!map || !marker) return;

		const { lat, lng, zoom } = LOCATIONS[selectedLocation];

		map.setView([lat, lng], zoom, { animate: true });
		marker.setLatLng([lat, lng]);
		setCenter({ lat, lng });
	}, [selectedLocation]);

	/* -------------------- Header -------------------- */

	const handleDoBack = React.useCallback(() => {
		setActiveStep(false);
		if (previousStep) {
			history.push(previousStep);
		} else {
			history.goBack();
		}
	}, [history, previousStep]);

	useEffect(() => {
		scrollToTop();
		setTitle(t("questionary:title"));
		setSubtitle("");
		setType("primary");
		setDoGoBack(() => handleDoBack);
	}, [handleDoBack, setDoGoBack, setTitle, setType, setSubtitle, t, metadata]);

	/* -------------------- Submit -------------------- */

	const onSubmit = async (values: Wizard.StepProps) => {
		if (!values) return;

		action(values);
		action({ location: center });

		if (!state["submit-steps"]?.patientId) {
			const patientId = Math.floor(100000 + Math.random() * 900000).toString();
			action({ patientId });
		}

		if (nextStep) {
			setActiveStep(false);
			history.push(nextStep);
		}
	};

	/* -------------------- Render -------------------- */

	return (
		<MainContainer>
			<ProgressIndicator
				currentStep={metadata?.current}
				totalSteps={metadata?.total}
				progressBar
			/>

			<QuestionText first extraSpace hasNote>
				{t("questionary:locationQuestion.question")}
			</QuestionText>

			<QuestionNote style={{ marginBottom: "10px" }}>
				{t("questionary:locationQuestion.note")}
			</QuestionNote>

			{/* Location Selector */}
			<select
				value={selectedLocation}
				onChange={(e) => setSelectedLocation(e.target.value as LocationKey)}
				style={{
					marginBottom: "12px",
					padding: "6px",
					maxWidth: "250px"
				}}
			>
				<option value="siliconValley">Silicon Valley</option>
				<option value="dubai">Dubai</option>
			</select>

			<MapContainer ref={mapContainerRef} className="map-container" />

			{activeStep && (
				<Portal>
					<WizardButtons
						leftLabel={t("questionary:nextButton")}
						leftHandler={handleSubmit(onSubmit)}
						leftDisabled={!isValid}
						invert
					/>
				</Portal>
			)}
		</MainContainer>
	);
};

export default React.memo(Step3);
