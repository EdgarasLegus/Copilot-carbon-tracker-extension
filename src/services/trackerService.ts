import * as vscode from 'vscode';
import { CarbonCalculator, CarbonMetrics, AIModel } from '../utils/carbonCalculator';
import { TOKEN_CONSTANTS } from '../config/constants';
import { DEFAULT_MODEL } from '../config/models';

export class TrackerService {
    private metrics: CarbonMetrics;
    private storageKey = 'copilot-carbon-metrics';
    private currentModel: AIModel;

    constructor(private context: vscode.ExtensionContext) {
        this.metrics = this.loadMetrics();
        this.currentModel = this.loadModelPreference();
    }

    trackTextChange(document: vscode.TextDocument, changes: readonly vscode.TextDocumentContentChangeEvent[]): void {
        for (const change of changes) {
            if (change.text.length > TOKEN_CONSTANTS.MIN_SUGGESTION_LENGTH && change.rangeLength === 0) {
                const tokens = CarbonCalculator.estimateTokens(change.text);
                const co2 = CarbonCalculator.calculateCO2(tokens, this.currentModel);

                this.metrics.totalTokens += tokens;
                this.metrics.totalCO2Grams += co2;
                this.metrics.totalCharacters += change.text.length;
                this.metrics.suggestionsAccepted++;
                this.metrics.lastUpdateDate = Date.now();

                this.saveMetrics();
            }
        }
    }

    trackSuggestionShown(): void {
        this.metrics.suggestionsShown++;
        this.saveMetrics();
    }

    getMetrics(): CarbonMetrics {
        return { ...this.metrics };
    }

    getAcceptanceRate(): number {
        if (this.metrics.suggestionsShown === 0) {
            return 0;
        }
        return (this.metrics.suggestionsAccepted / this.metrics.suggestionsShown) * 100;
    }

    resetMetrics(): void {
        this.metrics = {
            totalTokens: 0,
            totalCO2Grams: 0,
            sessionsCount: 0,
            suggestionsAccepted: 0,
            suggestionsShown: 0,
            totalCharacters: 0,
            startDate: Date.now(),
            lastUpdateDate: Date.now()
        };
        this.saveMetrics();
    }

    incrementSession(): void {
        this.metrics.sessionsCount++;
        this.saveMetrics();
    }

    setModel(model: AIModel): void {
        this.currentModel = model;
        CarbonCalculator.setModel(model);
        this.context.globalState.update('ai-model', model);
    }

    getCurrentModel(): AIModel {
        return this.currentModel;
    }

    getDaysSinceStart(): number {
        const now = Date.now();
        const days = (now - this.metrics.startDate) / (1000 * 60 * 60 * 24);
        return Math.max(0.01, days); // Prevent division by zero
    }

    exportMetrics(): string {
        const averages = CarbonCalculator.calculateAverages(this.metrics);
        const comparisons = CarbonCalculator.getComparisons(this.metrics.totalCO2Grams);
        
        return JSON.stringify({
            metrics: this.metrics,
            averages,
            comparisons,
            model: CarbonCalculator.getCurrentModel(),
            exportDate: new Date().toISOString()
        }, null, 2);
    }

    private loadMetrics(): CarbonMetrics {
        const stored = this.context.globalState.get<CarbonMetrics>(this.storageKey);
        
        if (stored) {
            return {
                ...stored,
                totalCharacters: stored.totalCharacters || 0,
                startDate: stored.startDate || Date.now(),
                lastUpdateDate: stored.lastUpdateDate || Date.now()
            };
        }
        
        return {
            totalTokens: 0,
            totalCO2Grams: 0,
            sessionsCount: 0,
            suggestionsAccepted: 0,
            suggestionsShown: 0,
            totalCharacters: 0,
            startDate: Date.now(),
            lastUpdateDate: Date.now()
        };
    }

    private saveMetrics(): void {
        this.context.globalState.update(this.storageKey, this.metrics);
    }

    private loadModelPreference(): AIModel {
        const stored = this.context.globalState.get<AIModel>('ai-model');
        if (stored) {
            CarbonCalculator.setModel(stored);
            return stored;
        }
        
        CarbonCalculator.setModel(DEFAULT_MODEL);
        return DEFAULT_MODEL;
    }
}