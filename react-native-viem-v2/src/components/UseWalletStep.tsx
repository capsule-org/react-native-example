import {useEffect, useState} from 'react';
import {Alert, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import Toast from 'react-native-toast-message';
import {capsule} from '../clients/capsule';
import {Button} from './Button';
import Clipboard from '@react-native-clipboard/clipboard';
import {createCapsuleViemClient} from '@usecapsule/react-native-wallet';
import {sepolia} from 'viem/chains';
import {ethers} from 'ethers';
import {http} from 'viem';

interface UseWalletStepProps {
  onLogout: () => void;
}

const ALCHEMY_SEPOLIA_PROVIDER =
  'https://eth-sepolia.g.alchemy.com/v2/KfxK8ZFXw9mTUuJ7jt751xGJCa3r8noZ';

const provider = new ethers.JsonRpcProvider(
  ALCHEMY_SEPOLIA_PROVIDER,
  'sepolia',
);

const DEFAULT_TO_ADDRESS = '0x42c9a72c9dfcc92cae0de9510160cea2da27af91';

export const UseWalletStep = ({onLogout}: UseWalletStepProps) => {
  const [walletId, setWalletId] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [email, setEmail] = useState('');
  const [txHash, setTXHash] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);

  const fetchAndSetWallet = () => {
    // Get all wallets and set the first ID and address for display
    const allWallets = capsule.getWallets();
    const firstWalletId = Object.keys(allWallets)[0];

    setWalletId(firstWalletId);
    setWalletAddress(allWallets[firstWalletId]?.address ?? '');
  };

  // Get wallet & email
  useEffect(() => {
    fetchAndSetWallet();
    setEmail(capsule.getEmail() ?? '');
  }, []);

  // If for some reason the user still doesn't have a wallet, allow them to create one
  const handleCreateWallet = async () => {
    try {
      setIsCreatingWallet(true);

      await capsule.createWallet(false, () => {});

      Toast.show({
        type: 'success',
        text1: '🔥 Wallet created successfully! 🔥',
      });
      fetchAndSetWallet();
    } catch (e) {
      console.error('Wallet Creation Error: ', e);
      Toast.show({type: 'error', text1: 'Wallet creation failed.'});
    } finally {
      setIsCreatingWallet(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Are you sure you want to logout?',
      undefined,
      [
        {text: 'Cancel', onPress: () => {}, style: 'cancel'},
        {
          text: 'Logout',
          onPress: async () => {
            // Log the user out
            await capsule.logout();

            onLogout();
          },
        },
      ],
      {
        userInterfaceStyle: 'dark',
      },
    );
  };

  const handleSendViemTX = async () => {
    try {
      setIsSending(true);

      const viemClient = createCapsuleViemClient(capsule, {
        // sepolia works fine here but throws a TS error if not casted to any
        chain: sepolia as any,
        transport: http(ALCHEMY_SEPOLIA_PROVIDER),
      });

      const resp = await viemClient.sendTransaction({
        value: BigInt(10100000000),
        to: DEFAULT_TO_ADDRESS,
        chain: sepolia as any,
        gas: BigInt(21000),
        maxPriorityFeePerGas: BigInt(1000000000),
        maxFeePerGas: BigInt(3000000000),
        account: viemClient.account!,
        nonce: await provider.getTransactionCount(walletAddress),
      });

      setTXHash(resp);
      Toast.show({type: 'success', text1: '🔥 TX sent successfully! 🔥'});
    } catch (e) {
      console.error('TX Send Error: ', e);
      Toast.show({type: 'error', text1: 'TX sending failed.'});
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <View style={{flex: 1, paddingTop: 36}}>
        <Text
          style={{
            color: 'white',
            fontSize: 16,
            textAlign: 'center',
            paddingBottom: 16,
          }}>
          Press any field to copy
        </Text>
        <ScrollView contentContainerStyle={{flexGrow: 1, paddingBottom: 16}}>
          <TouchableOpacity
            onPress={() => {
              Clipboard.setString(email);
            }}>
            <Text style={{color: 'white', fontSize: 16}}>Email:</Text>
            <Text style={{color: 'white', fontSize: 16}}>{email}</Text>
          </TouchableOpacity>
          {walletId && (
            <>
              <TouchableOpacity
                onPress={() => {
                  Clipboard.setString(walletId);
                }}>
                <Text style={{color: 'white', fontSize: 16, paddingTop: 16}}>
                  Wallet ID:
                </Text>
                <Text style={{color: 'white', fontSize: 16}}>{walletId}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Clipboard.setString(walletAddress);
                }}>
                <Text style={{color: 'white', fontSize: 16, paddingTop: 16}}>
                  Wallet Address:
                </Text>
                <Text style={{color: 'white', fontSize: 16}}>
                  {walletAddress}
                </Text>
              </TouchableOpacity>
            </>
          )}
          {txHash && (
            <>
              <TouchableOpacity
                onPress={() => {
                  Clipboard.setString(txHash);
                }}>
                <Text style={{color: 'white', fontSize: 16, paddingTop: 16}}>
                  TX Hash:
                </Text>
                <Text style={{color: 'white', fontSize: 16}}>{txHash}</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
        <View style={{justifyContent: 'flex-end', gap: 16}}>
          {!walletId ? (
            <Button
              onPress={handleCreateWallet}
              title="Create Wallet"
              isLoading={isCreatingWallet}
            />
          ) : (
            <Button
              onPress={handleSendViemTX}
              title="Send TX With Viem"
              isLoading={isSending}
            />
          )}
          <Button onPress={handleLogout} title="Logout" />
        </View>
      </View>
    </>
  );
};
