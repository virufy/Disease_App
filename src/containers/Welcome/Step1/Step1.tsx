import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { useStateMachine } from 'little-state-machine';
import usePortal from 'react-useportal';

// Form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import * as Yup from 'yup';

// Icons
import HeaderSplash from 'assets/images/baseLogoSplash.png';

// Update Action
import { updateAction, resetStore } from 'utils/wizard';

// Header Control
import useHeaderContext from 'hooks/useHeaderContext';

// Helper
import { scrollToTop } from 'helper/scrollHelper';

// Styles
import { BlackText } from 'components/Texts';
import WizardButtons from 'components/WizardButtons';
import {
  WelcomeContent, WelcomeStyledForm,
  BoldBlackText, WelcomeSelect,
  HeaderImageContainer,
  HeaderImage,
  LogoWhiteBG,
} from '../style';

const languageList = ['English', 'Japanese', 'Arabic']
const languageOptions = languageList.map(language => ({ label: language, value: language }));

const schema = Yup.object().shape({
  language: Yup.string().required(),
}).defined();

type Step1Type = Yup.InferType<typeof schema>;

const Step1 = (p: Wizard.StepProps) => {
  const [activeStep, setActiveStep] = React.useState(true);
  const { Portal } = usePortal({
    bindTo: document && document.getElementById('wizard-buttons') as HTMLDivElement,
  });
  const {
    setType, setDoGoBack, setLogoSize,
  } = useHeaderContext();
  const resetExecuted = React.useRef(false);

  const { state, actions } = useStateMachine({ update: updateAction(p.storeKey), reset: resetStore() });

  const store = state?.[p.storeKey];

  const {
    control,
    formState,
    handleSubmit,
    watch,
    reset,
  } = useForm({
    defaultValues: store,
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const history = useHistory();
  const { isValid } = formState;

  useEffect(() => {
    if (resetExecuted.current) {
      resetExecuted.current = false;
      reset(store);
    }
  }, [store, reset]);

  const onSubmit = async (values: Step1Type) => {
    if (values) {
      actions.update(values);
      if (p.nextStep) {
        setActiveStep(false);
        history.push(p.nextStep);
      }
    }
  };

  useEffect(() => {
    scrollToTop();
    // Hide back arrow in header if neccesary
    setDoGoBack(null);
    setType('tertiary');
    setLogoSize('big');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);
  const { t, i18n } = useTranslation();

  const lang = watch('language');

  useEffect(() => {
    if(lang === 'Arabic')
      i18n.changeLanguage('ar');
    else if(lang === "English")
      i18n.changeLanguage('enUS');
    else
      i18n.changeLanguage('ja');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n, lang]);

  return (
    <>
      <WelcomeStyledForm>
        <HeaderImageContainer>
          <HeaderImage
            src={HeaderSplash}
          />
          <LogoWhiteBG />
        </HeaderImageContainer>
        <WelcomeContent mt={4}>

          <BoldBlackText>
            {t('main:language', 'Language')}
          </BoldBlackText>

          {/* Language */}
          <Controller
            control={control}
            name="language"
            defaultValue={languageOptions[0].value}
            render={({ onChange, value: valueController }) => (
              <WelcomeSelect
                placeholder={t('main.selectYourLanguage', 'Select your language')}
                options={languageOptions}
                onChange={(e: any) => { onChange(e?.value); }}
                value={languageOptions.find(option => option.value === valueController)}
                className="custom-select"
                classNamePrefix="custom-select"
                isDisabled={languageOptions?.length <= 1}
              />
            )}
          />

          <BlackText style={{marginTop:'60px'}}>
            <Trans i18nKey="main:servicePurposeText">
              {/* eslint-disable-next-line max-len */}
              <p style={{textAlign:'left'}}><strong>Please note:</strong> This form is for data collection only. It will not predict or diagnose any disease, disorder, or other health condition. Virufy is conducting research and will use the information you provide for research. The Virufy app doesn’t replace a doctor. Remember that it is your responsibility to seek medical advice from your doctor. 
              </p>
            </Trans>
          </BlackText>

          {/* <BlackText $textCenter>
            <Trans i18nKey="main:terms">
              <strong>
              By proceeding you accept the <br/>
              terms of our Privacy Policy
              </strong>
            </Trans>
          </BlackText> */}

          {
            activeStep && (
              <Portal>
                <WizardButtons
                  invert
                  leftLabel={t('main:agree', 'Consent')}
                  leftHandler={handleSubmit(onSubmit)}
                  leftDisabled={!isValid}
                />
              </Portal>
            )
          }
        </WelcomeContent>
      </WelcomeStyledForm>
    </>
  );
};

export default React.memo(Step1);
