# Sub Convertor

将 VLESS 链接转换为 Clash YAML 配置文件的 Web 工具。

## 功能

- 支持输入多条 VLESS 链接，逐条添加或删除
- 将链接解析为符合 Clash 规范的 YAML 配置
- 内置 Loyalsoldier 规则集（rule-providers + rules）
- 自动将节点添加至"节点选择"和"自动选择"策略组
- YAML 预览与一键下载

## 支持的 VLESS 参数

链接格式：`vless://uuid@host:port?参数#节点名`

解析的参数：

| 参数      | 对应字段                |
| --------- | ----------------------- |
| flow      | flow                    |
| sni       | servername              |
| pbk       | reality-opts.public-key |
| sid       | reality-opts.short-id   |
| fp        | client-fingerprint      |

## 技术栈

- Next.js 15 (App Router)
- React 19
- Tailwind CSS 4
- js-yaml

## 开发

```bash
pnpm install
pnpm dev
```

访问 http://localhost:3000

## 构建

```bash
pnpm build
pnpm start
```

## 项目结构

```
src/
  app/
    globals.css      # Tailwind + 主题色（克莱因蓝 #002FA7）
    layout.tsx        # 根布局
    page.tsx          # 主页面
  lib/
    types.ts          # ClashConfig 类型定义
    config-data.ts    # 初始配置模板（策略组、规则等）
    convert.ts        # VLESS 解析与批量转换逻辑
```

## 设计

- 中性色调（neutral 色系）为基底
- 克莱因蓝 `#002FA7` 作为点缀色，用于按钮、分隔线、交互焦点态