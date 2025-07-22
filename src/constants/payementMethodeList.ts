import { PaymentMethodsImages } from "./images";

export type PaymentMethodItemType = {
    id: number;
    name: string;
    image: any;
    path: string;
}

export const paymentMethodsList : PaymentMethodItemType[] = [
    { id: 1, name: 'Orange Money', image: PaymentMethodsImages.orangeMoney, path: 'orange-money' },
    { id: 2, name: 'Moov Money', image: PaymentMethodsImages.moovMoney, path: 'moov-money' },
    { id: 3, name: 'Coris Money', image: PaymentMethodsImages.corisMoney, path: 'coris-money' },
    { id: 4, name: 'Carte de crédit', image: PaymentMethodsImages.creditCard, path: 'credit-card' },
    { id: 5, name: 'LigdiCash', image: PaymentMethodsImages.ligdiCash, path: 'ligdi-cash' },
    { id: 6, name: 'Wave', image: PaymentMethodsImages.wave, path: 'wave' },
    { id: 7, name: 'Sank', image: PaymentMethodsImages.sank, path: 'sank' },

];

export const getPaymentMethod = (path: string) : PaymentMethodItemType | undefined => {
    return paymentMethodsList.find((method) => method.path === path);
}

export const getPaymentMethodProcedureText = (provider: string,price: string) : string => {
    switch(provider) {
        case 'orange-money':
          return `Pour payer avec Orange Money, veuillez suivre ces étapes :
    
    1. Composez le code USSD :
       *144*4*6*${price}#
    2. Vous recevrez un code OTP par SMS.
    3. Entrez le code OTP pour confirmer le paiement. `;
          
        case 'moov-money':
          return `Pour payer avec Moov Money, suivez ces étapes :
    
    1. Composez le code USSD :
       *555*6*${price}#
    2. Vous serez invité à entrer votre code secret pour confirmer. 
    
    Ou via l’application Moov Money :
    a. Téléchargez et ouvrez l’app.
    b. Sélectionnez “Biens et services” ou “Factures”.
    c. Entrez le montant (${price} XOF).
    d. Confirmez avec votre code secret. `;
    
        case 'coris-money':
          return `Pour payer avec Coris Money, deux méthodes :
    
    **Via USSD :**
    1. Composez :
       *3416#
    2. Choisissez “Paiement” puis “Facture” ou “Biens et services”.
    3. Suivez les menus, entrez le montant (${price}) et le code secret pour confirmer. 
    
    **Via l’application Coris Money :**
    1. Ouvrez l’application.
    2. Allez dans le menu “Facture”.
    3. Sélectionnez le type (ex. électricité SONABEL/Cash Power).
    4. Entrez le montant (${price}) et les références (ex. numéro de compteur).
    5. Validez avec votre code secret. Vous recevrez un reçu + SMS. `;
    
        case 'credit-card':
          return `Pour payer par Carte de crédit, l’utilisateur :
    1. Saisit les informations CB (numéro, date, CVV).
    2. Valide l’authentification 3D Secure via OTP ou virement bancaire.`;
    
        case 'ligdi-cash':
          return `Pour LigdiCash, veuillez contacter votre banque (BNI/BCEAO) pour obtenir le code USSD ou l’application correspondante, car les procédures ne sont pas publiquement disponibles.`;
    
        case 'wave':
          return `Pour Wave, le service est généralement disponible via USSD ou application mobile. Veuillez contacter le service client Wave Burkina Faso pour le code USSD et les instructions précises.`;
    
        case 'sank':
          return `Pour Sank, service disponible par USSD. Veuillez contacter leur service client pour obtenir le code USSD et les étapes précises.`;
    
        default:
          return '';
      }
}
  

