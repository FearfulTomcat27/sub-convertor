"use client";

import { useState } from "react";
import yaml from "js-yaml";
import { vlessLinksToClashConfig } from "@/lib/convert";

interface OutputState {
  yaml: string;
}

export default function Home() {
  const [links, setLinks] = useState<string[]>([""]);
  const [error, setError] = useState("");
  const [output, setOutput] = useState<OutputState | null>(null);

  function updateLink(index: number, value: string) {
    const updated = [...links];
    updated[index] = value;
    setLinks(updated);
  }

  function addLink() {
    setLinks([...links, ""]);
  }

  function removeLink(index: number) {
    if (links.length === 1) {
      setLinks([""]);
      return;
    }
    setLinks(links.filter((_, i) => i !== index));
  }

  function handleConvert() {
    setError("");
    setOutput(null);

    const validLinks = links
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    if (validLinks.length === 0) {
      setError("请输入至少一条 VLESS 链接");
      return;
    }

    try {
      const config = vlessLinksToClashConfig(validLinks);
      const yamlString = yaml.dump(config, {
        indent: 2,
        lineWidth: -1,
        noRefs: true,
      });
      setOutput({ yaml: yamlString });
    } catch (e) {
      setError("链接解析失败：" + (e as Error).message);
    }
  }

  async function handleDownload() {
    if (!output) return;

    // 优先使用 File System Access API 弹出"另存为"对话框
    if ("showSaveFilePicker" in window) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: "sub.yaml",
          types: [
            {
              description: "YAML 文件",
              accept: { "text/yaml": [".yaml", ".yml"] },
            },
          ],
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const writable = await (handle as any).createWritable();
        await writable.write(output.yaml);
        await writable.close();
        return;
      } catch (e) {
        // 用户取消选择或其他错误，静默处理
        if ((e as Error).name === "AbortError") return;
      }
    }

    // 不支持 File System Access API 时 fallback 到直接下载
    const blob = new Blob([output.yaml], {
      type: "text/yaml;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sub.yaml";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col items-center justify-start py-12 px-4">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-neutral-900 tracking-tight">
          Sub Convertor
        </h1>
        <p className="mt-2 text-neutral-500 text-sm">
          VLESS 链接 → Clash YAML 配置
        </p>
        <div className="mt-4 h-1 w-20 bg-klein-blue mx-auto rounded-full" />
      </header>

      <main className="w-full max-w-2xl bg-white rounded-xl shadow-sm border border-neutral-200 p-8">
        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            VLESS 链接
          </label>

          <div className="space-y-3">
            {links.map((link, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="shrink-0 w-6 h-10 flex items-center justify-center text-xs text-neutral-400 font-mono">
                  {index + 1}
                </span>
                <input
                  type="text"
                  placeholder="vless://uuid@host:port?encryption=none&flow=xtls-rprx-vision&security=reality&sni=...&pbk=...&sid=...&fp=chrome#节点名"
                  value={link}
                  onChange={(e) => updateLink(index, e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-klein-blue focus:ring-1 focus:ring-klein-blue/30 focus:bg-white transition outline-none"
                />
                <button
                  onClick={() => removeLink(index)}
                  className="shrink-0 h-10 w-10 rounded-lg border border-neutral-300 bg-neutral-50 text-neutral-500 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors flex items-center justify-center"
                  title="删除此链接"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={addLink}
            className="mt-3 w-full py-2.5 rounded-lg border border-neutral-300 bg-neutral-50 text-neutral-600 text-sm hover:border-klein-blue hover:text-klein-blue transition-colors flex items-center justify-center gap-1"
          >
            <span className="text-base leading-none">+</span>
            添加链接
          </button>
        </div>

        <button
          onClick={handleConvert}
          className="w-full py-3 rounded-lg bg-klein-blue text-white font-medium text-sm hover:bg-klein-blue/90 active:bg-klein-blue/80 transition-colors focus:outline-none focus:ring-2 focus:ring-klein-blue/40"
        >
          转换为 YAML
        </button>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {output && (
          <div className="mt-6">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              YAML 配置预览
            </label>
            <pre
              className="w-full rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-xs text-neutral-700 overflow-auto max-h-64 font-mono leading-relaxed"
            >
              {output.yaml}
            </pre>

            <button
              onClick={handleDownload}
              className="mt-4 w-full py-3 rounded-lg border-2 border-klein-blue text-klein-blue font-medium text-sm hover:bg-klein-blue hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-klein-blue/40"
            >
              下载 YAML 文件
            </button>
          </div>
        )}
      </main>

      <footer className="mt-8 text-neutral-400 text-xs">
        Sub Convertor · VLESS to Clash YAML
      </footer>
    </div>
  );
}