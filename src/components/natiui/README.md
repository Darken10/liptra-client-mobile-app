# NatiUI

Une bibliothèque moderne de composants UI pour React Native Expo SDK 53, conçue pour être :
- Accessible et conforme aux normes d'accessibilité
- Moderne et stylée avec des animations fluides
- Strictement typée (TypeScript)
- 100% compatible offline
- Facilement personnalisable via un système de thème centralisé
- Performante avec des animations natives

## Installation

```bash
npm install natiui
# ou
yarn add natiui
```

## Configuration

Enveloppez votre application avec le `ThemeProvider` pour accéder au système de thème :

```jsx
import { ThemeProvider } from 'natiui';

export default function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}
```

## Exemple d'utilisation

```jsx
import { Button, Card, Input, FormField } from 'natiui';

export default function LoginScreen() {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Card title="Connexion">
        <FormField 
          label="Email" 
          helperText="Nous ne partagerons jamais votre email"
          required
        >
          <Input 
            placeholder="email@exemple.com"
            keyboardType="email-address"
          />
        </FormField>
        
        <FormField 
          label="Mot de passe"
          required
        >
          <Input 
            placeholder="Votre mot de passe" 
            secureTextEntry 
          />
        </FormField>
        
        <ButtonGroup>
          <Button variant="ghost">Annuler</Button>
          <Button onPress={() => console.log('Connexion')}>
            Se connecter
          </Button>
        </ButtonGroup>
      </Card>
    </View>
  );
}
```

## Architecture

### Système de thème

NatiUI utilise un système de thème centralisé accessible via `ThemeProvider` et le hook `useTheme`. Ce système permet de maintenir une cohérence visuelle à travers toute l'application et facilite la personnalisation.

```tsx
import { useTheme } from 'natiui';

const MyComponent = () => {
  const theme = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.primary }}>
        Texte avec couleur du thème
      </Text>
    </View>
  );
};
```

Le thème comprend :
- **Colors** : Palette de couleurs pour l'application
- **Typography** : Styles de texte (tailles, poids, familles de polices)
- **Spacing** : Système d'espacement cohérent
- **Breakpoints** : Points de rupture pour le design responsive
- Badge
- Modal
- (plus à venir...)

## Composants disponibles

NatiUI propose une large gamme de composants pour construire des interfaces utilisateur modernes et accessibles :

### Composants de base
- **Text** : Texte stylisé avec support des variantes et tailles
- **Button** : Bouton avec différentes variantes (filled, outlined, ghost)
- **Icon** : Intégration avec @expo/vector-icons
- **Spacer** : Composant pour gérer l'espacement
- **Divider** : Ligne de séparation horizontale ou verticale

### Formulaires
- **Input** : Champ de saisie avec support des états (focus, error, disabled)
- **FormField** : Conteneur pour champs avec label, message d'aide et erreur
- **Checkbox** : Case à cocher avec support des états
- **Radio** : Bouton radio pour sélection unique
- **Switch** : Interrupteur à bascule
- **Select** : Menu déroulant avec modal et recherche
- **DatePicker** : Sélecteur de date/heure avec modal natif
- **Slider** : Curseur pour sélectionner une valeur dans une plage

### Navigation
- **Tabs** : Système d'onglets avec animation
- **SegmentedControl** : Contrôle segmenté avec animation du sélecteur

### Feedback
- **Toast** : Notification temporaire
- **ProgressBar** : Barre de progression
- **ActivityIndicator** : Indicateur de chargement circulaire
- **Skeleton** : Placeholder animé pour le chargement de contenu

### Conteneurs
- **Card** : Carte avec ombre et contenu flexible
- **Modal** : Fenêtre modale
- **BottomSheet** : Panneau coulissant depuis le bas
- **Accordion** : Panneau déroulant avec animation
- **Box** : Conteneur flexible avec styles simplifiés

