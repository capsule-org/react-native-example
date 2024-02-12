require("node-libs-expo/globals");
import "./shim";
import { registerRootComponent } from "expo";
import App from "./App";

registerRootComponent(App);
