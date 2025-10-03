/**
 * WebView Shell Component
 * Handles navigation, errors, and JS bridging
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  BackHandler,
  Platform,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { Linking } from 'react-native';
// Note: VolumeManager requires native linking, using alternative approach for Expo managed workflow
// import VolumeManager from 'react-native-volume-manager';
import { logInfo, logWarn, logError } from '../lib/logger';
import { validateAppUrl } from '../lib/validation';

interface WebViewShellProps {
  onError?: (error: string) => void;
}

export default function WebViewShell({ onError }: WebViewShellProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [canGoBack, setCanGoBack] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [systemVolume, setSystemVolume] = useState(0.8);
  const webViewRef = useRef<WebView>(null);
  const backPressCount = useRef(0);
  const backPressTimeout = useRef<NodeJS.Timeout | null>(null);

  let appUrl: string;
  try {
    appUrl = validateAppUrl();
  } catch (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Configuration Error</Text>
        <Text style={styles.errorMessage}>{error instanceof Error ? error.message : 'Unknown error'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => {}}>
          <Text style={styles.retryButtonText}>Fix Configuration</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleLoadStart = useCallback(() => {
    logInfo('wv_load_start', { url: appUrl });
    setIsLoading(true);
    setHasError(false);
  }, [appUrl]);

  const handleLoadEnd = useCallback(() => {
    logInfo('wv_load_finish', { url: appUrl });
    setIsLoading(false);
    setIsRefreshing(false);
  }, [appUrl]);

  const handleError = useCallback((syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    const error = `WebView Error: ${nativeEvent.description || 'Unknown error'}`;
    
    logError('wv_error', {
      url: appUrl,
      code: nativeEvent.code,
      description: nativeEvent.description,
    });
    
    setHasError(true);
    setErrorMessage(error);
    setIsLoading(false);
    onError?.(error);
  }, [appUrl, onError]);

  const handleNavigationStateChange = useCallback((navState: any) => {
    setCanGoBack(navState.canGoBack);
    
    // Check if URL is external
    const currentUrl = navState.url;
    if (currentUrl && !currentUrl.startsWith(appUrl)) {
      logInfo('external_link_opened', { url: currentUrl });
      Linking.openURL(currentUrl);
      return false; // Prevent navigation
    }
    
    return true;
  }, [appUrl]);

  const handleMessage = useCallback((event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'js_error') {
        logError('js_error_forwarded', {
          message: data.message,
          stack: data.stack,
          url: data.url,
        });
      } else if (data.type === 'volume_change') {
        handleVolumeChange(data.volume);
      }
    } catch (error) {
      logWarn('invalid_js_message', { data: event.nativeEvent.data });
    }
  }, []);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    webViewRef.current?.reload();
  }, []);

  // Volume management functions (simplified for Expo managed workflow)
  const getSystemVolume = useCallback(async () => {
    try {
      // In Expo managed workflow, we can't directly control system volume
      // Instead, we'll manage volume through the WebView
      logInfo('volume_get', { volume: systemVolume });
      return systemVolume;
    } catch (error) {
      logWarn('volume_get_failed', { error: error instanceof Error ? error.message : 'Unknown error' });
      return 0.8;
    }
  }, [systemVolume]);

  const setSystemVolumeLevel = useCallback(async (volume: number) => {
    try {
      // In Expo managed workflow, we communicate volume changes to the WebView
      setSystemVolume(volume);
      logInfo('volume_changed', { volume });
      
      // Notify WebView of volume change
      webViewRef.current?.postMessage(JSON.stringify({
        type: 'system_volume_change',
        volume: volume
      }));
    } catch (error) {
      logError('volume_set_failed', { error: error instanceof Error ? error.message : 'Unknown error', volume });
    }
  }, []);

  // Handle volume changes from web app
  const handleVolumeChange = useCallback((volume: number) => {
    setSystemVolumeLevel(volume);
  }, [setSystemVolumeLevel]);

  // Initialize volume on mount
  useEffect(() => {
    getSystemVolume();
  }, [getSystemVolume]);

  // Handle hardware volume buttons (simplified for Expo managed workflow)
  useEffect(() => {
    // In Expo managed workflow, we can't directly listen to hardware volume buttons
    // Volume changes will be handled through the WebView's volume controls
    logInfo('volume_listener_setup', { message: 'Volume changes handled through WebView' });
  }, []);

  const handleBackPress = useCallback(() => {
    if (canGoBack) {
      logInfo('nav_back', { action: 'webview_back' });
      webViewRef.current?.goBack();
      return true;
    }

    // Double back to exit
    if (backPressCount.current === 0) {
      backPressCount.current = 1;
      logInfo('nav_back', { action: 'first_back_press' });
      
      if (Platform.OS === 'android') {
        Alert.alert(
          'Exit App',
          'Press back again to exit the app',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Exit', style: 'destructive', onPress: () => BackHandler.exitApp() },
          ]
        );
      }
      
      backPressTimeout.current = setTimeout(() => {
        backPressCount.current = 0;
      }, 2000);
      
      return true;
    }

    logInfo('nav_back', { action: 'exit_app' });
    BackHandler.exitApp();
    return true;
  }, [canGoBack]);

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backHandler.remove();
  }, [handleBackPress]);

  const injectedJavaScript = `
    (function() {
      // Forward JS errors to React Native
      window.addEventListener('error', function(event) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'js_error',
          message: event.message,
          stack: event.error ? event.error.stack : null,
          url: event.filename
        }));
      });
      
      window.addEventListener('unhandledrejection', function(event) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'js_error',
          message: event.reason ? event.reason.toString() : 'Unhandled Promise Rejection',
          stack: event.reason ? event.reason.stack : null,
          url: window.location.href
        }));
      });

      // Volume control bridge
      window.mobileVolumeControl = {
        setVolume: function(volume) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'volume_change',
            volume: volume
          }));
        },
        getVolume: function() {
          return ${systemVolume};
        }
      };

      // Listen for system volume changes from React Native
      window.addEventListener('message', function(event) {
        if (event.data && event.data.type === 'system_volume_change') {
          // Update all audio elements with new volume
          const audioElements = document.querySelectorAll('audio');
          audioElements.forEach(audio => {
            audio.volume = event.data.volume;
          });
          
          // Trigger volume change event for web app
          window.dispatchEvent(new CustomEvent('volumechange', {
            detail: { volume: event.data.volume }
          }));
        }
      });

      // Enhanced audio lifecycle management for mobile
      let audioElements = new Set();
      
      // Track all audio elements
      const originalAudioConstructor = window.Audio;
      window.Audio = function() {
        const audio = new originalAudioConstructor();
        audioElements.add(audio);
        
        // Remove from tracking when audio ends or is removed
        audio.addEventListener('ended', () => {
          audioElements.delete(audio);
        });
        
        return audio;
      };
      
      // Pause all audio when page becomes hidden
      document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
          audioElements.forEach(audio => {
            if (!audio.paused) {
              audio.pause();
            }
          });
        }
      });
      
      // Pause all audio when page is about to unload
      window.addEventListener('beforeunload', function() {
        audioElements.forEach(audio => {
          if (!audio.paused) {
            audio.pause();
          }
        });
      });

      // Override audio volume controls (integrated with lifecycle management)
      const originalVolumeSetter = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'volume').set;
      
      // Update the Audio constructor to include volume control
      const enhancedAudioConstructor = function() {
        const audio = new originalAudioConstructor();
        audioElements.add(audio);
        
        // Remove from tracking when audio ends
        audio.addEventListener('ended', () => {
          audioElements.delete(audio);
        });
        
        // Override volume setter to notify React Native
        Object.defineProperty(audio, 'volume', {
          set: function(value) {
            originalVolumeSetter.call(this, value);
            // Notify React Native of volume change
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'volume_change',
              volume: value
            }));
          },
          get: function() {
            return originalVolumeSetter.call(this);
          }
        });
        
        return audio;
      };
      
      // Replace the Audio constructor
      window.Audio = enhancedAudioConstructor;

      // Add safe area CSS to prevent slipping
      const style = document.createElement('style');
      style.textContent = \`
        /* Prevent body overscroll and add safe areas */
        html, body {
          overscroll-behavior: none !important;
          -webkit-overflow-scrolling: touch !important;
          position: fixed !important;
          width: 100% !important;
          height: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden !important;
        }
        
        /* Add safe area insets */
        body {
          padding-top: env(safe-area-inset-top) !important;
          padding-bottom: env(safe-area-inset-bottom) !important;
          padding-left: env(safe-area-inset-left) !important;
          padding-right: env(safe-area-inset-right) !important;
        }
        
        /* Make sure main content container handles overflow */
        #root, [data-reactroot] {
          height: 100vh !important;
          height: calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom)) !important;
          overflow-y: auto !important;
          -webkit-overflow-scrolling: touch !important;
          overscroll-behavior: none !important;
        }
        
        /* Prevent any element from causing overscroll */
        * {
          overscroll-behavior: none !important;
        }
      \`;
      document.head.appendChild(style);
      
      true; // Required for injected JavaScript
    })();
  `;

  if (hasError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Loading Error</Text>
        <Text style={styles.errorMessage}>{errorMessage}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={{ top: 'additive', bottom: 'additive' }}>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading Mindsphere...</Text>
        </View>
      )}
      
      <WebView
        ref={webViewRef}
        source={{ uri: appUrl }}
        style={styles.webview}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        onNavigationStateChange={handleNavigationStateChange}
        onMessage={handleMessage}
        injectedJavaScript={injectedJavaScript}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={false}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        allowsFullscreenVideo={true}
        mixedContentMode="compatibility"
        thirdPartyCookiesEnabled={true}
        sharedCookiesEnabled={true}
        pullToRefreshEnabled={true}
        overScrollMode="never"
        bounces={false}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled={false}
        decelerationRate="normal"
        userAgent="Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
