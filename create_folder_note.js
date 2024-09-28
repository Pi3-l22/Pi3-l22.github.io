module.exports = async (params) => {
    const { inputPrompt } = params.quickAddApi;
    const app = params.app;

    // 获取用户输入的文件名称（不包含路径）
    const noteName = await inputPrompt("Enter note name:");
    if (!noteName) {
        new Notice("No input provided.", 5000);
        return;
    }

    try {
        // 获取当前日期
        const year = window.moment().format("YYYY");
        const month = window.moment().format("MM");
        
        // 创建路径
        const basePath = './content/post';
        const yearPath = basePath + '/' + year;
        const monthPath = yearPath + '/' + month;
        
        // 确保路径有效
        const notePath = monthPath + '/' + noteName + '.md';

        // 创建文件夹结构
        await ensureDirectoryExists(app.vault.adapter, monthPath);

        // 创建笔记文件
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
        if (file) {
            // 打开笔记文件
            const leaf = app.workspace.getLeaf(false);
            if (leaf) {
                leaf.openFile(file);
                new Notice(`Note '${noteName}' created successfully.`, 5000);
            } else {
                new Notice("No active leaf to open the file.", 5000);
            }
        } else {
            new Notice("Failed to create note.", 5000);
        }
    } catch (error) {
        new Notice(`Error: ${error}`, 5000);
    }
};

// 确保目录存在，如果不存在则创建
async function ensureDirectoryExists(adapter, dirPath) {
    try {
        if (!adapter.exists(dirPath)) {
            await adapter.mkdir(dirPath);
        }
    } catch (error) {
        throw new Error(`Failed to create directory: ${error}`);
    }
}