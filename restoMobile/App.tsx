import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import MyTabs from './Router';
import ErrorBoundary from './src/components/ErrorBoundary/ErrorBoundary';
import 'react-native-reanimated'
import 'react-native-gesture-handler'

interface ErrorScreenProps {
  errorMessage: string;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ errorMessage }) => (
  <View style={styles.container}>
    <Text style={styles.errorText}>{errorMessage}</Text>
  </View>
);

const App: React.FC = () => {
  const [hasInternetConnection, setHasInternetConnection] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setHasInternetConnection(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const renderContent = () => {
    if (!hasInternetConnection) {
      return <ErrorScreen errorMessage="No internet connection. Please check your connection and try again." />;
    }
    return (
      <MyTabs />
    );
  };

  return (
    // <ErrorBoundary>
      renderContent()
    // {/* </ErrorBoundary> */}
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default App;
