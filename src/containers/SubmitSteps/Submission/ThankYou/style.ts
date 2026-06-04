import { colors } from 'theme/index';
import styled from 'styled-components';

export const ThankYouLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 24px 60px;
  margin: 0 auto;
  min-height: 70vh;

  @media screen and (${props => props.theme.breakpoints.tablet}){
    max-width: 470px;
    padding-left: 0;
    padding-right: 0;
  }
`;

export const SuccessCircle = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: ${colors.purple};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 28px;
  box-shadow: 0px 8px 24px rgba(53, 120, 222, 0.35);

  &::after {
    content: '✓';
    color: #fff;
    font-size: 36px;
    font-weight: 700;
    line-height: 1;
  }
`;

export const ThankYouTitle = styled.h1`
  font-family: "Open Sans";
  font-weight: 700;
  font-size: 28px;
  line-height: 1.3;
  text-align: center;
  color: ${colors.darkBlack};
  margin: 0 0 12px;
`;

export const BeforeSubmitText = styled.p`
  font-family: 'Source Sans Pro';
  font-size: 15px;
  line-height: 1.6;
  text-align: center;
  color: ${colors.darkGray};
  margin: 0 0 8px;
  max-width: 320px;
`;

export const SubmissionIdBox = styled.div`
  margin-top: 36px;
  width: 100%;
  background-color: ${colors.midGray};
  border: 1.5px solid ${colors.purple_10};
  border-radius: 14px;
  padding: 20px 24px;
  text-align: center;

  font-family: 'Source Sans Pro';
  font-size: 14px;
  line-height: 1.7;
  color: ${colors.darkGray};

  strong, b {
    display: block;
    font-size: 17px;
    font-weight: 700;
    color: ${colors.purple};
    margin-top: 6px;
    letter-spacing: 0.5px;
    word-break: break-all;
  }
`;
