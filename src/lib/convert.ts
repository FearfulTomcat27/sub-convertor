import { ClashConfig, ProxyConfig } from "./types";
import { initialConfig } from "./config-data";

const NODE_SELECTION = "🚀 节点选择";
const AUTO_SELECTION = "♻️ 自动选择";

function parseVlessUrl(vlessUrl: string): ProxyConfig {
  const u = new URL(vlessUrl);
  const name = u.hash ? decodeURIComponent(u.hash) : "UnnamedNode";

  return {
    name,
    type: u.protocol.replace(":", ""),
    server: u.hostname,
    port: parseInt(u.port, 10) || 443,
    uuid: u.username,
    alterId: 0,
    cipher: "auto",
    udp: true,
    flow: u.searchParams.get("flow") || "",
    tls: true,
    servername: u.searchParams.get("sni") || "",
    "reality-opts": {
      "public-key": u.searchParams.get("pbk") || "",
      "short-id": u.searchParams.get("sid") || "",
    },
    "client-fingerprint": u.searchParams.get("fp") || "chrome",
  };
}

export function vlessLinksToClashConfig(vlessLinks: string[]): ClashConfig {
  const yamlData: ClashConfig = structuredClone(initialConfig);

  const nodeSelectionGroup = yamlData["proxy-groups"].find(
    (it) => it.name === NODE_SELECTION
  );
  const autoSelectionGroup = yamlData["proxy-groups"].find(
    (it) => it.name === AUTO_SELECTION
  );

  for (const link of vlessLinks) {
    const proxy = parseVlessUrl(link);
    yamlData.proxies.push(proxy);
    if (nodeSelectionGroup) nodeSelectionGroup.proxies.push(proxy.name);
    if (autoSelectionGroup) autoSelectionGroup.proxies.push(proxy.name);
  }

  return yamlData;
}

export function vlessToClashConfig(vlessUrl: string): ClashConfig {
  return vlessLinksToClashConfig([vlessUrl]);
}