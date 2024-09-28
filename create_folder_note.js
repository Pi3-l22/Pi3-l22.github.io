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
        const yearPath = `${basePath}/${year}`;
        const monthPath = `${yearPath}/10`;
        const notePath = `${monthPath}/${noteName}.md`;

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

        // 我们需要确保路径以'/'开头，因为app.vault.create期望的是相对于vault的路径
        const relativePath = notePath.replace(/^\.\/|\.md$/g, '');
        const file = await app.vault.create(relativePath, fileContent);
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
        // 移除路径末尾的'/'，因为mkdir期望的是文件夹名称，而不是路径
        const dirName = dirPath.replace(/\/$/, '');
        if (!adapter.exists(dirName)) {
            await adapter.mkdir(dirName);
        }
    } catch (error) {
        throw new Error(`Failed to create directory: ${error}`);
    }
}