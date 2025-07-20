import { VoyageDetail } from '@/src/types'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { Accordion, Rating } from '../../natiui'

type VoyageClassSectionProps = {
    voyage: VoyageDetail
}

const VoyageClassSection = ({ voyage }: VoyageClassSectionProps) => {
    return (
        <>
            <View style={styles.container}>
                <Text style={styles.title}> Véhicule {voyage.vehicle.name}</Text>

                <View style={styles.accordionContent}>
                    <View style={styles.vehicleContainer}>
                        {voyage.vehicle.image ? (
                            <Image
                                source={{ uri: voyage.vehicle.image }}
                                style={styles.vehicleImage}
                                resizeMode="cover"
                            />
                        ) : (
                            <View style={styles.vehicleImagePlaceholder}>
                                <Ionicons name="car" size={40} color="#CBD5E0" />
                            </View>
                        )}
                        <View style={styles.vehicleDetails}>
                            <Text style={styles.vehicleName}>{voyage.vehicle.name}</Text>
                            <Text style={styles.vehicleType}>{voyage.vehicle.type}</Text>
                            <View style={styles.vehicleFeature}>
                                <Ionicons name="people" size={16} color="#6B7280" />
                                <Text style={styles.vehicleFeatureText}>{voyage.vehicle.seats_number} sièges</Text>
                            </View>
                            <View style={styles.vehicleFeature}>
                                <Ionicons name="bookmark" size={16} color="#6B7280" />
                                <Text style={styles.vehicleFeatureText}>Classe {voyage.vehicle.classe}</Text>
                            </View>
                        </View>
                    </View>

                    {voyage.vehicle.features.length > 0 && (
                        <View style={styles.featuresContainer}>
                            <Text style={styles.featuresTitle}>Caractéristiques</Text>
                            {voyage.vehicle.features.map((feature) => (
                                <Accordion key={feature.id} title={feature.name}
                                    leftIcon='checkmark-circle' >
                                    <View style={styles.featureItem}>
                                        <Text style={styles.featureName}>{feature.name}</Text>
                                    </View>
                                    <Text style={styles.featureDescription}>{feature.description}</Text>
                                </Accordion>
                            ))}
                        </View>
                    )}
                </View>
            </View>

            <View style={styles.container}>
                <Text style={styles.title}> Chauffeur {voyage.chauffer.name}</Text>

                <View style={styles.accordionContent}>
                    {voyage.chauffer.id ? (
                        <View style={styles.driverContainer}>

                            <View style={styles.vehicleContainer}>
                                {voyage.vehicle.image ? (
                                    <Image
                                        source={{ uri: voyage.vehicle.image }}
                                        style={styles.vehicleImage}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <View style={styles.vehicleImagePlaceholder}>
                                        <Ionicons name="car" size={40} color="#CBD5E0" />
                                    </View>
                                )}
                                <View style={styles.vehicleDetails}>
                                    <Text style={styles.vehicleName}>{voyage.chauffer.name}</Text>
                                    <Text style={styles.vehicleType}>{voyage.chauffer.genre}</Text>
                                    <View style={styles.vehicleFeature}>
                                        <Rating value={4} size={16} />
                                    </View>
                                    <View style={styles.vehicleFeature}>
                                        <MaterialCommunityIcons name="certificate" size={16} color="#6B7280" />
                                        <Text style={styles.vehicleFeatureText}>Type Permis C</Text>
                                    </View>

                                </View>
                            </View>



                        </View>
                    ) : (
                        <Text style={styles.noDriverText}>Aucune information sur le chauffeur disponible</Text>
                    )}
                </View>
            </View>
        </>
    )
}

export default VoyageClassSection

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 16,
        elevation: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    detailContent: {
        marginLeft: 8,
    },
    detailLabel: {
        fontSize: 14,
        color: '#6B7280',
    },
    detailValue: {
        fontSize: 14,
        fontWeight: "500",
    },
    accordionContent: {
        paddingVertical: 8,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    infoContent: {
        marginLeft: 12,
    },
    infoLabel: {
        fontSize: 14,
        color: '#6B7280',
    },
    infoValue: {
        fontSize: 16,
        fontWeight: "600",
        color: '#111827',
    },
    vehicleContainer: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    vehicleImage: {
        width: 100,
        height: 80,
        borderRadius: 8,
    },
    vehicleImagePlaceholder: {
        width: 100,
        height: 80,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    vehicleDetails: {
        flex: 1,
        marginLeft: 16,
    },
    vehicleName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    vehicleType: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 8,
    },
    vehicleFeature: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    vehicleFeatureText: {
        fontSize: 14,
        marginLeft: 8,
        color: '#4B5563',
    },
    featuresContainer: {
        marginTop: 8,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    featuresTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    featureName: {
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 8,
    },
    featureDescription: {
        fontSize: 13,
        color: '#6B7280',
        marginLeft: 8,
        marginTop: 2,
    },
    driverContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    driverAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#3B82F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    driverInitial: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    driverInfo: {
        marginLeft: 16,
    },
    driverName: {
        fontSize: 16,
        fontWeight: '600',
    },
    driverGenre: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },
    noDriverText: {
        fontSize: 14,
        color: '#6B7280',
        fontStyle: 'italic',
    },
    faqText: {
        fontSize: 14,
        lineHeight: 20,
        color: '#4B5563',
        padding: 8,
    }
})