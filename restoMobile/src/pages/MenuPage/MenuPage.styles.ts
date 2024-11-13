// MenuPage.styles.ts

import { StyleSheet, Dimensions } from "react-native";

const deviceWidth = Math.round(Dimensions.get('window').width);
const deviceHeight = Math.round(Dimensions.get('window').height);
const offset = 40;
const radius = 20;

const createStyles = (menuDesignId: number) => {
  const baseStyles = {
    container: {
      width: deviceWidth,
      height: deviceHeight,
      alignItems: 'center',
      backgroundColor: '#ffffff',
    },
    scrollView: {
      alignItems: 'center',
      paddingBottom: 150,
    },
    card: {
      marginHorizontal: 20,
      marginBottom: 25,
      borderRadius: radius,
      shadowColor: '#000',
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.75,
      shadowRadius: 4,
      elevation: 9,
      overflow: 'hidden',
    },
    cardImage: {
      height: 130,
      width: deviceWidth - offset,
      borderTopLeftRadius: radius,
      borderTopRightRadius: radius,
      alignSelf: 'center',
    },
    cardContent: {
      padding: 10,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    iconContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 10,
    },
    groupTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginVertical: 10,
      paddingTop: 10
    },
    deleteButton: {
      position: 'absolute',
      bottom: 10,
      right: 10,
      backgroundColor: 'transparent',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: '#FFFFFF',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 20,
    },
    discount: {
      textDecorationLine: 'line-through',
      textDecorationStyle: 'solid',
    },
    discountContainer: {
      marginBottom: 10,
    },
    noMenuText: {
      fontSize: 28,
      textAlign: 'center',
    },
  };

  switch (menuDesignId) {
    case 0: // Classic Style
      return StyleSheet.create({
        ...baseStyles,
        container: { ...baseStyles.container, backgroundColor: '#F9F9F9' },
        card: { ...baseStyles.card, backgroundColor: '#FFFFFF' },
        cardTitle: { ...baseStyles.cardTitle, color: '#333' },
        groupTitle: { ...baseStyles.groupTitle, color: '#555' },
        noMenuText: { ...baseStyles.noMenuText, color: '#666' },
      });

    case 1: // Modern Style
      return StyleSheet.create({
        ...baseStyles,
        container: { ...baseStyles.container, backgroundColor: '#121212' },
        card: { ...baseStyles.card, backgroundColor: '#333' },
        cardTitle: { ...baseStyles.cardTitle, color: '#1DB954' }, // Spotify green for a fresh look
        groupTitle: { ...baseStyles.groupTitle, color: '#1DB954' },
        noMenuText: { ...baseStyles.noMenuText, color: '#BBBBBB' },
      });

    case 3: // Elegant Style
      return StyleSheet.create({
        ...baseStyles,
        container: { ...baseStyles.container, backgroundColor: '#F8F4F1' },
        card: { ...baseStyles.card, backgroundColor: '#FFF' },
        cardTitle: { ...baseStyles.cardTitle, color: '#5C3C92', fontStyle: 'italic' },
        groupTitle: { ...baseStyles.groupTitle, color: '#5C3C92', fontSize: 24, fontStyle: 'italic' },
        noMenuText: { ...baseStyles.noMenuText, color: '#6E6E6E' },
      });

    case 2: // Modern Style
      return StyleSheet.create({
        ...baseStyles,
        container: { ...baseStyles.container, backgroundColor: '#121212' },
        card: { ...baseStyles.card, backgroundColor: '#333' },
        cardTitle: { ...baseStyles.cardTitle, color: '#800020' }, 
        groupTitle: { ...baseStyles.groupTitle, color: '#EE4B2B' },
        noMenuText: { ...baseStyles.noMenuText, color: '#BBBBBB' },
      });

    default: // Default Style
      return StyleSheet.create({
        ...baseStyles,
        container: { ...baseStyles.container, backgroundColor: '#F9F9F9' },
        card: { ...baseStyles.card, backgroundColor: '#FFFFFF' },
        cardTitle: { ...baseStyles.cardTitle, color: '#333' },
        groupTitle: { ...baseStyles.groupTitle, color: '#555' },
        noMenuText: { ...baseStyles.noMenuText, color: '#666' },
      });
  }
};

export default createStyles;
