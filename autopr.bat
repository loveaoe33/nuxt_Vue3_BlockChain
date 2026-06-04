@echo off
echo ====================================
echo   🚀 啟動自動化 Git 流程 (含防衝突機制)...
echo ====================================

:: 1. 取得當前分支名稱並存入變數
for /f "delims=" %%a in ('git rev-parse --abbrev-ref HEAD') do set CURRENT_BRANCH=%%a

echo [1/5] 將所有變更加入暫存區 (git add .)...
git add .

echo [2/5] 建立快速 Commit...
git commit -m "Auto push for PR: %CURRENT_BRANCH%"

echo [3/5] 🔄 抓取最新 main 分支並更新基底 (Rebase)...
:: 先抓取遠端 origin 的 main 最新狀態
git fetch origin main
:: 將當前分支的基底對齊最新的 main
git rebase origin/main

:: 防呆機制：檢查 rebase 是否發生衝突
if %errorlevel% neq 0 (
    echo.
    echo ❌ 警告：發現程式碼衝突！
    echo 自動化腳本已暫停，因為你修改的檔案與最新的 main 有衝突。
    echo.
    echo 🛠️ 請按照以下步驟手動處理：
    echo   1. 在 VS Code 中打開有衝突的檔案並解決它。
    echo   2. 在終端機輸入： git add .
    echo   3. 在終端機輸入： git rebase --continue
    echo   4. 手動推播並發 PR：
    echo      git push origin %CURRENT_BRANCH% -f
    echo      gh pr create --fill --head %CURRENT_BRANCH% --base main
    echo ====================================
    exit /b %errorlevel%
)

echo [4/5] 推送至遠端分支 (%CURRENT_BRANCH%)...
:: 因為使用了 rebase 改變了歷史軌跡，這裡必須加上 -f (force) 強制推送
git push origin %CURRENT_BRANCH% -f

echo [5/5] 正在透過 GitHub CLI 建立 Pull Request...
gh pr create --fill --head %CURRENT_BRANCH% --base main

echo ====================================
echo   ✅ 任務完成！PR 已建立。
echo   等待 Qodo 機器人接手 Review...
echo ====================================0