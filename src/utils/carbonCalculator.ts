import { AIModel, MODEL_SPECS, DEFAULT_MODEL, getModelSpec } from '../config/models';
import { 
    CARBON_CONSTANTS, 
    TOKEN_CONSTANTS, 
    FORMAT_CONSTANTS,
    getCarbonIntensity,
    getComparisonValue 
} from '../config/constants';

export { AIModel } from '../config/models';

export interface CarbonMetrics {
    totalTokens: number;
    totalCO2Grams: number;
    sessionsCount: number;
    suggestionsAccepted: number;
    suggestionsShown: number;
    totalCharacters: number;
    startDate: number;
    lastUpdateDate: number;
}

export class CarbonCalculator {
    private static currentModel: AIModel = DEFAULT_MODEL;
    
    // Region for carbon intensity
    private static currentRegion: keyof typeof CARBON_CONSTANTS.CARBON_INTENSITY_BY_REGION = 
        CARBON_CONSTANTS.DEFAULT_REGION;

    static setModel(model: AIModel): void {
        this.currentModel = model;
    }

    static getCurrentModel(): { model: AIModel; description: string } {
        const spec = getModelSpec(this.currentModel);
        return {
            model: this.currentModel,
            description: spec.description
        };
    }

    static setRegion(region: keyof typeof CARBON_CONSTANTS.CARBON_INTENSITY_BY_REGION): void {
        this.currentRegion = region;
    }

    static getCurrentCarbonIntensity(): number {
        return getCarbonIntensity(this.currentRegion);
    }

    static calculateCO2(tokens: number, model: AIModel = this.currentModel): number {
        const spec = getModelSpec(model);
        const energyKwh = (tokens / 1000) * spec.energyPer1kTokens;
        const carbonIntensity = this.getCurrentCarbonIntensity();
        const co2Kg = energyKwh * carbonIntensity;
        return co2Kg * 1000; // Convert to grams
    }

    static estimateTokens(text: string): number {
        return Math.ceil(text.length / TOKEN_CONSTANTS.CHARS_PER_TOKEN);
    }

    static isLikelyAISuggestion(textLength: number): boolean {
        return textLength > TOKEN_CONSTANTS.MIN_SUGGESTION_LENGTH;
    }

    static getComparisons(co2Grams: number): {
        smartphones: string;
        carMiles: string;
        ledBulbHours: string;
        treesDaily: string;
        streaming: string;
        googleSearches: string;
        laptopMinutes: string;
    } {
        const decimals = FORMAT_CONSTANTS.DECIMALS.COMPARISONS;
        
        return {
            smartphones: `${(co2Grams / getComparisonValue('SMARTPHONE_CHARGE')).toFixed(decimals)} smartphone charges`,
            carMiles: `${(co2Grams / getComparisonValue('CAR_MILE')).toFixed(3)} miles in an average car`,
            ledBulbHours: `${(co2Grams / getComparisonValue('LED_BULB_HOUR')).toFixed(decimals)} hours of LED bulb`,
            treesDaily: `${(co2Grams / getComparisonValue('TREE_ABSORPTION_DAILY')).toFixed(3)} trees needed (daily)`,
            streaming: `${(co2Grams / getComparisonValue('HD_STREAMING_HOUR') * 60).toFixed(decimals)} minutes of HD video streaming`,
            googleSearches: `${(co2Grams / getComparisonValue('GOOGLE_SEARCH')).toFixed(0)} Google searches`,
            laptopMinutes: `${(co2Grams / getComparisonValue('LAPTOP_HOUR') * 60).toFixed(decimals)} minutes of laptop usage`
        };
    }

    static getPrimaryComparison(co2Grams: number): string {
        if (co2Grams < 1) {
            const percentage = (co2Grams / getComparisonValue('SMARTPHONE_CHARGE') * 100).toFixed(0);
            return `${percentage}% of a phone charge`;
        } else if (co2Grams < 10) {
            const charges = (co2Grams / getComparisonValue('SMARTPHONE_CHARGE')).toFixed(1);
            return `${charges} phone charges`;
        } else if (co2Grams < 100) {
            const minutes = (co2Grams / getComparisonValue('HD_STREAMING_HOUR') * 60).toFixed(0);
            return `${minutes} min of HD streaming`;
        } else if (co2Grams < 500) {
            const miles = (co2Grams / getComparisonValue('CAR_MILE')).toFixed(2);
            return `${miles} miles in a car`;
        } else {
            const trees = (co2Grams / getComparisonValue('TREE_ABSORPTION_DAILY')).toFixed(2);
            return `${trees} trees needed for a day`;
        }
    }

    static calculateAverages(metrics: CarbonMetrics): {
        dailyAverage: number;
        hourlyAverage: number;
        perSuggestion: number;
    } {
        const now = Date.now();
        const daysActive = Math.max(1, (now - metrics.startDate) / (1000 * 60 * 60 * 24));
        const hoursActive = Math.max(0.1, (now - metrics.startDate) / (1000 * 60 * 60));

        return {
            dailyAverage: metrics.totalCO2Grams / daysActive,
            hourlyAverage: metrics.totalCO2Grams / hoursActive,
            perSuggestion: metrics.suggestionsAccepted > 0 
                ? metrics.totalCO2Grams / metrics.suggestionsAccepted 
                : 0
        };
    }

    static projectYearly(dailyAverage: number): {
        yearlyGrams: number;
        yearlyKg: number;
        comparison: string;
    } {
        const yearlyGrams = dailyAverage * 365;
        const yearlyKg = yearlyGrams / 1000;
        
        // Compare to common yearly CO2 values
        let comparison = '';
        if (yearlyKg < 1) {
            const charges = (yearlyKg * 1000 / getComparisonValue('SMARTPHONE_CHARGE')).toFixed(0);
            comparison = `${charges} phone charges`;
        } else if (yearlyKg < 10) {
            const miles = (yearlyKg * 1000 / getComparisonValue('CAR_MILE')).toFixed(1);
            comparison = `${miles} miles driven`;
        } else {
            const trees = (yearlyKg / (getComparisonValue('TREE_ABSORPTION_YEARLY') / 1000)).toFixed(2);
            comparison = `${trees} trees needed for a year`;
        }

        return {
            yearlyGrams,
            yearlyKg,
            comparison
        };
    }

    static getAvailableModels(): Array<{ label: string; model: AIModel; description: string; provider: string }> {
        return Object.values(MODEL_SPECS).map(spec => ({
            label: spec.name,
            model: spec.id,
            description: spec.description,
            provider: spec.provider
        }));
    }

    static getModelEnergy(model: AIModel): number {
        const spec = getModelSpec(model);
        return spec.energyPer1kTokens;
    }

    static formatCO2(co2Grams: number, unit: 'g' | 'kg' = 'g'): string {
        if (unit === 'kg') {
            const kg = co2Grams / 1000;
            return `${kg.toFixed(FORMAT_CONSTANTS.DECIMALS.CO2_KG)} kg`;
        }
        return `${co2Grams.toFixed(FORMAT_CONSTANTS.DECIMALS.CO2_GRAMS)}g`;
    }

    static formatTokens(tokens: number): string {
        return tokens.toLocaleString(FORMAT_CONSTANTS.LOCALE);
    }
}