import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { useStateMachine } from 'little-state-machine';

// Components
import Link from 'components/Link';

// Data
import { reportProblemForm } from 'data/reportProblemForm';

// Styles
import { FooterContainer } from './style';

interface FooterReportProblemsProps {
}

const FooterReportProblems = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { state } = useStateMachine();

  const language = state['welcome']?.language;
  let lang;
  
  if (language === 'English') {
    lang = 'enUS';
  } else if (language === 'Arabic') {
    lang = 'enUS';
  } else if (language === 'Japanese') {
    lang = 'ja';
  } else {
    lang = 'enUS';
  }

  if (location.pathname === '/welcome') return null;

  return (
    <FooterContainer>
      {lang && (
        <Link to={reportProblemForm[lang as FeedbackLanguage]} target="_blank">
          { t('footerReportProblems:message')}
        </Link>
      )}
    </FooterContainer>
  );
};

export default React.memo(FooterReportProblems);