### Mise en page
- **Grid** : Système de grille responsive
- **Row** : Ligne horizontale avec espacement
- **Col** : Colonne verticale avec espacement
- **Container** : Conteneur avec largeur maximale

### Affichage de données
- **List** : Liste d'éléments avec support des séparateurs
- **Avatar** : Image de profil circulaire
- **Badge** : Badge pour notifications ou statuts
- **Chip** : Étiquette interactive
- **ButtonGroup** : Groupe de boutons
- **Rating** : Système d'évaluation par étoiles

## Documentation détaillée des composants

### ButtonGroup

Le composant `ButtonGroup` permet de regrouper plusieurs boutons dans un ensemble cohérent, avec un contrôle sur leur disposition et leur apparence.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | Les boutons à afficher dans le groupe |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | Direction d'affichage des boutons |
| `spacing` | `number` | `8` | Espacement entre les boutons |
| `size` | `'sm' \| 'md' \| 'lg'` | - | Taille des boutons (appliquée à tous) |
| `variant` | `'filled' \| 'outlined' \| 'ghost'` | - | Variante des boutons (appliquée à tous) |
| `disabled` | `boolean` | `false` | Désactive tous les boutons |
| `style` | `StyleProp<ViewStyle>` | - | Style personnalisé pour le conteneur |

#### Exemple d'utilisation

```tsx
import { ButtonGroup, Button } from 'natiui';

const ActionButtons = () => (
  <ButtonGroup direction="horizontal" spacing={12} size="md" variant="outlined">
    <Button onPress={() => console.log('Annuler')} variant="ghost">Annuler</Button>
    <Button onPress={() => console.log('Valider')}>Valider</Button>
  </ButtonGroup>
);
```

#### Fonctionnement interne

Le composant `ButtonGroup` utilise `React.Children.map` pour parcourir les enfants et leur appliquer des props communes comme la taille, la variante et le style. Il gère intelligemment l'espacement entre les boutons et supprime la marge du dernier élément pour un rendu visuel optimal.

### ActivityIndicator

Un indicateur de chargement circulaire avec un label optionnel, parfait pour indiquer qu'une opération est en cours.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Taille de l'indicateur |
| `color` | `string` | `theme.colors.primary` | Couleur de l'indicateur |
| `label` | `string` | - | Texte à afficher sous l'indicateur |
| `labelStyle` | `StyleProp<TextStyle>` | - | Style personnalisé pour le label |
| `style` | `StyleProp<ViewStyle>` | - | Style personnalisé pour le conteneur |

#### Exemple d'utilisation

```tsx
import { ActivityIndicator } from 'natiui';

const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="lg" label="Chargement en cours..." />
  </View>
);
```

### Skeleton

Un placeholder animé pour indiquer le chargement de contenu, avec différentes formes et une animation pulse.

#### Props Skeleton

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'rectangle' \| 'circle' \| 'text'` | `'rectangle'` | Type de squelette |
| `width` | `number \| string` | `'100%'` | Largeur du squelette |
| `height` | `number \| string` | `16` | Hauteur du squelette |
| `borderRadius` | `number` | - | Rayon de bordure |
| `animation` | `boolean` | `true` | Active/désactive l'animation |
| `style` | `StyleProp<ViewStyle>` | - | Style personnalisé |

#### Props SkeletonGroup

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | Les éléments Skeleton à grouper |
| `spacing` | `number` | `8` | Espacement entre les éléments |
| `style` | `StyleProp<ViewStyle>` | - | Style personnalisé pour le conteneur |

#### Exemple d'utilisation

```tsx
import { Skeleton, SkeletonGroup } from 'natiui';

