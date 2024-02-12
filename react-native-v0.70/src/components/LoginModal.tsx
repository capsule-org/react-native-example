import {useState} from 'react';
import {
  Modal,
  NativeSyntheticEvent,
  Text,
  TextInput,
  TextInputChangeEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import {capsule} from '../clients/capsule';
import {Button} from './Button';
import Toast from 'react-native-toast-message';
import {toastConfig} from '../config/toastConfig';
import InAppBrowser from 'react-native-inappbrowser-reborn';

interface LoginModalProps {
  isOpen: boolean;
  onClose: (success?: boolean, isLogin?: boolean) => void;
}

export const LoginModal = ({isOpen, onClose}: LoginModalProps) => {
  const [step, setStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const headingText =
    step === 1
      ? 'Start signing up by entering your email'
      : 'Check your email for your verification code';
  const buttonText = step === 1 ? 'Continue' : 'Verify';
  const placeholderText = step === 1 ? 'Email' : 'Code';

  const handleCreateUser = async () => {
    try {
      setIsLoading(true);

      // Check for existing user
      const userExists = await capsule.checkIfUserExists(email);

      if (userExists) {
        // If user exists initiate a login and skip the verification step
        const webAuthLoginUrl = await capsule.initiateUserLogin(email, true);
        InAppBrowser.open(webAuthLoginUrl);
        const {needsWallet} = await capsule.waitForLoginAndSetup();
        InAppBrowser.close();

        Toast.show({
          type: 'success',
          text1: '🔥 User logged in successfully! 🔥',
        });
        onClose(true, needsWallet);
      } else {
        // If user doesn't exists, create them
        await capsule.createUser(email);
        setStep(2);
      }
    } catch (e) {
      console.error('Create User Error: ', e);
      Toast.show({
        type: 'error',
        text1: 'An error occurred, please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    try {
      setIsLoading(true);

      // Verify the users email code and initiate account creation
      const webAuthCreateUrl = await capsule.verifyEmail(verificationCode);
      InAppBrowser.open(webAuthCreateUrl);
      await capsule.waitForAccountCreation();
      InAppBrowser.close();

      Toast.show({
        type: 'success',
        text1: '🔥 User created successfully! 🔥',
      });
      onClose(true, true);
    } catch (e) {
      console.error('Verify Email Error: ', e);
      Toast.show({
        type: 'error',
        text1: 'An error occurred, please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonPress = () => {
    if (step === 1) {
      handleCreateUser();
    } else {
      handleVerifyCode();
    }
  };

  const handleInputChange = (
    e: NativeSyntheticEvent<TextInputChangeEventData>,
  ) => {
    if (step === 1) {
      setEmail(e.nativeEvent.text);
    } else {
      setVerificationCode(e.nativeEvent.text);
    }
  };

  return (
    <Modal
      animationType="slide"
      visible={isOpen}
      onRequestClose={() => onClose()}>
      <View
        style={{
          backgroundColor: 'black',
          flex: 1,
          padding: 24,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            paddingBottom: 16,
          }}>
          <TouchableOpacity onPress={() => onClose()} style={{padding: 8}}>
            <Text style={{color: 'white', fontSize: 16}}>X</Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text
            style={{
              color: 'white',
              paddingBottom: 16,
              textAlign: 'center',
              fontSize: 18,
            }}>
            {headingText}
          </Text>
          <TextInput
            placeholder={placeholderText}
            placeholderTextColor="white"
            keyboardType={step === 1 ? 'email-address' : 'numeric'}
            cursorColor="white"
            autoCapitalize="none"
            autoComplete="off"
            style={{
              borderColor: 'white',
              borderWidth: 1,
              color: 'white',
              borderRadius: 8,
              padding: 12,
              fontSize: 18,
            }}
            value={step === 1 ? email : verificationCode}
            onChange={handleInputChange}
          />
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
          }}>
          <Button
            isLoading={isLoading}
            title={buttonText}
            onPress={handleButtonPress}
          />
        </View>
      </View>
      <Toast config={toastConfig} />
    </Modal>
  );
};
