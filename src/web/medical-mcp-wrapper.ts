// Medical MCP Wrapper for Web Interface
// This wraps the original MCP tools for use in the web API

import {
  getDrugByNDC,
  getHealthIndicators,
  searchDrugs,
  searchPubMedArticles,
  searchRxNormDrugs,
  searchGoogleScholar,
} from "../mcp/utils.js";

// Type definitions for better type safety
interface DrugResult {
  brandName: string;
  genericName: string;
  manufacturer: string;
  route: string;
  dosageForm: string;
  ndc: string | null;
  purpose: string;
  lastUpdated: string;
  originalData?: any;
}

interface HealthStatistic {
  country: string;
  indicator: string;
  value: string;
  numericValue: number | null;
  year: string;
  date: string | null;
  comments: string;
  low: any;
  high: any;
  unit: string;
  source: string;
}

interface Article {
  pmid?: string;
  title: string;
  journal: string;
  publicationDate?: string;
  publicationYear: string;
  doi?: string | null;
  abstract: string;
  authors: string | string[];
  url: string | null;
  source: string;
}

interface ScholarArticle {
  title: string;
  authors: string;
  journal: string;
  year: string;
  citations: string;
  citedBy: number;
  url: string | null;
  abstract: string;
  snippet: string;
  source: string;
}

export class MedicalMCPWrapper {
  constructor() {
    console.log("🏥 Medical MCP Wrapper initialized");
  }

  // Search for drug information using FDA database
  async searchDrugs(query: string, limit: number = 10) {
    try {
      const drugs = await searchDrugs(query, limit);

      if (drugs.length === 0) {
        return {
          query,
          total: 0,
          drugs: [],
          message: `No drugs found matching "${query}"`
        };
      }

      return {
        query,
        total: drugs.length,
        drugs: drugs.map(drug => {
          const purposeText = drug.purpose?.[0] || "";
          const truncatedPurpose = purposeText.length > 200 
            ? purposeText.substring(0, 200) + "..." 
            : purposeText || "Not specified";

          return {
            brandName: drug.openfda?.brand_name?.[0] || "Unknown Brand",
            genericName: drug.openfda?.generic_name?.[0] || "Not specified",
            manufacturer: drug.openfda?.manufacturer_name?.[0] || "Not specified",
            route: drug.openfda?.route?.[0] || "Not specified",
            dosageForm: drug.openfda?.dosage_form?.[0] || "Not specified",
            ndc: drug.openfda?.product_ndc?.[0] || null,
            purpose: truncatedPurpose,
            lastUpdated: drug.effective_time || "Unknown",
            // Keep original data for detailed view
            originalData: drug
          } as DrugResult;
        })
      };
    } catch (error: any) {
      console.error("Drug search error:", error);
      throw new Error(`Drug search failed: ${error.message || "Unknown error"}`);
    }
  }

  // Get detailed information about a specific drug by NDC
  async getDrugDetails(ndc: string) {
    try {
      const drug = await getDrugByNDC(ndc);

      if (!drug) {
        throw new Error(`No drug found with NDC: ${ndc}`);
      }

      return {
        ndc,
        brandName: drug.openfda?.brand_name?.[0] || "Not specified",
        genericName: drug.openfda?.generic_name?.[0] || "Not specified",
        manufacturer: drug.openfda?.manufacturer_name?.[0] || "Not specified",
        route: drug.openfda?.route?.[0] || "Not specified",
        dosageForm: drug.openfda?.dosage_form?.[0] || "Not specified",
        lastUpdated: drug.effective_time || "Unknown",
        purpose: drug.purpose || [],
        warnings: drug.warnings?.map(w => w.substring(0, 300) + (w.length > 300 ? "..." : "")) || [],
        drugInteractions: drug.drug_interactions?.map(i => i.substring(0, 300) + (i.length > 300 ? "..." : "")) || [],
        indicationsAndUsage: (drug as any).indications_and_usage || [],
        dosageAndAdministration: drug.dosage_and_administration || [],
        contraindications: (drug as any).contraindications || [],
        adverseReactions: drug.adverse_reactions || [],
        clinicalPharmacology: drug.clinical_pharmacology || []
      };
    } catch (error: any) {
      console.error("Drug details error:", error);
      throw new Error(`Failed to get drug details: ${error.message || "Unknown error"}`);
    }
  }