const LoadingCard = () => (
  <Card style={{ padding: 16 }}>
    <SkeletonGroup spacing={12}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Skeleton type="circle" width={48} height={48} />
        <View style={{ marginLeft: 12 }}>
          <Skeleton type="text" width={120} height={18} />
          <Skeleton type="text" width={80} height={14} style={{ marginTop: 4 }} />
        </View>
      </View>
      <Skeleton type="rectangle" height={120} />
      <Skeleton type="text" width="90%" height={16} />
      <Skeleton type="text" width="80%" height={16} />
    </SkeletonGroup>
  </Card>
);
```

### Accordion

Un panneau déroulant avec animation d'expansion/réduction, parfait pour organiser du contenu dans un espace limité.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Titre de l'accordéon |
| `children` | `React.ReactNode` | - | Contenu à afficher lorsque l'accordéon est ouvert |
| `expanded` | `boolean` | `false` | État d'expansion initial |
| `onToggle` | `(expanded: boolean) => void` | - | Callback appelé lors du changement d'état |
| `variant` | `'default' \| 'outlined' \| 'filled'` | `'default'` | Style visuel de l'accordéon |
| `disabled` | `boolean` | `false` | Désactive l'accordéon |
| `icon` | `React.ReactNode` | - | Icône personnalisée pour remplacer la flèche |
| `style` | `StyleProp<ViewStyle>` | - | Style personnalisé pour le conteneur |

#### Exemple d'utilisation

```tsx
import { Accordion, Text } from 'natiui';

const FAQSection = () => (
  <>
    <Accordion 
      title="Comment créer un compte ?" 
      variant="outlined"
    >
      <Text style={{ padding: 16 }}>
        Pour créer un compte, suivez ces étapes...
      </Text>
    </Accordion>
    
    <Accordion 
      title="Comment réinitialiser mon mot de passe ?" 
      variant="outlined"
    >
      <Text style={{ padding: 16 }}>
        Pour réinitialiser votre mot de passe...
      </Text>
    </Accordion>
  </>
);
```

### SegmentedControl

Un contrôle segmenté avec animation du sélecteur, idéal pour basculer entre différentes vues ou options.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `Array<{label: string, value: string, disabled?: boolean}>` | - | Options du contrôle |
| `value` | `string` | - | Valeur sélectionnée |
| `onChange` | `(value: string) => void` | - | Callback appelé lors du changement de sélection |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Taille du contrôle |
| `disabled` | `boolean` | `false` | Désactive tout le contrôle |
| `style` | `StyleProp<ViewStyle>` | - | Style personnalisé |

#### Exemple d'utilisation

```tsx
import { SegmentedControl } from 'natiui';
import { useState } from 'react';

const FilterControl = () => {
  const [filter, setFilter] = useState('all');
  
  return (
    <SegmentedControl
      options={[
        { label: 'Tous', value: 'all' },
        { label: 'En cours', value: 'active' },
        { label: 'Terminés', value: 'completed' },
      ]}
      value={filter}
      onChange={setFilter}
      size="md"
    />
  );
};
```

### BottomSheet

Un panneau coulissant depuis le bas de l'écran, idéal pour afficher des options supplémentaires ou des informations contextuelles.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `visible` | `boolean` | `false` | Contrôle la visibilité du panneau |
| `onClose` | `() => void` | - | Callback appelé lors de la fermeture |
| `height` | `number \| string` | `'50%'` | Hauteur du panneau |
| `draggable` | `boolean` | `true` | Permet de faire glisser le panneau |
| `closeOnBackdropPress` | `boolean` | `true` | Ferme le panneau en appuyant sur l'arrière-plan |
| `children` | `React.ReactNode` | - | Contenu du panneau |
| `style` | `StyleProp<ViewStyle>` | - | Style personnalisé |

#### Exemple d'utilisation

```tsx
import { BottomSheet, Button, Text } from 'natiui';
import { useState } from 'react';

