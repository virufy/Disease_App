import React, { useEffect, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { useStateMachine } from 'little-state-machine';

// Components
// import StayInTouch from 'components/StayInTouch';

// Helper
import { scrollToTop } from 'helper/scrollHelper';

// Hooks
import useHeaderContext from 'hooks/useHeaderContext';

import {
  BeforeSubmitText,
  SubmissionIdBox,
  SuccessCircle,
  ThankYouLayout,
  ThankYouTitle,
} from './style';

interface ThankYouLocation {
  submissionId: string;
  patientId?: string;
}

const ThankYou = (p: Wizard.StepProps) => {
  const { t } = useTranslation();

  const [, setActiveStep] = useState(true);
  const { setDoGoBack, setTitle, setType } = useHeaderContext();
  // Ryuma Change
  // const { action } = useStateMachine(resetStore());
  const { state, action } = useStateMachine(); // Access state and action from little-state-machine
  const [submissionId, setSubmissionId] = useState(state['submit-steps']?.patientId || '');

  const history = useHistory();
  
  // Ryuma Change
  React.useEffect(() => {
    action({});
  }, [action]);
  // Function to handle resetting the form
  const handleReset =  useCallback(() => {
    action({});
    localStorage.clear();
  }, [action]);

  const handleDoBack = useCallback(() => {
    if (p.previousStep) {
      setActiveStep(false);
      history.push(p.previousStep);
    } else {
      history.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollToTop();
    setTitle('');
    setType('tertiary');
    setDoGoBack(null);
    if(state['submit-steps']?.patientId)
      setSubmissionId(state['submit-steps']?.patientId);
    handleReset();
  }, [state, handleDoBack, setDoGoBack, setTitle, setType, handleReset]);

  return (
    <ThankYouLayout>
      <SuccessCircle />
      <ThankYouTitle>{t('thankyou:title')}</ThankYouTitle>
      <BeforeSubmitText><Trans i18nKey="thankyou:paragraph1" /></BeforeSubmitText>
      {submissionId && (
        <SubmissionIdBox>
          {t('thankyou:submissionIdLabel', 'Your unique submission ID')}
          <strong>{submissionId}</strong>
        </SubmissionIdBox>
      )}
    </ThankYouLayout>
  );
};

export default React.memo(ThankYou);
