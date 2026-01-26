import React, { useEffect, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useStateMachine } from 'little-state-machine';
import { ErrorMessage } from '@hookform/error-message';
import { useTranslation } from 'react-i18next';

// Icons
import { ReactComponent as ExclamationSVG } from 'assets/icons/exclamationCircle.svg';

// Helper
import { scrollToTop } from 'helper/scrollHelper';

// Hooks
import useHeaderContext from 'hooks/useHeaderContext';

import { ImageProcessing, TextErrorContainer} from '../style';

interface StructuredData {
  patientId: string;
  gender: string;
  age: number;
  conditions: string[]; 
  latitude: number;
  longitude: number;
}

const apiUrl = process.env.REACT_APP_API_URL!;

// Helper function to convert file to Base64
const toBase64 = (file: Blob): Promise<string> => 
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);  // Get the Base64 part only
    reader.onerror = (error) => reject(error);
});

const Sending = (p: Wizard.StepProps) => { 
  const [, setActiveStep] = useState(true);
  const { setDoGoBack, setTitle, setType } = useHeaderContext();
  const { t } = useTranslation();
  const { state } = useStateMachine();
  const history = useHistory();
  const [error, setError] = React.useState<string | null>(null);


  const sendDataToBackend = useCallback(async (): Promise<void> => {
    try {
      const structuredData: StructuredData = {
        patientId: state['submit-steps']?.patientId,
        gender: state['submit-steps']?.biologicalSex,
        age: state['submit-steps']?.ageGroup,
        conditions: state['submit-steps']?.currentMedicalCondition,
        latitude: state['submit-steps']?.location['lat'],
        longitude: state['submit-steps']?.location['lng'],
      };
      // Retrieve files from the state (either recorded or uploaded)
      const coughFile = state['submit-steps']?.recordYourCough?.recordingFile || state['submit-steps']?.recordYourCough?.uploadedFile;
      
      if ((coughFile instanceof Blob)) {
        const coughBase64 = await toBase64(coughFile);
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            structuredData: structuredData,
            coughFile: coughBase64,
          }),
        });

        const result = await response.json();
        console.log('Response:', result);
        if (p.nextStep)
          history.push(p.nextStep)
      } else {
        console.error('Files not found.');
      }
    } catch {
      console.error('Error sending data: Failed to send data.');
      setError('Failed to send data.');
    }
  }, [state, history, p.nextStep]);

  const handleDoBack = useCallback(() => {
    if (p.previousStep) {
      setActiveStep(false);
      history.push(p.previousStep);
    } else {
      history.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const mocksendDataToBackend = useCallback(() => {
    console.log('MOCK: sending to backend');
    console.log(state);
    console.log(
      "patientId", state['submit-steps']?.patientId,
      "Conditions",state['submit-steps']?.currentMedicalCondition, 
      "location",state['submit-steps']?.location['lat'], 
      "location",state['submit-steps']?.location['lng'], 
      "sick",state['submit-steps']?.sick,
      "gender",state['submit-steps']?.biologicalSex,
      "age",state['submit-steps']?.ageGroup,
    );
    setTimeout(() => {
      if (p.nextStep) {
        history.push(p.nextStep);
      }
    }, 2000);
  }, [state, history, p.nextStep]);

  useEffect(() => {
    scrollToTop();
    setTitle('');
    setType('tertiary');
    setDoGoBack(null);
    sendDataToBackend();
    // mocksendDataToBackend();
  }, [handleDoBack, setDoGoBack, setTitle, setType, sendDataToBackend, mocksendDataToBackend]);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '50px' }}>
        <h1>{t('submit:submitting', 'Sending...')}</h1>
      </div>
      <ImageProcessing />
      {error && (
        <ErrorMessage
          errors={{ error }}
          name="error"
          render={() => (
            <TextErrorContainer>
              <ExclamationSVG />
              {error}
            </TextErrorContainer>
          )}
        />
      )}
    </>
  );
};

export default React.memo(Sending);