const ShareOptions = () => {
  const [visible, setVisible] = useState(false);
  
  return (
    <>
      <Button onPress={() => setVisible(true)}>Partager</Button>
      
      <BottomSheet 
        visible={visible} 
        onClose={() => setVisible(false)}
        height="40%"
      >
        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
            Options de partage
          </Text>
          <Button onPress={() => {}} style={{ marginBottom: 8 }}>
            Partager via WhatsApp
          </Button>
          <Button onPress={() => {}} style={{ marginBottom: 8 }}>
            Partager via Email
          </Button>
          <Button 
            onPress={() => setVisible(false)} 
            variant="ghost"
          >
            Annuler
          </Button>
        </View>
      </BottomSheet>
    </>
  );
};
```

### Rating

Un système d'évaluation par étoiles avec support des demi-étoiles, parfait pour recueillir les avis des utilisateurs.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | `0` | Valeur de l'évaluation (0-5) |
| `onChange` | `(value: number) => void` | - | Callback appelé lors du changement de valeur |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Taille des étoiles |
| `count` | `number` | `5` | Nombre d'étoiles |
| `readonly` | `boolean` | `false` | Mode lecture seule |
| `allowHalf` | `boolean` | `false` | Permet les demi-étoiles |
| `activeColor` | `string` | `theme.colors.warning` | Couleur des étoiles actives |
| `inactiveColor` | `string` | `theme.colors.gray[300]` | Couleur des étoiles inactives |
| `style` | `StyleProp<ViewStyle>` | - | Style personnalisé |

#### Exemple d'utilisation

```tsx
import { Rating, Text } from 'natiui';
import { useState } from 'react';

const ProductRating = () => {
  const [rating, setRating] = useState(0);
  
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ marginBottom: 8 }}>Notez ce produit :</Text>
      <Rating
        value={rating}
        onChange={setRating}
        size="lg"
        allowHalf
      />
      <Text style={{ marginTop: 8 }}>
        {rating > 0 ? `Votre note : ${rating}/5` : 'Pas encore noté'}
      </Text>
    </View>
  );
};
```

### FormField

Un conteneur pour les champs de formulaire avec label, message d'aide, message d'erreur et autres fonctionnalités.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Label du champ |
| `helperText` | `string` | - | Texte d'aide sous le champ |
| `errorText` | `string` | - | Message d'erreur |
| `required` | `boolean` | `false` | Indique si le champ est obligatoire |
| `disabled` | `boolean` | `false` | Désactive le champ |
| `readonly` | `boolean` | `false` | Mode lecture seule |
| `infoText` | `string` | - | Texte d'information supplémentaire |
| `children` | `React.ReactNode` | - | Composant de champ (Input, Select, etc.) |
| `style` | `StyleProp<ViewStyle>` | - | Style personnalisé |

#### Exemple d'utilisation

```tsx
import { FormField, Input, Select } from 'natiui';

const ProfileForm = () => (
  <>
    <FormField 
      label="Nom complet" 
      required 
      helperText="Tel qu'il apparaîtra sur votre profil"
    >
      <Input placeholder="Entrez votre nom" />
    </FormField>
    
    <FormField 
      label="Email" 
      required 
      errorText="Email invalide"
    >
      <Input 
        placeholder="email@exemple.com" 
        keyboardType="email-address" 
      />
    </FormField>
    
    <FormField 
      label="Pays" 
      infoText="Nous utilisons cette information pour personnaliser votre expérience"
    >
      <Select 
        options={[
          { label: 'France', value: 'fr' },
          { label: 'Canada', value: 'ca' },
          { label: 'Belgique', value: 'be' },
        ]} 
      />
    </FormField>
  </>
);
```

### DatePicker

Un sélecteur de date/heure qui utilise les composants natifs d'iOS et Android pour une expérience utilisateur optimale.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `Date` | - | Date sélectionnée |
| `onChange` | `(date: Date) => void` | - | Callback appelé lors du changement de date |
| `mode` | `'date' \| 'time' \| 'datetime'` | `'date'` | Mode du sélecteur |
| `format` | `string` | - | Format d'affichage de la date (ex: 'DD/MM/YYYY') |
| `placeholder` | `string` | `'Sélectionner'` | Texte affiché quand aucune date n'est sélectionnée |
| `minDate` | `Date` | - | Date minimale sélectionnable |
| `maxDate` | `Date` | - | Date maximale sélectionnable |
| `disabled` | `boolean` | `false` | Désactive le sélecteur |
| `variant` | `'default' \| 'outlined' \| 'filled'` | `'default'` | Style visuel du sélecteur |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Taille du sélecteur |
| `style` | `StyleProp<ViewStyle>` | - | Style personnalisé |

#### Exemple d'utilisation

```tsx
import { DatePicker, FormField } from 'natiui';
import { useState } from 'react';

