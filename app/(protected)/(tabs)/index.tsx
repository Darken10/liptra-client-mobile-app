import { Avatar, Button, ButtonGroup, colors } from '@/src/components/natiui';
import HomePage from '@/src/components/pages/home/homePage';
import PageHeader from '@/src/components/shared/header';
import NotificationBadge from '@/src/components/shared/NotificationBadge';
import { ImagesUri } from '@/src/constants/images';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native';

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PageHeader title={'Accueil'} titleStyle={{ fontSize: 24, fontWeight: 'bold' }}
        startActions={
          <Button onPress={() => { }} variant="outlined" size="small">
            <Ionicons name="menu" size={24} color="white" />
          </Button>
        }
        endActions={
          <ButtonGroup spacing={0} >
            <Button onPress={() => {
              router.push('/(protected)/(tabs)/profile')
             }} variant="outlined" size="small" style={{paddingHorizontal:-5}}>
              <Avatar size='sm' source={ImagesUri.userDefaultAvatar} />
            </Button>
            <Button onPress={() => { }} variant="outlined" size="small" style={{paddingHorizontal:5}}>
               <NotificationBadge  color={colors.white} size={24}/>
            </Button>
          </ButtonGroup>
        }
      />
      <HomePage />
    </SafeAreaView>
  );
} 