  // Get health statistics from WHO Global Health Observatory
  async getHealthStatistics(indicator: string, country?: string, limit: number = 10) {
    try {
      const indicators = await getHealthIndicators(indicator, country);

      if (indicators.length === 0) {
        return {
          indicator,
          country: country || "Global",
          total: 0,
          statistics: [],
          message: `No health indicators found for "${indicator}"${country ? ` in ${country}` : ""}`
        };
      }

      const displayIndicators = indicators.slice(0, limit);
      
      return {
        indicator,
        country: country || "Global",
        total: indicators.length,
        statistics: displayIndicators.map(ind => ({
          country: ind.SpatialDim || "Unknown",
          indicator: indicator,
          value: ind.Value || "N/A",
          numericValue: ind.NumericValue || null,
          year: ind.TimeDim || "Unknown",
          date: ind.Date || null,
          comments: ind.Comments || "",
          low: ind.Low || null,
          high: ind.High || null,
          unit: (ind as any).Unit || "",
          source: "WHO Global Health Observatory"
        } as HealthStatistic))
      };
    } catch (error: any) {
      console.error("Health statistics error:", error);
      throw new Error(`Health statistics search failed: ${error.message || "Unknown error"}`);
    }
  }

  // Search for medical research articles in PubMed
  async searchMedicalLiterature(query: string, maxResults: number = 10) {
    try {
      const articles = await searchPubMedArticles(query, maxResults);

      if (articles.length === 0) {
        return {
          query,
          total: 0,
          articles: [],
          message: `No medical articles found for "${query}"`
        };
      }

      return {
        query,
        total: articles.length,
        articles: articles.map(article => ({
          pmid: article.pmid,
          title: article.title,
          journal: article.journal,
          publicationDate: article.publication_date,
          publicationYear: article.publication_date ? new Date(article.publication_date).getFullYear().toString() : "Unknown",
          doi: article.doi || null,
          abstract: article.abstract || "Abstract not available",
          authors: Array.isArray(article.authors) ? article.authors.join(", ") : (article.authors || "Authors not available"),
          url: article.pmid ? `https://pubmed.ncbi.nlm.nih.gov/${article.pmid}/` : null,
          source: "PubMed"
        }))
      };
    } catch (error: any) {
      console.error("Literature search error:", error);
      throw new Error(`Medical literature search failed: ${error.message || "Unknown error"}`);
    }
  }

  // Search for drug information using RxNorm
  async searchDrugNomenclature(query: string) {
    try {
      const drugs = await searchRxNormDrugs(query);

      if (drugs.length === 0) {
        return {
          query,
          total: 0,
          drugs: [],
          message: `No drugs found in RxNorm database for "${query}"`
        };
      }

      return {
        query,
        total: drugs.length,
        drugs: drugs.map(drug => ({
          rxcui: drug.rxcui,
          name: drug.name,
          tty: drug.tty,
          language: drug.language,
          synonym: drug.synonym?.[0] || drug.name,
          synonyms: drug.synonym || [],
          source: "RxNorm"
        }))
      };
    } catch (error: any) {
      console.error("Drug nomenclature search error:", error);
      throw new Error(`Drug nomenclature search failed: ${error.message || "Unknown error"}`);
    }
  }

  // Search for academic research articles using Google Scholar
  async searchGoogleScholar(query: string) {
    try {
      const articles = await searchGoogleScholar(query);

      if (articles.length === 0) {
        return {
          query,
          total: 0,
          articles: [],
          message: `No academic articles found for "${query}". This could be due to rate limiting or network issues.`
        };
      }

      return {
        query,
        total: articles.length,
        articles: articles.map(article => {
          const citationsStr = article.citations || "0";
          const citedBy = parseInt(citationsStr) || 0;

          return {
            title: article.title,
            authors: article.authors || "Authors not available",
            journal: article.journal || "Journal not available",
            year: article.year || "Year not available",
            citations: citationsStr,
            citedBy: citedBy,
            url: article.url || null,
            abstract: article.abstract || "Abstract not available",
            snippet: article.abstract ? article.abstract.substring(0, 300) + (article.abstract.length > 300 ? "..." : "") : "No snippet available",
            source: "Google Scholar"
          } as ScholarArticle;
        })
      };
    } catch (error: any) {
      console.error("Google Scholar search error:", error);
      throw new Error(`Google Scholar search failed: ${error.message || "Unknown error"}. This might be due to rate limiting.`);
    }
  }

  // Convenience method to get available tools
  getAvailableTools(): string[] {
    return [
      "search-drugs",
      "get-drug-details", 
      "get-health-statistics",
      "search-medical-literature",
      "search-drug-nomenclature",
      "search-google-scholar"
    ];
  }

  // Generic tool caller that matches the original MCP interface
  async callTool(toolName: string, args: any): Promise<any> {
    switch (toolName) {
      case "search-drugs":
        return this.searchDrugs(args.query, args.limit);
      
      case "get-drug-details":
        return this.getDrugDetails(args.ndc);
      
      case "get-health-statistics":
        return this.getHealthStatistics(args.indicator, args.country, args.limit);
      
      case "search-medical-literature":
        return this.searchMedicalLiterature(args.query, args.max_results);
      
      case "search-drug-nomenclature":
        return this.searchDrugNomenclature(args.query);
      
      case "search-google-scholar":
        return this.searchGoogleScholar(args.query);
      
      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }
  }
}