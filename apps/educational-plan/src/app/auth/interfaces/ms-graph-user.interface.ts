export interface MSGraphUser {
  '@odata.context': 'https://graph.microsoft.com/v1.0/$metadata#users/$entity';
  businessPhones: string[];
  displayName: string;
  givenName: string;
  jobTitle: 'Facultatea de Matematica si Informatica' & string;
  mail: string;
  mobilePhone: string | null;
  officeLocation: string | null;
  preferredLanguage: string | null;
  surname: string;
  userPrincipalName: string;
  id: string;
}
