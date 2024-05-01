import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    impressumContainer: {
      maxWidth: 800,
      marginHorizontal: 'auto',
      padding: 20,
    },
    impressumInfo: {
      marginBottom: 30,
    },
    impressumLegal: {},
    legalTitle: {
      marginBottom: 10,
    },
    impressumText: {
    },
    link: {
      color: 'blue',
      textDecorationLine: 'underline',
    },
    headline: {
      fontWeight: 'bold',
      fontSize: 16
    },
    impressumContainerDarkTheme: {
      maxWidth: 800,
      marginHorizontal: 'auto',
      padding: 20,
      backgroundColor: '#181A1B',
    },
    impressumInfoDarkTheme: {
      marginBottom: 30,
      color: 'white',
    },
    impressumLegalDarkTheme: {
      color: 'white',
    },
    legalTitleDarkTheme: {
      marginBottom: 10,
      color: 'white',
    },
    headlineDarkTheme: {
      fontWeight: 'bold',
      fontSize: 16,
      color: 'white',
    },
    impressumTextDarkTheme: {
      color: 'white',
    },
  });

export default styles;