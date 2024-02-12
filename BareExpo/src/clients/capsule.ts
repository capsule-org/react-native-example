import { CapsuleMobile, Environment } from "@usecapsule/react-native-wallet";

export const capsule = new CapsuleMobile(
  Environment.SANDBOX,
  "8ee2d015fbc6062a6e30bdc472f2946c",
  {
    offloadMPCComputationURL:
      "https://partner-mpc-computation.sandbox.usecapsule.com",
  }
);
