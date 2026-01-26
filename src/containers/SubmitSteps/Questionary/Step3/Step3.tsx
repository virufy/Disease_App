import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import usePortal from 'react-useportal';
import { useTranslation } from 'react-i18next';

// Form
import { useForm } from 'react-hook-form';
import { useStateMachine } from 'little-state-machine';

// Update Action
import { updateAction } from 'utils/wizard';

// Header Control
import useHeaderContext from 'hooks/useHeaderContext';

// Utils
import { scrollToTop } from 'helper/scrollHelper';

// Components
import WizardButtons from 'components/WizardButtons';
import ProgressIndicator from 'components/ProgressIndicator';


import {
  QuestionText, MainContainer, QuestionNote, MapContainer
} from '../style';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const Step3 = ({
  previousStep,
  nextStep,
  storeKey,
  metadata,
}: Wizard.StepProps) => {
  // Hooks
  const mapRef = useRef<HTMLDivElement>(null);
  const [center, setCenter] = useState({ lat: 37.3875, lng: -122.0575 });

  const { Portal } = usePortal({
    bindTo: document && document.getElementById('wizard-buttons') as HTMLDivElement,
  });
  const {
    setDoGoBack, setTitle, setType, setSubtitle,
  } = useHeaderContext();
  const history = useHistory();
  const { t } = useTranslation();
  const { state, action } = useStateMachine(updateAction(storeKey));

  // States
  const [activeStep, setActiveStep] = React.useState(true);

  // Form
  const { handleSubmit, formState } = useForm({
    mode: 'onChange',
    defaultValues: state?.[storeKey],
  });

  const handleDoBack = React.useCallback(() => {
    setActiveStep(false);
    if (previousStep) {
      history.push(previousStep);
    } else {
      history.goBack();
    }
  }, [history, previousStep]);

  const {
    isValid,
  } = formState;

  useEffect(() => {
    if (mapRef.current) {
      // Initialize the map centered on Dubai
      const map = L.map(mapRef.current, {
        center: [center.lat, center.lng],
        zoom: 12,
      });

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      // Add a marker at the center of the map
      const marker = L.marker([center.lat, center.lng], {
        icon: customIcon,
      }).addTo(map);

      // Update the marker's position and log the new center coordinates when the map is moved
      map.on('move', () => {
        const newCenter = map.getCenter();
        marker.setLatLng(newCenter); // Keep marker at the new center
        setCenter({ lat: newCenter.lat, lng: newCenter.lng });
      });

      // Cleanup on unmount
      return () => {
        map.remove();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollToTop();
    setTitle(`${t('questionary:title')}`);
    setSubtitle(t(''));
    setType('primary');
    setDoGoBack(() => handleDoBack);
  }, [handleDoBack, setDoGoBack, setTitle, setType, setSubtitle, metadata, t]);

  // Handlers
  const onSubmit = async (values: Wizard.StepProps) => {
    if (values) {
      action(values);
      action({location:center});
      if(!state['submit-steps']?.patientId){
        const patientId = Math.floor(100000 + Math.random() * 900000).toString();
        action({patientId:patientId});
      }
      if (nextStep) {
        setActiveStep(false);
        history.push(nextStep);
      }
    }
  };

  return (
    <MainContainer>
      <ProgressIndicator
        currentStep={metadata?.current}
        totalSteps={metadata?.total}
        progressBar
      />
      <QuestionText first extraSpace hasNote>{t('questionary:locationQuestion.question')}</QuestionText>
      <QuestionNote style={{marginBottom:'10px'}}>{t('questionary:locationQuestion.note')}</QuestionNote>
      <MapContainer ref={mapRef} className="map-container" />

      {activeStep && (
        <Portal>
          <WizardButtons
            leftLabel={t('questionary:nextButton')}
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
