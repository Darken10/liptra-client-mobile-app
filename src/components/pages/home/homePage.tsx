import { useAuth } from '@/src/context/AuthContext';
import { Post } from '@/src/types';
import { Voyage } from '@/src/types/voyage';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../natiui';
import ArticleCard from '../../shared/ArticleCard';
import PopularVoyageCard from '../../shared/voyages/PopularVoyageCard';


const popularVoyage:Voyage[] =  [
  {
    id: "BF101",
    departure: {
      city: "Ouagadougou",
      station: "Gare TSR Ouaga 2000",
      time: "2025-07-04T07:00:00Z"
    },
    arrival: {
      city: "Bobo-Dioulasso",
      station: "Gare Routière Bobo Accart-ville",
      time: "2025-07-04T12:30:00Z"
    },
    company: "TSR",
    price: 8000,
    duration: "5h30",
    availableSeats: 6,
    vehicleType: "bus",
    popularity: 88
  },
  {
    id: "BF102",
    departure: {
      city: "Ouagadougou",
      station: "Gare STAF Zone 1",
      time: "2025-07-05T08:30:00Z"
    },
    arrival: {
      city: "Koudougou",
      station: "Gare Koudougou Centre",
      time: "2025-07-05T11:00:00Z"
    },
    company: "STAF",
    price: 3500,
    duration: "2h30",
    availableSeats: 14,
    vehicleType: "bus"
  },
  {
    id: "BF103",
    departure: {
      city: "Ouagadougou",
      station: "Rahimo Transport, Patte d'oie",
      time: "2025-07-06T14:00:00Z"
    },
    arrival: {
      city: "Fada N'Gourma",
      station: "Station routière Fada",
      time: "2025-07-06T18:00:00Z"
    },
    company: "Rahimo Transport",
    price: 6000,
    duration: "4h00",
    availableSeats: 10,
    vehicleType: "bus",
    popularity: 60
  },
  {
    id: "BF104",
    departure: {
      city: "Bobo-Dioulasso",
      station: "STAF Bobo, secteur 21",
      time: "2025-07-07T09:30:00Z"
    },
    arrival: {
      city: "Banfora",
      station: "Station Banfora Centre",
      time: "2025-07-07T11:45:00Z"
    },
    company: "STAF",
    price: 2500,
    duration: "2h15",
    availableSeats: 0,
    vehicleType: "bus",
    popularity: 72
  }
];


const posts : Post[] =  [
  {
    id: "A001",
    title: "L'impact du numérique sur l'éducation au Burkina Faso",
    summary: "Le numérique transforme progressivement le système éducatif burkinabè.",
    content: "Avec l’essor des technologies, de nombreuses écoles adoptent des outils numériques...",
    image: "https://picsum.photos/200/300",
    category: "Éducation",
    tags: ["éducation", "numérique", "Burkina Faso"],
    publishedAt: "2025-07-01T08:00:00Z",
    likes: 124,
    comments: 8,
    author: {
      id: "U001",
      name: "Aïcha Ouédraogo",
      avatar: "https://example.com/avatars/aicha.jpg"
    }
  },
  {
    id: "A002",
    title: "5 plats traditionnels incontournables du Burkina Faso",
    summary: "Zoom sur les mets les plus appréciés du pays des Hommes intègres.",
    content: "Du tô au riz gras en passant par le babenda, voici un tour culinaire...",
    image: "https://picsum.photos/200/300",
    category: "Culture",
    tags: ["gastronomie", "culture", "Burkina Faso"],
    publishedAt: "2025-06-28T10:30:00Z",
    likes: 230,
    comments: 15,
    author: {
      id: "U002",
      name: "Moussa Kaboré"
    }
  },
  {
    id: "A003",
    title: "L’agriculture face au changement climatique",
    summary: "Les agriculteurs s’adaptent face aux défis environnementaux.",
    content: "Le changement climatique affecte les cycles agricoles...",
    image: "https://example.com/images/agriculture.jpg",
    category: "Environnement",
    tags: ["agriculture", "climat", "développement durable"],
    publishedAt: "2025-06-25T14:45:00Z",
    likes: 89,
    comments: 5,
    author: {
      id: "U003",
      name: "Issouf Traoré",
      avatar: "https://example.com/avatars/issouf.jpg"
    }
  },
  {
    id: "A004",
    title: "Startup burkinabè : un nouvel écosystème en pleine croissance",
    summary: "Les jeunes innovent et créent des entreprises dans la tech.",
    content: "L'entrepreneuriat numérique séduit de plus en plus de jeunes diplômés...",
    image: "https://example.com/images/startup.jpg",
    category: "Économie",
    tags: ["entrepreneuriat", "innovation", "startups"],
    publishedAt: "2025-07-02T09:00:00Z",
    likes: 164,
    comments: 12,
    author: {
      id: "U004",
      name: "Fatoumata Zongo"
    }
  },
  {
    id: "A005",
    title: "Tourisme local : 7 destinations à découvrir au Burkina",
    summary: "Le Burkina regorge de sites naturels et historiques à visiter.",
    content: "Des pics de Sindou aux ruines de Loropéni, partez à l’aventure...",
    image: "https://images.pexels.com/lib/api/pexels-white.png",
    category: "Tourisme",
    tags: ["voyage", "tourisme", "Burkina Faso"],
    publishedAt: "2025-06-20T16:00:00Z",
    likes: 200,
    comments: 20,
    author: {
      id: "U005",
      name: "Salif Ouattara",
      avatar: "https://example.com/avatars/salif.jpg"
    }
  },
  {
    id: "A006",
    title: "L’évolution du cinéma africain : focus sur le FESPACO",
    summary: "Le FESPACO met en lumière le talent des cinéastes africains.",
    content: "Créé en 1969, ce festival est devenu un rendez-vous incontournable...",
    image: "https://images.pexels.com/lib/api/pexels-white.png",
    category: "Culture",
    tags: ["cinéma", "FESPACO", "Afrique"],
    publishedAt: "2025-07-01T11:15:00Z",
    likes: 310,
    comments: 25,
    author: {
      id: "U006",
      name: "Nadine Kiemtoré"
    }
  },
  {
    id: "A007",
    title: "Comment protéger sa vie privée en ligne ?",
    summary: "Quelques bonnes pratiques pour sécuriser vos données personnelles.",
    content: "Avec la montée des cyberattaques, il est crucial de protéger ses données...",
    image: "https://images.pexels.com/lib/api/pexels-white.png",
    category: "Technologie",
    tags: ["sécurité", "vie privée", "numérique"],
    publishedAt: "2025-07-03T13:30:00Z",
    likes: 140,
    comments: 7,
    author: {
      id: "U007",
      name: "Brice Sanou",
      avatar: "https://example.com/avatars/brice.jpg"
    }
  },
  {
    id: "A008",
    title: "Les femmes dans la science au Burkina Faso",
    summary: "Un regard sur celles qui font avancer la recherche scientifique.",
    content: "De plus en plus de femmes burkinabè s’imposent dans les laboratoires...",
    image: "https://images.pexels.com/lib/api/pexels-white.png",
    category: "Société",
    tags: ["science", "femmes", "Burkina Faso"],
    publishedAt: "2025-06-27T07:45:00Z",
    likes: 176,
    comments: 18,
    author: {
      id: "U008",
      name: "Clarisse Sawadogo"
    }
  },
  {
    id: "A009",
    title: "La musique traditionnelle à l’ère du numérique",
    summary: "Les artistes traditionnels adoptent les plateformes digitales.",
    content: "De nombreux musiciens intègrent le digital pour mieux diffuser leur art...",
    image: "https://images.pexels.com/lib/api/pexels-white.png",
    category: "Culture",
    tags: ["musique", "tradition", "numérique"],
    publishedAt: "2025-06-26T17:00:00Z",
    likes: 98,
    comments: 6,
    author: {
      id: "U009",
      name: "Abdoulaye Nana"
    }
  },
  {
    id: "A010",
    title: "L’accès à l’eau potable en milieu rural",
    summary: "Des projets communautaires pour améliorer la situation.",
    content: "Grâce aux forages et aux mini-adductions d’eau potable, des progrès notables sont visibles...",
    image: "https://images.pexels.com/lib/api/pexels-white.png",
    category: "Santé",
    tags: ["eau", "rural", "santé publique"],
    publishedAt: "2025-07-02T06:30:00Z",
    likes: 110,
    comments: 4,
    author: {
      id: "U010",
      name: "Zakaria Yaméogo",
      avatar: "https://example.com/avatars/zakaria.jpg"
    }
  }
];


