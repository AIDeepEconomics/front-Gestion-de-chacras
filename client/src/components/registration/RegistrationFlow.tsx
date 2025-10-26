import { useState } from 'react';
import { RegistrationChoice } from './RegistrationChoice';
import { FounderRegistration } from './FounderRegistration';
import { InvitedRegistration } from './InvitedRegistration';
import { OrganizationType } from './OrganizationType';
import { CompanyData } from './CompanyData';
import { UserRole } from './UserRole';

type RegistrationStep = 
  | 'choice' 
  | 'founder-form' 
  | 'invited-form' 
  | 'org-type' 
  | 'company-data' 
  | 'user-role';

export function RegistrationFlow() {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('choice');
  const [registrationData, setRegistrationData] = useState<any>({});

  const handleFounderStart = () => {
    setCurrentStep('founder-form');
  };

  const handleInvitedStart = () => {
    setCurrentStep('invited-form');
  };

  const handleFounderNext = (data: any) => {
    setRegistrationData({ ...registrationData, ...data, type: 'founder' });
    setCurrentStep('org-type');
  };

  const handleInvitedComplete = () => {
    // Invited users skip the setup wizard
    setCurrentStep('choice');
  };

  const handleOrgTypeNext = (orgType: string) => {
    setRegistrationData({ ...registrationData, orgType });
    setCurrentStep('company-data');
  };

  const handleCompanyDataNext = (data: any) => {
    setRegistrationData({ ...registrationData, ...data });
    setCurrentStep('user-role');
  };

  const handleBackToChoice = () => {
    setCurrentStep('choice');
    setRegistrationData({});
  };

  switch (currentStep) {
    case 'choice':
      return (
        <RegistrationChoice
          onSelectFounder={handleFounderStart}
          onSelectInvited={handleInvitedStart}
        />
      );
    
    case 'founder-form':
      return (
        <FounderRegistration
          onBack={handleBackToChoice}
          onNext={handleFounderNext}
        />
      );
    
    case 'invited-form':
      return (
        <InvitedRegistration
          onBack={handleBackToChoice}
          onComplete={handleInvitedComplete}
        />
      );
    
    case 'org-type':
      return (
        <OrganizationType
          onNext={handleOrgTypeNext}
        />
      );
    
    case 'company-data':
      return (
        <CompanyData
          onNext={handleCompanyDataNext}
        />
      );
    
    case 'user-role':
      return <UserRole />;
    
    default:
      return null;
  }
}
