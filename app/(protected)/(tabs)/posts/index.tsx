import { Avatar, Button, ButtonGroup, colors } from '@/src/components/natiui';
import HomePage from '@/src/components/pages/home/homePage';
import PageHeader from '@/src/components/shared/header';
import MenuSettings from '@/src/components/shared/MenuSettings';
import NotificationBadge from '@/src/components/shared/NotificationBadge';
import { ImagesUri } from '@/src/constants/images';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {

  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PageHeader title={'Accueil'} titleStyle={{ fontSize: 24, fontWeight: 'bold' }}
        startActions={
          <Button onPress={() => { setShowMenu(true)}} variant="outlined" size="small">
            <Ionicons name="menu" size={24} color="white" />
          </Button>
        }
        endActions={
          <ButtonGroup spacing={0} >
            <Button onPress={() => {
              router.push('/profile')
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
      
      <MenuSettings visible={showMenu} onClose={() => setShowMenu(false)}/>
    </SafeAreaView>
  );
} 