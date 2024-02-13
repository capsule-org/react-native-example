import React, {useEffect, useState} from 'react';
import {ActivityIndicator, SafeAreaView, Text, View} from 'react-native';
import Toast from 'react-native-toast-message';
import {toastConfig} from './src/config/toastConfig';
import {capsule} from './src/clients/capsule';
import {LoginStep} from './src/components/LoginStep';
import {UseWalletStep} from './src/components/UseWalletStep';
import {WagmiWrapper} from './src/components/WagmiWrapper';

function App(): React.JSX.Element {
  const [step, setStep] = useState(1);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);

  const isLoading = isInitializing || isCreatingWallet;

  const goToSecondStep = () => {
    setStep(2);
  };

  const onLogout = () => {
    setStep(1);
  };

  useEffect(() => {
    const init = async () => {
      try {
        setIsInitializing(true);

        // Initialize Capsule before proceeding to the app
        await capsule.init();

        if (await capsule.isSessionActive()) {
          goToSecondStep();
        }
      } catch (e) {
        console.error('Init Error: ', e);
      } finally {
        setIsInitializing(false);
      }
    };

    init();
  }, []);

  return (
    <>
      <WagmiWrapper>
        <SafeAreaView style={{flex: 1}}>
          <View style={{backgroundColor: 'black', flex: 1, padding: 24}}>
            <Text style={{textAlign: 'center', color: 'white', fontSize: 24}}>
              Capsule{'\n'}React Native Sample App{'\n'}Wagmi v1
            </Text>
            {isLoading ? (
              <View style={{flex: 1, justifyContent: 'center'}}>
                <ActivityIndicator size="large" color="white" />
                {isCreatingWallet && (
                  <Text
                    style={{
                      textAlign: 'center',
                      color: 'white',
                      fontSize: 18,
                      paddingTop: 8,
                    }}>
                    Creating Wallet...
                  </Text>
                )}
              </View>
            ) : (
              <>
                {step === 1 ? (
                  <LoginStep
                    goToNextStep={goToSecondStep}
                    setIsCreatingWallet={setIsCreatingWallet}
                  />
                ) : (
                  <UseWalletStep onLogout={onLogout} />
                )}
              </>
            )}
          </View>
        </SafeAreaView>
        <Toast config={toastConfig} />
      </WagmiWrapper>
    </>
  );
}

export default App;
