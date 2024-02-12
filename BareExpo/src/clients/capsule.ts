import { CapsuleMobile, Environment } from "@usecapsule/react-native-wallet";

export const capsule = new CapsuleMobile(Environment.SANDBOX, "YOUR_API_KEY", {
  offloadMPCComputationURL:
    "https://partner-mpc-computation.sandbox.usecapsule.com",
});
