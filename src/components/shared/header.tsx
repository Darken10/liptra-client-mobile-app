
import React from "react";
import { StatusBar, StyleProp, StyleSheet, TextStyle, View } from "react-native";
import { colors, Text } from "../natiui";


type PageHeaderProps = {
    title: string;
    onBack?: () => void;
    titleStyle?: StyleProp<TextStyle>;
    startActions?: React.ReactNode;
    endActions?: React.ReactNode;
}

export default function PageHeader({ title, onBack, startActions, endActions, titleStyle }: PageHeaderProps) {
    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
            <View style={styles.header}>
                <View style={styles.startActionView}>
                    {startActions}
                </View>
                <Text variant="h4" style={[styles.title, titleStyle]}>{title}</Text>
                <View style={styles.endActionView}>
                    {endActions}
                </View>
            </View>
        </>
    );
}


const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        backgroundColor: colors.primary,
        paddingVertical: 16,
    },
    title: {
        flex: 1, // Le titre prend l'espace entre start et end
        color: colors.white,
        fontWeight: 'bold',
        textAlign: 'center', // Facultatif si tu veux centrer le texte
    },
    startActionView: {
        // Start aligned by default
    },
    endActionView: {
        marginLeft: 'auto', // Ce qui pousse ce bloc à droite
        flexDirection: 'row',
        alignItems: 'center',
    }
});
