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
  ThankYouLayout,
  ThankYouTitle, ImageCard, IconContainer,
  Card, CardTitle, CardDescription, CardLink, Title, InstaImage, LinkedInImage, TwitterImage
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
      <ThankYouTitle>{t('thankyou:title')}</ThankYouTitle>
      <BeforeSubmitText><Trans i18nKey="thankyou:paragraph1" /></BeforeSubmitText>
      {submissionId && <SubmissionIdBox>
        <Trans i18nKey="thankyou:paragraph2" values={{ submissionId: submissionId }}/>
      </SubmissionIdBox>}

      <BeforeSubmitText>
        <Trans i18nKey="thankyou:paragraph3">
          Make sure to safeguard this submission ID, as you will need it to request Virufy to delete your anonymized
          data in future.
          <br /><br />
          If you later develop symptoms such as cough, fever, or shortness of breath, please come
          back to resubmit your
          latest cough sounds.
        </Trans>
      </BeforeSubmitText>

      <Card>
        <CardTitle>{t('thankyou:DashboardCard.title')}</CardTitle>
        <CardDescription>{t('thankyou:DashboardCard.description')}</CardDescription>
        <CardLink href={'/dubai-map'}>{t('thankyou:DashboardCard.button')}</CardLink>
      </Card>

      <Card>
        <CardTitle>{t('thankyou:DevBio.title')}</CardTitle>
        <CardDescription>{t('thankyou:DevBio.description')}</CardDescription>
        <CardDescription>{t('thankyou:DevBio.connect')}</CardDescription>
        <CardLink href={'https://www.linkedin.com/in/ryuma521/'}>{t('thankyou:DevBio.button1')}</CardLink>
        <CardLink href={'mailto:ryuma.nakahata@virufy.org'}>{t('thankyou:DevBio.button2')}</CardLink>
      </Card>


      <Title>{t('thankyou:stayInTouch', 'Stay in touch!')}</Title>

      <Card>
        <CardTitle>{t('thankyou:DonateCard.title')}</CardTitle>
        <CardDescription>{t('thankyou:DonateCard.description')}</CardDescription>
        <CardLink href={'https://virufy.org/en/'}>{t('thankyou:DonateCard.button')}</CardLink>
      </Card>

      <Card>
        <CardTitle>{t('thankyou:LearnMoreCard.title')}</CardTitle>
        <CardDescription>{t('thankyou:LearnMoreCard.description')}</CardDescription>
        <CardLink href={'https://virufy.org/en/'}>{t('thankyou:LearnMoreCard.button')}</CardLink>
      </Card>

      <Card>
        <CardTitle>{t('thankyou:JoinUsCard.title')}</CardTitle>
        <CardDescription>{t('thankyou:JoinUsCard.description')}</CardDescription>
        <CardLink href={'https://virufy.org/en/get-involved'}>{t('thankyou:JoinUsCard.button')}</CardLink>
      </Card>

      <Title>{t('thankyou:followUs', 'Follow Us')}</Title>
      <ImageCard>
        <IconContainer  href="https://www.instagram.com/virufy/" target="_blank">
          <InstaImage />
        </IconContainer>
        <IconContainer  href="https://www.linkedin.com/company/virufy/" target="_blank">
          <LinkedInImage />
        </IconContainer>
        <IconContainer  href="https://x.com/VirufyOrg" target="_blank">
          <TwitterImage />
        </IconContainer>
      </ImageCard>

      {/* <StayInTouch /> */}
      {/* Ryuma Change
      <div>
        <h2>Debug: Visualize all collected JSON data:</h2>
        Display the stored data for debugging
        <pre>{JSON.stringify(state, null, 2)}</pre>

        Button to reset the store
        <button onClick={handleReset}>Reset/Erase Stored Data</button>
      </div> */}
    </ThankYouLayout>
  );
};

export default React.memo(ThankYou);
