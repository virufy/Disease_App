import React, { useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import usePortal from 'react-useportal';
import { isMobile } from 'react-device-detect';

// Form
import { useForm, Controller } from 'react-hook-form';
import { useStateMachine } from 'little-state-machine';
import { yupResolver } from '@hookform/resolvers';
import { ErrorMessage } from '@hookform/error-message';
import * as Yup from 'yup';

// Components
import WizardButtons from 'components/WizardButtons';
import Link from 'components/Link';
import Checkbox from 'components/Checkbox';
import { BlackText } from 'components/Texts';

// Update Action
import { updateAction } from 'utils/wizard';

// Header Control
import useHeaderContext from 'hooks/useHeaderContext';

// Hooks
// import useEmbeddedFile from 'hooks/useEmbeddedFile';

// Utils
// import { buildConsentFilePath } from 'helper/consentPathHelper';
import { scrollToTop } from 'helper/scrollHelper';
import { currentCountry } from 'utils/currentCountry';

// Data
import { consentPdf } from 'data/consentPdf';

// Styles
import {
  ContainerShapeDown,
  InnerContainerShapeDown,
  WelcomeContent,
  WelcomeStyledFormAlternative,
  CheckboxTitle, ChevronSVG, UpChevronSVG
} from '../style';

const schema = Yup.object().shape({
  agreedConsentTerms: Yup.boolean().required().default(false).oneOf([true]),
  agreedPolicyTerms: Yup.boolean().required().default(false).oneOf([true]),
  agreedDataUse: Yup.boolean().required().default(false).oneOf([true]),
  agreedCollection: Yup.boolean().required().default(false).oneOf([true]),
});

type Step3Type = Yup.InferType<typeof schema>;

const Step3 = (p: Wizard.StepProps) => {
  const { Portal } = usePortal({
    bindTo: document && document.getElementById('wizard-buttons') as HTMLDivElement,
  });
  const [activeStep, setActiveStep] = React.useState(true);
  const { setType, setDoGoBack, setSubtitle } = useHeaderContext();
  const [showConsentForm, setShowConsentForm] = React.useState(false);
  const { state, action } = useStateMachine(updateAction(p.storeKey));

  const store = state?.[p.storeKey];

  const {
    control, handleSubmit, formState,
  } = useForm({
    defaultValues: store,
    resolver: yupResolver(schema),
    context: {
      country: currentCountry,
    },
    mode: 'onChange',
  });
  const { errors, isValid } = formState;
  const history = useHistory();
  // const { isLoadingFile, file: consentFormContent } = useEmbeddedFile(
  //   buildConsentFilePath(currentCountry, state.welcome.language),
  // );

  const onSubmit = async (values: Step3Type) => {
    if (values) {
      action(values);
      if (p.nextStep) {
        setActiveStep(false);
        history.push(p.nextStep);
      }
    }
  };

  const doBack = useCallback(() => {
    if (p.previousStep) {
      setActiveStep(false);
      history.push(p.previousStep);
    } else {
      history.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { t } = useTranslation();

  useEffect(() => {
    scrollToTop();
    setDoGoBack(() => doBack);
    setType('secondary');
    setSubtitle(t('consent:title'));
  }, [doBack, setDoGoBack, setType, setSubtitle, t]);

  return (
    <WelcomeStyledFormAlternative>
      <ContainerShapeDown isMobile={isMobile}>
        <InnerContainerShapeDown>
        </InnerContainerShapeDown>
      </ContainerShapeDown>
      <WelcomeContent mt={0}>
        <BlackText>
          <Trans i18nKey="consent:paragraph1" components={{ 1: <a href="https://drive.google.com/file/d/1EB_9q8nSxvJXWMtCfxCWmisM-n03TJYz/view" target='blank'>Privacy Policy</a> }}>
          Virufy cares about your privacy and is advised by licensed data privacy experts. The information and recordings you provide will only be used for the purposes described in our privacy policy and consent form. Please read the consent form:
          </Trans>
        </BlackText>
        <BlackText>
          <span style={{ textDecoration: "underline" }} onClick={() => {
            if(showConsentForm) setShowConsentForm(false);
            else setShowConsentForm(true);
          }}>
            <Trans i18nKey="consent:read">
              consent form
            </Trans>
            {!showConsentForm && <UpChevronSVG/>}
            {showConsentForm && <ChevronSVG/>}
          </span>
        </BlackText>
        {showConsentForm && 
        <BlackText>
            <Trans i18nKey="consent:form1"/>
            <Trans i18nKey="consent:form2"/>
            <Trans i18nKey="consent:form3"/>
            <Trans i18nKey="consent:form4"/>
            <Trans i18nKey="consent:form5"/>
            <Trans i18nKey="consent:form6"/>
            <Trans i18nKey="consent:form7"/>
            <Trans i18nKey="consent:form8"/>
            <Trans i18nKey="consent:form9"/>
            <Trans i18nKey="consent:form10"/>
            <Trans i18nKey="consent:form11"/>
            <Trans i18nKey="consent:form12"/>
            <Trans i18nKey="consent:form13"/>
            <Trans i18nKey="consent:form14" components={{ul: <ul />, li: <li />}}/>
            <Trans i18nKey="consent:form15" components={{ul: <ul />, li: <li />}}/>
            <Trans i18nKey="consent:form16"/>
            <Trans i18nKey="consent:form17" components={{ul: <ul />, li: <li />}}/>
            <Trans i18nKey="consent:form18" components={{ul: <ul />, li: <li />}}/>
            <Trans i18nKey="consent:form19"/>
            <Trans i18nKey="consent:form20" components={{ul: <ul />, li: <li />}}/>
            <Trans i18nKey="consent:form21"/>
            <Trans i18nKey="consent:form22"/>
            <Trans i18nKey="consent:form23"/>
            <Trans i18nKey="consent:form24"/>
            <Trans i18nKey="consent:form25"/>
            <Trans i18nKey="consent:form26"/>
            <Trans i18nKey="consent:form27"/>
            <Trans i18nKey="consent:form28"/>
            <Trans i18nKey="consent:form29"/>
        </BlackText>}
        <BlackText>
          <Trans i18nKey="consent:paragraph3">
            By checking the below boxes, you are granting your explicit, freely given, and informed consent to Virufy to
            collect, process, and share your information for the purposes indicated above and as provided in greater
            detail in our Privacy Policy. You can print
            a copy of this Consent Form for your personal records by
            accessing <Link to={consentPdf[currentCountry]} target="_blank">Consent Form</Link> <strong>Fix this: currently japanese consent form</strong>
          </Trans>
        </BlackText>

        <CheckboxTitle>
          {t('consent:pleaseConfirm', 'Please confirm the following:')}
        </CheckboxTitle>

        <Controller
          control={control}
          name="agreedConsentTerms"
          defaultValue={false}
          render={({ onChange, value }) => (
            <Checkbox
              id="ConsentTerms"
              label={(
                <Trans i18nKey="consent:certify">
                  I certify that I am at least 18 years old and agree to the terms of the Consent Form.                </Trans>
              )}
              name="agreedConsentTerms"
              onChange={e => onChange(e.target.checked)}
              value={value}
            />
          )}
        />

        <Controller
          control={control}
          name="agreedPolicyTerms"
          defaultValue={false}
          render={({ onChange, value }) => (
            <Checkbox
              id="PolicyTerms"
              label={(
                <Trans i18nKey="consent:agree" components={{ 1: <a href="https://drive.google.com/file/d/1EB_9q8nSxvJXWMtCfxCWmisM-n03TJYz/view" target='blank'>Privacy Policy</a> }}>
                  I agree to the terms of the Virufy Privacy Policy.                
                </Trans>
              )}
              name="agreedPolicyTerms"
              onChange={e => onChange(e.target.checked)}
              value={value}
            />
          )}
        />

        <Controller
          control={control}
          name="agreedDataUse"
          defaultValue={false}
          render={({ onChange, value }) => (
            <Checkbox
              id="DataUse"
              label={(
                <Trans i18nKey="consent:MLuse">
                  I hereby acknowledge and agree that processing shall be done for the purposes indicated above and, in particular but without limitation, for training artificial intelligence algorithms to analyze cough audio recordings to better determine spread of respiratory disease.                </Trans>
              )}
              name="agreedDataUse"
              onChange={e => onChange(e.target.checked)}
              value={value}
            />
          )}
        />

        <Controller
          control={control}
          name="agreedCollection"
          defaultValue={false}
          render={({ onChange, value }) => (
            <Checkbox
              id="Collection"
              label={(
                <Trans i18nKey="consent:collection">
                  I hereby expressly consent to the collection and processing of my personal information, biometric information, and health information.                </Trans>
              )}
              name="agreedCollection"
              onChange={e => onChange(e.target.checked)}
              value={value}
            />
          )}
        />

        <p><ErrorMessage errors={errors} name="name" /></p>
        {activeStep && (
          <Portal>
            <WizardButtons
              invert
              leftLabel={t('consent:cooperateButton')}
              leftHandler={handleSubmit(onSubmit)}
              leftDisabled={!isValid}
            />
          </Portal>
        )}
      </WelcomeContent>
    </WelcomeStyledFormAlternative>
  );
};

export default React.memo(Step3);