const HomePage = () => {

    const [refreshing, setRefreshing] = useState(false);
    const { user } = useAuth()
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        // In a real app, we would fetch fresh data here
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, []);


    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
            }>
            {/* Header with greeting and profile */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Bonjour,</Text>
                    <Text style={styles.username}>{user?.name ?? 'Utilisateur'}</Text>
                </View>
                <TouchableOpacity
                    style={styles.profileButton}
                    onPress={() => router.push('/profile')}
                >
                   {/*  <View style={[styles.profileImage, styles.profilePlaceholder]}>
                        <Ionicons name="person" size={24} color="#6B7280" />
                    </View> */}

                </TouchableOpacity>
            </View>

            {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/voyage')}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="search" size={24} color="#3B82F6" />
            </View>
            <Text style={styles.actionText}>Rechercher</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/tickets')}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="ticket" size={24} color="#3B82F6" />
            </View>
            <Text style={styles.actionText}>Mes tickets</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/tickets/transfert')}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="swap-horizontal" size={24} color="#3B82F6" />
            </View>
            <Text style={styles.actionText}>Transfert</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/help' as any)}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="help-circle" size={24} color="#3B82F6" />
            </View>
            <Text style={styles.actionText}>Aide</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Voyages populaires</Text>
            <TouchableOpacity onPress={() => router.push('/voyage')}>
              <Text style={styles.seeAllText}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          
          {popularVoyage.map(voyage => (
            <PopularVoyageCard 
              key={voyage.id} 
              voyage={voyage} 
              onPress={() => {}}
            />
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Articles à la une</Text>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.seeAllText}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          
          {posts.map(post => (
            <ArticleCard 
              key={post.id} 
              article={post} 
              onPress={() => {}}
            />
          ))}
        </View>
        
        </ScrollView>




    )
}

export default HomePage

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 16,
        backgroundColor: '#FFFFFF',
    },
    greeting: {
        fontSize: 14,
        color: '#6B7280',
    },
    username: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    profileButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        overflow: 'hidden',
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    profilePlaceholder: {
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    quickActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        marginBottom: 8,
    },
    actionButton: {
        alignItems: 'center',
    },
    actionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#EBF5FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    actionText: {
        fontSize: 12,
        color: '#4B5563',
    },
    section: {
        backgroundColor: '#FFFFFF',
        marginBottom: 8,
        paddingVertical: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    seeAllText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#3B82F6',
    },
})