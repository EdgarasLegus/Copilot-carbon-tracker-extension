import * as vscode from 'vscode';
import { TrackerService } from './services/trackerService';
import { CarbonCalculator, AIModel } from './utils/carbonCalculator';
import { getUIEmoji } from './config/constants';
import { StatsPanel } from './ui/statsPanel';

let statusBarItem: vscode.StatusBarItem;
let trackerService: TrackerService;

export function activate(context: vscode.ExtensionContext) {
    console.log('AI Carbon Tracker is now active');

    trackerService = new TrackerService(context);
    trackerService.incrementSession();

    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'copilot-carbon-tracker.showStats';
    context.subscriptions.push(statusBarItem);
    statusBarItem.show();
    updateStatusBar();

    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(event => {
            if (event.document.uri.scheme === 'file') {
                trackerService.trackTextChange(event.document, event.contentChanges);
                updateStatusBar();
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('copilot-carbon-tracker.showStats', () => {
            StatsPanel.createOrShow(context.extensionUri, trackerService, context);
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('copilot-carbon-tracker.reset', () => {
            vscode.window.showWarningMessage(
                'Are you sure you want to reset all carbon tracking data?',
                'Yes, Reset',
                'Cancel'
            ).then(selection => {
                if (selection === 'Yes, Reset') {
                    trackerService.resetMetrics();
                    updateStatusBar();
                    vscode.window.showInformationMessage('Carbon tracker reset successfully!');
                }
            });
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('copilot-carbon-tracker.changeModel', () => {
            const models = CarbonCalculator.getAvailableModels();
            
            const groupedItems: vscode.QuickPickItem[] = [];
            const providers = new Set(models.map(m => m.provider));
            
            providers.forEach(provider => {
                groupedItems.push({
                    label: provider,
                    kind: vscode.QuickPickItemKind.Separator
                });
                
                models
                    .filter(m => m.provider === provider)
                    .forEach(m => {
                        groupedItems.push({
                            label: m.label,
                            description: m.description,
                            detail: `Energy: ${CarbonCalculator.getModelEnergy(m.model)} kWh per 1k tokens`
                        } as any);
                    });
            });
            
            vscode.window.showQuickPick(groupedItems, {
                placeHolder: 'Select the AI model you are using',
                matchOnDescription: true
            }).then(selection => {
                if (selection && selection.label) {
                    const selectedModel = models.find(m => m.label === selection.label);
                    if (selectedModel) {
                        trackerService.setModel(selectedModel.model);
                        updateStatusBar();
                        vscode.window.showInformationMessage(`Model set to ${selection.label}`);
                    }
                }
            });
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('copilot-carbon-tracker.export', async () => {
            const data = trackerService.exportMetrics();
            const uri = await vscode.window.showSaveDialog({
                defaultUri: vscode.Uri.file('ai-carbon-data.json'),
                filters: { 'JSON': ['json'] }
            });
            
            if (uri) {
                await vscode.workspace.fs.writeFile(uri, Buffer.from(data, 'utf8'));
                vscode.window.showInformationMessage('Data exported successfully!');
            }
        })
    );
}

function updateStatusBar(): void {
    const metrics = trackerService.getMetrics();
    const co2Display = CarbonCalculator.formatCO2(metrics.totalCO2Grams);
    const icon = getUIEmoji(metrics.totalCO2Grams);
    
    statusBarItem.text = `${icon} ${co2Display}`;
    statusBarItem.tooltip = `AI Carbon Tracker\nClick for detailed stats`;
}

export function deactivate() {
    if (statusBarItem) {
        statusBarItem.dispose();
    }
}