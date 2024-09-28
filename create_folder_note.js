module.exports = async (params) => {
    const { inputPrompt } = params.quickAddApi;
    const app = params.app;

    const noteName = await inputPrompt("Enter note name:");
    if (!noteName) {
        new Notice("No input provided.", 5000);
        return;
    }

    try {
        const year = window.moment().format("YYYY");
        const month = window.moment().format("MM");
        
        const basePath = './content/post';
        const yearPath = `${basePath}/${year}`;
        const monthPath = `${yearPath}/${month}`;
        const notePath = `${monthPath}/${noteName}.md`;

        // 创建文件夹结构
        await ensureDirectoryExists(app.vault.adapter, yearPath);
        await ensureDirectoryExists(app.vault.adapter, monthPath);

        // 创建笔记文件内容
        const fileContent = `---
title: ${noteName}
date: ${window.moment().format("YYYY-MM-DD")}
description: 
tags: []
draft: true
slug: 
---

<!--more-->`;

        const file = await app.vault.create(notePath, fileContent);
        // const leaf = app.workspace.getLeaf();
        // await leaf.openFile(file);
    } catch (error) {
        new Notice(`Error: ${error.message}`, 5000);
    }
};

// 确保目录存在
async function ensureDirectoryExists(adapter, path) {
    try {
        await adapter.exists(path) || await adapter.mkdir(path);
    } catch (error) {
        throw new Error(`Failed to create directory ${path}: ${error.message}`);
    }
}