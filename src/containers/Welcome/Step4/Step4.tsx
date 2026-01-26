import React, { useEffect, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import usePortal from 'react-useportal';
import { isMobile } from 'react-device-detect';

// Header Control
import { useTranslation, Trans } from 'react-i18next';
import useHeaderContext from 'hooks/useHeaderContext';

// Components
import WizardButtons from 'components/WizardButtons';
import { BlackText } from 'components/Texts';

// Utils
import { scrollToTop } from 'helper/scrollHelper';

// Styles
import {
  ContainerShapeDown,
  InnerContainerShapeDown,
  WelcomeContent,
  WelcomeItemList,
  WelcomeItemListItem,
  WelcomeStyledFormAlternative,
} from '../style';

const defaultAdviseList = [
  'Please use your own device and wear a face mask when appropriate.',
  'Disinfect your device and any nearby surfaces after recording your cough/speech.',
  ' If you have an underlying condition where coughing increases your risks  of suffering an illness, please consult your doctor before participating.',
  'If you think your symptoms are getting worse, contact your doctor.',
];

const Step4 = (p: Wizard.StepProps) => {
  const { Portal } = usePortal({
    bindTo: document && document.getElementById('wizard-buttons') as HTMLDivElement,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeStep, setActiveStep] = useState(true);
  const {
    setType, setSubtitle, setDoGoBack, setTitle, title,
  } = useHeaderContext();

  const history = useHistory();

  const handleNext = React.useCallback(() => {
    if (p.nextStep) {
      history.push(p.nextStep);
    }
  }, [history, p.nextStep]);

  const doBack = useCallback(() => {
    if (p.previousStep) {
      setActiveStep(false);
      history.push(p.previousStep);
    } else {
      history.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Clear title if needed
    if (title) setTitle('');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  const { t } = useTranslation();

  useEffect(() => {
    scrollToTop();
    setDoGoBack(() => doBack);
    setType('secondary');
    setSubtitle(t('beforeStart:title'));
  }, [doBack, setDoGoBack, setType, setSubtitle, t]);

  const adviseList: string[] = t('beforeStart:advise_list', { returnObjects: true, defaultValue: defaultAdviseList });

  return (
    <WelcomeStyledFormAlternative>
      <ContainerShapeDown isMobile={isMobile}>
        <InnerContainerShapeDown>
          <BlackText>
            <Trans i18nKey="beforeStart:subtitle">
              <strong>To ensure safety, we advise you to:</strong>
            </Trans>
          </BlackText>
        </InnerContainerShapeDown>
      </ContainerShapeDown>
      <WelcomeContent mt={20}>
        <WelcomeItemList>
          {adviseList.map((advise, idx) => (
            // eslint-disable-next-line react/no-array-index-key
            <WelcomeItemListItem key={`advise_${idx}`}>{advise}</WelcomeItemListItem>
          ))}
        </WelcomeItemList>

        {activeStep && (
          <Portal>
            <WizardButtons
              leftLabel={t('beforeStart:startButton')}
              leftHandler={handleNext}
              invert
            />
          </Portal>
        )}
      </WelcomeContent>
    </WelcomeStyledFormAlternative>
  );
};

export default React.memo(Step4);
