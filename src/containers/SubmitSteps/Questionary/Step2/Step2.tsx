import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import usePortal from 'react-useportal';
import { useTranslation } from 'react-i18next';

// Form
import { useForm, Controller } from 'react-hook-form';
import { useStateMachine } from 'little-state-machine';
import { yupResolver } from '@hookform/resolvers';
import { ErrorMessage } from '@hookform/error-message';
import * as Yup from 'yup';

// Update Action
import { updateAction } from 'utils/wizard';

// Header Control
import useHeaderContext from 'hooks/useHeaderContext';

// Utils
import { scrollToTop } from 'helper/scrollHelper';

// Components
import WizardButtons from 'components/WizardButtons';
import OptionList from 'components/OptionList';
import ProgressIndicator from 'components/ProgressIndicator';

// Icons
import { ReactComponent as ExclamationSVG } from 'assets/icons/exclamationCircle.svg';

// Styles
import { TextErrorContainer } from 'containers/Welcome/style';
import {
  QuestionText, MainContainer, QuestionAllApply
} from '../style';

const schema = Yup.object({
  currentMedicalCondition: Yup.array().of(Yup.string().required()).required('currentMedicalConditionRequired').default([])
  .test('SelecteOne', 'Select one', v => !(!!v && v.length > 1 && (v.includes('none')))),
}).defined();

type Step1Type = Yup.InferType<typeof schema>;

const Step2 = ({
  previousStep,
  nextStep,
  storeKey,
  metadata,
}: Wizard.StepProps) => {
  // Hooks
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
  const {
    control, handleSubmit, formState,
  } = useForm({
    mode: 'onChange',
    defaultValues: state?.[storeKey],
    resolver: yupResolver(schema),
  });
  const { errors } = formState;

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
    scrollToTop();
    setTitle(`${t('questionary:title')}`);
    setSubtitle(t(''));
    setType('primary');
    setDoGoBack(() => handleDoBack);
  }, [handleDoBack, setDoGoBack, setTitle, setType, setSubtitle, metadata, t]);

  // Handlers
  const onSubmit = async (values: Step1Type) => {
    if (values) {
      action(values);
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

      <QuestionText extraSpace hasNote> {t('questionary:medical.question', 'Which of the below medical conditions do you currently have?')}<br/>
        <QuestionAllApply>{t('questionary:medical.allThatApply')}</QuestionAllApply>
      </QuestionText>

      <Controller
        control={control}
        name="currentMedicalCondition"
        defaultValue={[]}
        render={({ onChange, value }) => (
          <OptionList
            isCheckbox
            enableOther={true}
            otherPlaceholder= {t('questionary:medical.otherPlaceholder', 'Please specify')}
            value={{ selected: value || [] }}  
            onChange={(v) => onChange(v.selected || [])}
            items={[
              {
                value: 'none',
                label: t('questionary:medical.options.none'),
              },
              {
                value: 'heavysmoker',
                label: t('questionary:medical.options.heavysmoker'),
              },
              {
                value: 'cold',
                label: t('questionary:medical.options.cold'),
              },
              {
                value: 'influenza',
                label: t('questionary:medical.options.influenza'),
              },
              {
                value: 'covid',
                label: t('questionary:medical.options.covid'),
              },
              {
                value: 'sars',
                label: t('questionary:medical.options.sars'),
              },
              {
                value: 'rsv',
                label: t('questionary:medical.options.rsv'),
              }, 
            ]}
            excludableValues={['none']}
          />
        )}
      />
      {/* Bottom Buttons */}
      <ErrorMessage
        errors={errors}
        name="currentMedicalCondition"
        render={({ message }) => (
          <TextErrorContainer>
            <ExclamationSVG />
            {t(`main:${message}`, 'Please select at least one option')}
          </TextErrorContainer>
        )}
      />

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

export default React.memo(Step2);
