import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import compression from 'compression';
import { MedicalMCPWrapper } from './medical-mcp-wrapper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = parseInt(process.env['PORT'] || '3000');

// Initialize Medical MCP Wrapper
const medicalMCP = new MedicalMCPWrapper();

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdnjs.cloudflare.com"],
            scriptSrcAttr: ["'unsafe-inline'"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com", "https://fonts.gstatic.com"], // ADDED EXTERNAL DOMAINS
            workerSrc: ["'self'"]
        }
    }
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again later.'
    }
});

app.use(limiter);
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(join(__dirname, '../../public')));

// Health check endpoint
app.get('/health', (_req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'Medical MCP Web API',
        version: '1.0.0',
        availableTools: medicalMCP.getAvailableTools()
    });
});

// API Routes

// Search for drug information
app.post('/api/drugs/search', async (req, res) => {
    try {
        const { query, limit = 10 } = req.body;
        
        if (!query) {
            return res.status(400).json({ 
                success: false,
                error: 'Query parameter is required' 
            });
        }

        const result = await medicalMCP.searchDrugs(query, limit);
        return res.json({
            success: true,
            data: result,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error('Drug search error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to search for drugs',
            message: error.message
        });
    }
});

// Get drug details by NDC
app.post('/api/drugs/details', async (req, res) => {
    try {
        const { ndc } = req.body;
        
        if (!ndc) {
            return res.status(400).json({ 
                success: false,
                error: 'NDC parameter is required' 
            });
        }

        const result = await medicalMCP.getDrugDetails(ndc);
        return res.json({
            success: true,
            data: result,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error('Drug details error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to get drug details',
            message: error.message
        });
    }
});

// Get health statistics
app.post('/api/health/statistics', async (req, res) => {
    try {
        const { indicator, country, limit = 10 } = req.body;
        
        if (!indicator) {
            return res.status(400).json({ 
                success: false,
                error: 'Indicator parameter is required' 
            });
        }

        const result = await medicalMCP.getHealthStatistics(indicator, country, limit);
        return res.json({
            success: true,
            data: result,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error('Health statistics error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to get health statistics',
            message: error.message
        });
    }
});

// Search medical literature
app.post('/api/literature/search', async (req, res) => {
    try {
        const { query, max_results = 10 } = req.body;
        
        if (!query) {
            return res.status(400).json({ 
                success: false,
                error: 'Query parameter is required' 
            });
        }

        const result = await medicalMCP.searchMedicalLiterature(query, max_results);
        return res.json({
            success: true,
            data: result,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error('Literature search error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to search medical literature',
            message: error.message
        });
    }
});

// Search drug nomenclature
app.post('/api/drugs/nomenclature', async (req, res) => {
    try {
        const { query } = req.body;
        
        if (!query) {
            return res.status(400).json({ 
                success: false,
                error: 'Query parameter is required' 
            });
        }

        const result = await medicalMCP.searchDrugNomenclature(query);
        return res.json({
            success: true,
            data: result,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error('Drug nomenclature search error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to search drug nomenclature',
            message: error.message
        });
    }
});

// Search Google Scholar
app.post('/api/scholar/search', async (req, res) => {
    try {
        const { query } = req.body;
        
        if (!query) {
            return res.status(400).json({ 
                success: false,
                error: 'Query parameter is required' 
            });
        }

        const result = await medicalMCP.searchGoogleScholar(query);
        return res.json({
            success: true,
            data: result,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error('Google Scholar search error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to search Google Scholar',
            message: error.message
        });
    }
});

// Breast cancer specific endpoints for common queries
app.post('/api/breast-cancer/drugs', async (_req, res) => {
    try {
        const breastCancerDrugs = [
            'tamoxifen', 'herceptin', 'anastrozole', 'letrozole', 
            'fulvestrant', 'pertuzumab', 'ribociclib', 'doxorubicin', 
            'cyclophosphamide'
        ];
        
        const results = await Promise.allSettled(
            breastCancerDrugs.map(drug => 
                medicalMCP.searchDrugs(drug, 3)
            )
        );

        const successfulResults = results
            .filter(result => result.status === 'fulfilled')
            .map(result => (result as PromiseFulfilledResult<any>).value);

        return res.json({
            success: true,
            data: successfulResults,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error('Breast cancer drugs error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to get breast cancer drug information',
            message: error.message
        });
    }
});

app.post('/api/breast-cancer/statistics', async (req, res) => {
    try {
        const indicators = [
            'breast cancer incidence',
            'breast cancer mortality', 
            'breast cancer survival rate',
            'breast cancer screening coverage'
        ];
        
        const { country = 'USA' } = req.body;
        
        const results = await Promise.allSettled(
            indicators.map(indicator => 
                medicalMCP.getHealthStatistics(indicator, country, 5)
            )
        );

        const successfulResults = results
            .filter(result => result.status === 'fulfilled')
            .map(result => (result as PromiseFulfilledResult<any>).value);

        return res.json({
            success: true,
            data: successfulResults,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error('Breast cancer statistics error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to get breast cancer statistics',
            message: error.message
        });
    }
});

app.post('/api/breast-cancer/research', async (_req, res) => {
    try {
        const researchTopics = [
            'breast cancer immunotherapy 2024',
            'triple negative breast cancer treatment',
            'breast cancer biomarkers prognosis',
            'BRCA1 BRCA2 breast cancer hereditary'
        ];
        
        const results = await Promise.allSettled(
            researchTopics.map(topic => 
                medicalMCP.searchMedicalLiterature(topic, 5)
            )
        );

        const successfulResults = results
            .filter(result => result.status === 'fulfilled')
            .map(result => (result as PromiseFulfilledResult<any>).value);

        return res.json({
            success: true,
            data: successfulResults,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error('Breast cancer research error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to get breast cancer research',
            message: error.message
        });
    }
});

// Generic tool endpoint (matches MCP interface)
app.post('/api/tools/:toolName', async (req, res) => {
    try {
        const { toolName } = req.params;
        const args = req.body;
        
        const result = await medicalMCP.callTool(toolName, args);
        return res.json({
            success: true,
            data: result,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error(`Tool ${req.params.toolName} error:`, error);
        return res.status(500).json({
            success: false,
            error: `Failed to execute tool: ${req.params.toolName}`,
            message: error.message
        });
    }
});

// List available tools
app.get('/api/tools', (_req, res) => {
    res.json({
        success: true,
        data: {
            tools: medicalMCP.getAvailableTools(),
            description: "Available Medical MCP tools",
            totalCount: medicalMCP.getAvailableTools().length
        },
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: process.env['NODE_ENV'] === 'development' ? err.message : 'Something went wrong'
    });
});

// Catch-all handler for SPA
app.get('*', (_req, res) => {
    res.sendFile(join(__dirname, '../../public/index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🏥 Medical MCP Web API Server running on port ${PORT}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/health`);
    console.log(`📱 Frontend: http://localhost:${PORT}`);
    console.log(`🔧 Available tools: ${medicalMCP.getAvailableTools().length}`);
});