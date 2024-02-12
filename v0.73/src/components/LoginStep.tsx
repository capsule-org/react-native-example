import {useState} from 'react';
import {Text, View} from 'react-native';
import Toast from 'react-native-toast-message';
import {capsule} from '../clients/capsule';
import {Button} from './Button';
import {LoginModal} from './LoginModal';

interface LoginStepProps {
  goToNextStep: () => void;
  setIsCreatingWallet: (isCreating: boolean) => void;
}

export const LoginStep = ({
  goToNextStep,
  setIsCreatingWallet,
}: LoginStepProps) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleModalClose = async (success?: boolean, needsWallet?: boolean) => {
    setIsLoginModalOpen(false);
    if (success) {
      try {
        setIsCreatingWallet(true);
        goToNextStep();

        // If the user doesn't have a wallet, create one for them
        if (needsWallet) {
          await capsule.createWallet(false, () => {});
          Toast.show({
            type: 'success',
            text1: '🔥 Wallet created successfully! 🔥',
          });
        }
      } catch (e) {
        console.error('Wallet Creation Error: ', e);
        Toast.show({type: 'error', text1: 'Wallet creation failed.'});
      } finally {
        setIsCreatingWallet(false);
      }
    }
  };

  return (
    <>
      <View style={{flex: 1, justifyContent: 'space-between', paddingTop: 36}}>
        <Text
          style={{
            color: 'white',
            fontSize: 16,
            textAlign: 'center',
          }}>
          Login to continue
        </Text>
        <Button title="Login" onPress={() => setIsLoginModalOpen(true)} />
      </View>
      <LoginModal isOpen={isLoginModalOpen} onClose={handleModalClose} />
    </>
  );
};
