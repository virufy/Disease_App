import { colors } from 'theme/index';
import styled, { css } from 'styled-components';

import { ReactComponent as instaSVG } from 'assets/social/instagram.svg';
import { ReactComponent as linkedinSVG } from 'assets/social/linkedIn.svg';
import { ReactComponent as twitterSVG } from 'assets/social/twitter.svg';


export const ThankYouLayout = styled.div`
  text-align: left;
  padding-left: 20px;
  padding-right: 20px;
  margin: 0 auto;

  @media screen and (${props => props.theme.breakpoints.tablet}){
    max-width: 470px;
    padding-left: 0px;
    padding-right: 0px;
  }
`;

export const Title = styled.h2`
  font-family: "Source Sans Pro";
  font-size: 24px;
  line-height: 1.427;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.realBlack};
  margin-bottom: 0;
  margin-top: 40px;
`;

export const ThankYouTitle = styled.h1`
  font-family: "Open Sans";
  font-weight: bold;
  font-size: 30px;
  line-height: 142.69%;
  text-align: left;
  color: ${props => props.theme.colors.darkBlack};
  margin-bottom: 18px;
  margin-top: 34px;
  text-align: center;
`;

export const SubmissionIdBox = styled.div`
  margin: 40px 0px;
  font-family: 'Source Sans Pro';
  font-size: 14px;
  line-height: 25px;
  text-align: center;
  background-color: ${colors.purple_5};
  color: ${colors.darkBlack};
  border-radius: 10px;
  padding: 16px 0px;
  border-radius: 10px;
`;

export const BeforeSubmitText = styled.p<{$centered?: boolean}>`
  font-family: 'Source Sans Pro';
  font-size: 14px;
  line-height: 142.69%;
  margin-bottom: 2px;
  color: ${colors.darkBlack};

  ${({ $centered }) => $centered && 'text-align: center;'}
`;

export const InstaImage = styled(instaSVG)`
  width: 50%;
  height: auto;
  aspect-ratio: 1;
  display: block;
`;

export const LinkedInImage = styled(linkedinSVG)`
  width: 50%;
  height: auto;
  aspect-ratio: 1;
  display: block;
`;

export const TwitterImage = styled(twitterSVG)`
  width: 50%;
  height: auto;
  aspect-ratio: 1;
  display: block;
`;

export const ImageCard = styled.div`
  display: flex;
  gap: 16px;
  padding: 12px;
  margin-top: 32px;
  justify-content: center;
`;

export const IconContainer = styled.a`
  width: 30%; // Square dimensions for icons
  height: auto;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background-color: #FFF;
  filter: drop-shadow(0px 4px 15px rgba(0, 0, 0, 0.15));
  text-decoration: none;

`;


export const Card = styled.div`
  border-radius: 10px;
  filter: drop-shadow(0px 4px 15px rgba(0, 0, 0, 0.15));
  background: #FFF;
  width: 100%;
  padding: 12px 20px 20px;
  margin-top: 32px;
`;

export const CardTitle = styled.div`
  font-family: "Source Sans Pro";
  font-size: 20px;
  line-height: 1.427;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.realBlack};
`;

export const CardDescription = styled.div`
  font-family: "Open Sans";
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.darkBlack};
  margin-top: 8px;
`;

const baseButton = css`
  background-color: ${({ theme }) => theme.colors.purple};
  
  color: ${({ theme }) => theme.colors.white};
  font-family: "Source Sans Pro";
  font-size: 14px;
  line-height: 24px;
  font-weight: 700;
  
  padding: 13px 0;

  margin-top: 20px;

  text-align: center;
  width: 100%;

  border-radius: 15px;
`;

export const CardLink = styled.a.attrs(() => ({ target: '_blank', rel: 'noopener noreferrer' }))`
  ${baseButton}
  display: block;
  &:hover {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.white};
  }
`;

export const CardButton = styled.button.attrs(() => ({ type: 'button' }))`
  ${baseButton}
  border: none;
`;