const EventForm = () => {
  const [eventDate, setEventDate] = useState(new Date());
  const [eventTime, setEventTime] = useState(new Date());
  
  // Date minimale = aujourd'hui
  const today = new Date();
  
  return (
    <>
      <FormField label="Date de l'événement" required>
        <DatePicker
          value={eventDate}
          onChange={setEventDate}
          mode="date"
          format="DD/MM/YYYY"
          minDate={today}
          variant="outlined"
        />
      </FormField>
      
      <FormField label="Heure de début">
        <DatePicker
          value={eventTime}
          onChange={setEventTime}
          mode="time"
          format="HH:mm"
          variant="outlined"
        />
      </FormField>
    </>
  );
};
```

### Select

Un menu déroulant avec modal, recherche et options personnalisables, parfait pour les sélections dans une liste d'options.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `Array<{label: string, value: string, icon?: React.ReactNode, disabled?: boolean}>` | `[]` | Options disponibles |
| `value` | `string` | - | Valeur sélectionnée |
| `onChange` | `(value: string) => void` | - | Callback appelé lors du changement de sélection |
| `placeholder` | `string` | `'Sélectionner'` | Texte affiché quand aucune option n'est sélectionnée |
| `searchable` | `boolean` | `false` | Active la recherche dans les options |
| `disabled` | `boolean` | `false` | Désactive le sélecteur |
| `variant` | `'default' \| 'outlined' \| 'filled'` | `'default'` | Style visuel du sélecteur |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Taille du sélecteur |
| `error` | `boolean` | `false` | Indique une erreur |
| `style` | `StyleProp<ViewStyle>` | - | Style personnalisé |

#### Exemple d'utilisation

```tsx
import { Select, FormField } from 'natiui';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

const CountrySelector = () => {
  const [country, setCountry] = useState('');
  
  const countryOptions = [
    { 
      label: 'France', 
      value: 'fr',
      icon: <Ionicons name="flag" size={16} color="#001489" />
    },
    { 
      label: 'Canada', 
      value: 'ca',
      icon: <Ionicons name="flag" size={16} color="#FF0000" />
    },
    { 
      label: 'Belgique', 
      value: 'be',
      icon: <Ionicons name="flag" size={16} color="#FDDA25" />
    },
    // Plus d'options...
  ];
  
  return (
    <FormField label="Pays">
      <Select
        options={countryOptions}
        value={country}
        onChange={setCountry}
        searchable
        placeholder="Sélectionnez un pays"
        variant="outlined"
      />
    </FormField>
  );
};
```

### Box

Un conteneur flexible avec des props simplifiées pour les styles courants comme padding, margin, dimensions, bordures et ombres.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | Contenu du Box |
| `p` | `number` | - | Padding sur tous les côtés |
| `px` | `number` | - | Padding horizontal (gauche et droite) |
| `py` | `number` | - | Padding vertical (haut et bas) |
| `pt`, `pr`, `pb`, `pl` | `number` | - | Padding spécifique (top, right, bottom, left) |
| `m` | `number` | - | Margin sur tous les côtés |
| `mx` | `number` | - | Margin horizontal (gauche et droite) |
| `my` | `number` | - | Margin vertical (haut et bas) |
| `mt`, `mr`, `mb`, `ml` | `number` | - | Margin spécifique (top, right, bottom, left) |
| `width`, `height` | `number \| string` | - | Dimensions |
| `minWidth`, `maxWidth` | `number \| string` | - | Largeur minimale/maximale |
| `minHeight`, `maxHeight` | `number \| string` | - | Hauteur minimale/maximale |
| `bg` | `string` | - | Couleur d'arrière-plan |
| `borderRadius` | `number` | - | Rayon de bordure |
| `borderWidth` | `number` | - | Épaisseur de bordure |
| `borderColor` | `string` | - | Couleur de bordure |
| `shadow` | `boolean \| number` | `false` | Ombre (true = ombre par défaut, nombre = intensité) |
| `flex` | `number` | - | Valeur flex |
| `flexDirection` | `'row' \| 'column' \| 'row-reverse' \| 'column-reverse'` | - | Direction flex |
| `justifyContent`, `alignItems` | `FlexStyle['justifyContent' \| 'alignItems']` | - | Propriétés d'alignement flex |
| `style` | `StyleProp<ViewStyle>` | - | Style personnalisé |

#### Exemple d'utilisation

```tsx
import { Box, Text } from 'natiui';

