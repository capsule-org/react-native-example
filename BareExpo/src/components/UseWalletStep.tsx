import { SuccessfulSignatureRes } from "@usecapsule/web-sdk";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { capsule } from "../clients/capsule";
import { Button } from "./Button";
import * as Clipboard from "expo-clipboard";

interface UseWalletStepProps {
  onLogout: () => void;
}

const TX_MESSAGE = "hello";

export const UseWalletStep = ({ onLogout }: UseWalletStepProps) => {
  const [walletId, setWalletId] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [email, setEmail] = useState("");
  const [txSignature, setTXSignature] = useState("");
  const [isSigning, setIsSigning] = useState(false);
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);

  const fetchAndSetWallet = () => {
    // Get all wallets and set the first ID and address for display
    const allWallets = capsule.getWallets();
    const firstWalletId = Object.keys(allWallets)[0];

    setWalletId(firstWalletId);
    setWalletAddress(allWallets[firstWalletId]?.address ?? "");
  };

  // Get wallet & email
  useEffect(() => {
    fetchAndSetWallet();
    setEmail(capsule.getEmail() ?? "");
  }, []);

  // If for some reason the user still doesn't have a wallet, allow them to create one
  const handleCreateWallet = async () => {
    try {
      setIsCreatingWallet(true);

      await capsule.createWallet(false, () => {});

      Toast.show({
        type: "success",
        text1: "🔥 Wallet created successfully! 🔥",
      });
      fetchAndSetWallet();
    } catch (e) {
      console.error("Wallet Creation Error: ", e);
      Toast.show({ type: "error", text1: "Wallet creation failed." });
    } finally {
      setIsCreatingWallet(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Are you sure you want to logout?",
      undefined,
      [
        { text: "Cancel", onPress: () => {}, style: "cancel" },
        {
          text: "Logout",
          onPress: async () => {
            // Log the user out
            await capsule.logout();

            onLogout();
          },
        },
      ],
      {
        userInterfaceStyle: "dark",
      }
    );
  };

  const handleSignSampleTX = async () => {
    try {
      setIsSigning(true);

      // Sign a sample "hello" message
      const resp = await capsule.signMessage(
        walletId,
        Buffer.from(
          "1c8aff950685c2ed4bc3174f3472287b56d9517b9c948127319a09a7a36deac8",
          "hex"
        ).toString("base64")
      );

      Toast.show({ type: "success", text1: "🔥 TX signed successfully! 🔥" });

      // Set TX signature for display
      setTXSignature(`0x${(resp as SuccessfulSignatureRes).signature}`);
    } catch (e) {
      console.error("TX Sign Error: ", e);
      Toast.show({ type: "error", text1: "TX signing failed." });
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <>
      <View style={{ flex: 1, paddingTop: 36 }}>
        <Text
          style={{
            color: "white",
            fontSize: 16,
            textAlign: "center",
            paddingBottom: 16,
          }}
        >
          Press any field to copy
        </Text>
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 16 }}>
          <TouchableOpacity
            onPress={() => {
              Clipboard.setStringAsync(email);
            }}
          >
            <Text style={{ color: "white", fontSize: 16 }}>Email:</Text>
            <Text style={{ color: "white", fontSize: 16 }}>{email}</Text>
          </TouchableOpacity>
          {walletId && (
            <>
              <TouchableOpacity
                onPress={() => {
                  Clipboard.setStringAsync(walletId);
                }}
              >
                <Text style={{ color: "white", fontSize: 16, paddingTop: 16 }}>
                  Wallet ID:
                </Text>
                <Text style={{ color: "white", fontSize: 16 }}>{walletId}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Clipboard.setStringAsync(walletAddress);
                }}
              >
                <Text style={{ color: "white", fontSize: 16, paddingTop: 16 }}>
                  Wallet Address:
                </Text>
                <Text style={{ color: "white", fontSize: 16 }}>
                  {walletAddress}
                </Text>
              </TouchableOpacity>
            </>
          )}
          {txSignature && (
            <>
              <TouchableOpacity
                onPress={() => {
                  Clipboard.setStringAsync(TX_MESSAGE);
                }}
              >
                <Text style={{ color: "white", fontSize: 16, paddingTop: 16 }}>
                  TX Message:
                </Text>
                <Text style={{ color: "white", fontSize: 16 }}>
                  {TX_MESSAGE}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Clipboard.setStringAsync(txSignature);
                }}
              >
                <Text style={{ color: "white", fontSize: 16, paddingTop: 16 }}>
                  TX Signature:
                </Text>
                <Text style={{ color: "white", fontSize: 16 }}>
                  {txSignature}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
        <View style={{ justifyContent: "flex-end", gap: 16 }}>
          {!walletId ? (
            <Button
              onPress={handleCreateWallet}
              title="Create Wallet"
              isLoading={isCreatingWallet}
            />
          ) : (
            <Button
              onPress={handleSignSampleTX}
              title="Sign Sample TX"
              isLoading={isSigning}
            />
          )}
          <Button onPress={handleLogout} title="Logout" />
        </View>
      </View>
    </>
  );
};
