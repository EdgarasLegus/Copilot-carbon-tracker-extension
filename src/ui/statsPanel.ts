import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { TrackerService } from '../services/trackerService';
import { CarbonCalculator } from '../utils/carbonCalculator';

export class StatsPanel {
    private static currentPanel: StatsPanel | undefined;
    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private _disposables: vscode.Disposable[] = [];

    public static createOrShow(
        extensionUri: vscode.Uri,
        trackerService: TrackerService,
        context: vscode.ExtensionContext
    ): StatsPanel {
        if (StatsPanel.currentPanel) {
            StatsPanel.currentPanel._panel.reveal();
            StatsPanel.currentPanel.update(trackerService);
            return StatsPanel.currentPanel;
        }

        const panel = vscode.window.createWebviewPanel(
            'aiCarbonStats',
            '🌍 AI Carbon Stats',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [
                    vscode.Uri.file(path.join(extensionUri.fsPath, 'src', 'ui'))
                ]
            }
        );

        StatsPanel.currentPanel = new StatsPanel(panel, extensionUri, trackerService, context);
        return StatsPanel.currentPanel;
    }

    private constructor(
        panel: vscode.WebviewPanel,
        extensionUri: vscode.Uri,
        trackerService: TrackerService,
        context: vscode.ExtensionContext
    ) {
        this._panel = panel;
        this._extensionUri = extensionUri;

        this.update(trackerService);

        // Listen for when the panel is disposed
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        this._panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'reset':
                        vscode.commands.executeCommand('copilot-carbon-tracker.reset');
                        this._panel.dispose();
                        break;
                    case 'export':
                        vscode.commands.executeCommand('copilot-carbon-tracker.export');
                        break;
                    case 'changeModel':
                        vscode.commands.executeCommand('copilot-carbon-tracker.changeModel');
                        break;
                }
            },
            null,
            context.subscriptions
        );
    }

    public update(trackerService: TrackerService) {
        this._panel.webview.html = this._getHtmlForWebview(trackerService);
    }

    private _getHtmlForWebview(trackerService: TrackerService): string {
        const metrics = trackerService.getMetrics();
        const averages = CarbonCalculator.calculateAverages(metrics);
        const comparisons = CarbonCalculator.getComparisons(metrics.totalCO2Grams);
        const modelInfo = CarbonCalculator.getCurrentModel();
        const yearlyProjection = CarbonCalculator.projectYearly(averages.dailyAverage);
        const daysSinceStart = trackerService.getDaysSinceStart();
        
        const htmlContent = this._loadTemplate('templates/statsView.html');
        const cssContent = this._loadTemplate('styles/statsStyles.css');
        
        return htmlContent
            .replace('{{styles}}', cssContent)
            .replace('{{daysSinceStart}}', daysSinceStart.toFixed(1))
            .replace('{{modelDescription}}', modelInfo.description)
            .replace('{{totalCO2Grams}}', metrics.totalCO2Grams.toFixed(2))
            .replace('{{totalTokens}}', metrics.totalTokens.toLocaleString())
            .replace('{{suggestionsAccepted}}', metrics.suggestionsAccepted.toString())
            .replace('{{dailyAverage}}', averages.dailyAverage.toFixed(2))
            .replace('{{perSuggestion}}', averages.perSuggestion.toFixed(3))
            .replace('{{smartphones}}', comparisons.smartphones)
            .replace('{{carMiles}}', comparisons.carMiles)
            .replace('{{ledBulbHours}}', comparisons.ledBulbHours)
            .replace('{{streaming}}', comparisons.streaming)
            .replace('{{googleSearches}}', comparisons.googleSearches)
            .replace('{{treesDaily}}', comparisons.treesDaily)
            .replace('{{yearlyKg}}', yearlyProjection.yearlyKg.toFixed(2))
            .replace('{{yearlyComparison}}', yearlyProjection.comparison)
            .replace('{{totalCharacters}}', metrics.totalCharacters.toLocaleString())
            .replace('{{sessionsCount}}', metrics.sessionsCount.toString())
            .replace('{{sessionAverage}}', (metrics.totalCO2Grams / Math.max(1, metrics.sessionsCount)).toFixed(2));
    }

    private _loadTemplate(relativePath: string): string {
        try {
            const filePath = path.join(this._extensionUri.fsPath, 'src', 'ui', relativePath);
            return fs.readFileSync(filePath, 'utf8');
        } catch (error) {
            console.error(`Error loading template ${relativePath}:`, error);
            return `Error: Could not load ${relativePath}. Please check the extension installation.`;
        }
    }

    public dispose() {
        StatsPanel.currentPanel = undefined;

        this._panel.dispose();

        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }
}