const CardExample = () => (
  <Box 
    p={16} 
    bg="white" 
    borderRadius={8} 
    shadow={1} 
    my={8}
  >
    <Box flexDirection="row" alignItems="center" mb={12}>
      <Box 
        width={40} 
        height={40} 
        borderRadius={20} 
        bg="primary" 
        justifyContent="center" 
        alignItems="center"
      >
        <Text color="white">AB</Text>
      </Box>
      <Box ml={12}>
        <Text fontWeight="bold">Alice Bertrand</Text>
        <Text fontSize={12} color="gray.600">Il y a 2 heures</Text>
      </Box>
    </Box>
    
    <Text>Voici un exemple de carte utilisant le composant Box pour la mise en page.</Text>
    
    <Box 
      mt={16} 
      pt={16} 
      borderTopWidth={1} 
      borderColor="gray.200" 
      flexDirection="row" 
      justifyContent="space-between"
    >
      <Text color="primary">J'aime</Text>
      <Text color="primary">Commenter</Text>
      <Text color="primary">Partager</Text>
    </Box>
  </Box>
);
```

### Grid

Un système de grille responsive avec des composants Grid, GridItem, Row, Col et Container pour créer des mises en page complexes et responsives.

#### Props Grid

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | Éléments GridItem à afficher |
| `spacing` | `number` | `8` | Espacement entre les éléments |
| `columns` | `number` | `12` | Nombre de colonnes dans la grille |
| `style` | `StyleProp<ViewStyle>` | - | Style personnalisé |

#### Props GridItem

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | Contenu de l'élément |
| `span` | `number` | `12` | Nombre de colonnes occupées |
| `xs`, `sm`, `md`, `lg`, `xl` | `number` | - | Nombre de colonnes occupées selon la taille d'écran |
| `style` | `StyleProp<ViewStyle>` | - | Style personnalisé |

#### Props Row

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | Éléments Col à afficher |
| `spacing` | `number` | `8` | Espacement entre les colonnes |
| `style` | `StyleProp<ViewStyle>` | - | Style personnalisé |

#### Props Col

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | Contenu de la colonne |
| `span` | `number` | `12` | Nombre de colonnes occupées |
| `xs`, `sm`, `md`, `lg`, `xl` | `number` | - | Nombre de colonnes occupées selon la taille d'écran |
| `style` | `StyleProp<ViewStyle>` | - | Style personnalisé |

#### Props Container

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | Contenu du conteneur |
| `maxWidth` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| number` | `'lg'` | Largeur maximale du conteneur |
| `px` | `number` | `16` | Padding horizontal |
| `style` | `StyleProp<ViewStyle>` | - | Style personnalisé |

#### Exemple d'utilisation

