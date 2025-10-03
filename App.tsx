import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import WebViewShell from './src/components/WebViewShell';
import { logInfo } from './src/lib/logger';

export default function App() {
  React.useEffect(() => {
    logInfo('app_start', { timestamp: new Date().toISOString() });
  }, []);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="light" backgroundColor="#000" />
        <WebViewShell />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