```tsx
import { Grid, GridItem, Row, Col, Container, Box, Text } from 'natiui';

const ResponsiveLayout = () => (
  <Container maxWidth="lg">
    {/* Utilisation de Grid et GridItem */}
    <Text style={{ marginBottom: 16, fontWeight: 'bold' }}>Système Grid</Text>
    <Grid spacing={16}>
      <GridItem xs={12} sm={6} md={4} lg={3}>
        <Box bg="primary" p={16} borderRadius={8}>
          <Text color="white">Item 1</Text>
        </Box>
      </GridItem>
      <GridItem xs={12} sm={6} md={4} lg={3}>
        <Box bg="secondary" p={16} borderRadius={8}>
          <Text color="white">Item 2</Text>
        </Box>
      </GridItem>
      <GridItem xs={12} sm={6} md={4} lg={3}>
        <Box bg="success" p={16} borderRadius={8}>
          <Text color="white">Item 3</Text>
        </Box>
      </GridItem>
      <GridItem xs={12} sm={6} md={4} lg={3}>
        <Box bg="warning" p={16} borderRadius={8}>
          <Text color="white">Item 4</Text>
        </Box>
      </GridItem>
    </Grid>
    
    {/* Utilisation de Row et Col */}
    <Text style={{ marginTop: 32, marginBottom: 16, fontWeight: 'bold' }}>Système Row/Col</Text>
    <Row spacing={16}>
      <Col xs={12} md={6}>
        <Box bg="info" p={16} borderRadius={8}>
          <Text color="white">Colonne 1</Text>
        </Box>
      </Col>
      <Col xs={12} md={6}>
        <Box bg="error" p={16} borderRadius={8}>
          <Text color="white">Colonne 2</Text>
        </Box>
      </Col>
    </Row>
  </Container>
);
```

## Personnalisation

NatiUI est construit avec un système de thème centralisé. Vous pouvez facilement personnaliser les couleurs, espacements et typographies en étendant le thème par défaut.

### Personnalisation du thème

```tsx
import { ThemeProvider, createTheme } from 'natiui';

// Créer un thème personnalisé
const customTheme = createTheme({
  colors: {
    primary: '#3498db',
    secondary: '#2ecc71',
    // Autres couleurs personnalisées
  },
  typography: {
    fontFamily: {
      regular: 'Roboto-Regular',
      medium: 'Roboto-Medium',
      bold: 'Roboto-Bold',
    },
    // Autres personnalisations de typographie
  },
  spacing: {
    base: 8, // Unité de base pour l'espacement
    // Autres personnalisations d'espacement
  },
  breakpoints: {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
  },
});

// Utiliser le thème personnalisé
export default function App() {
  return (
    <ThemeProvider theme={customTheme}>
      <YourApp />
    </ThemeProvider>
  );
}
```

### Utilisation des tokens du thème

Vous pouvez accéder aux tokens du thème dans vos composants personnalisés :

```tsx
import { useTheme } from 'natiui';
import { StyleSheet, View, Text } from 'react-native';

const CustomComponent = () => {
  const theme = useTheme();
  
  return (
    <View style={styles.container(theme)}>
      <Text style={styles.title(theme)}>Titre personnalisé</Text>
      <Text style={styles.subtitle(theme)}>Sous-titre avec couleur du thème</Text>
    </View>
  );
};

const styles = {
  container: (theme) => ({
    padding: theme.spacing.base * 2,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
  }),
  title: (theme) => ({
    fontSize: theme.typography.fontSize.xl,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.base,
  }),
  subtitle: (theme) => ({
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.primary,
  }),
};
```

## Contribution

Nous accueillons les contributions à NatiUI ! Voici comment vous pouvez aider :

1. **Signaler des bugs** : Ouvrez une issue pour signaler un bug ou un problème.
2. **Proposer des améliorations** : Partagez vos idées pour améliorer la bibliothèque.
3. **Soumettre des pull requests** : Contribuez directement au code en soumettant des PR.

## Licence

NatiUI est disponible sous licence MIT. Voir le fichier LICENSE pour plus d'informations.
